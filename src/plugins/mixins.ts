import { prepareDataSetRows } from '~/plugins/element-utilities'

var mixins = {
  methods: {

    /**
     * Prepare element options before rendering
     * this method can be called from Repeators.vue & Print.vue
     * therefore, scope of this and settings can be diffrent.
     * in TB rows are unavailable and it will be set in Print Preview.
     * if print calls this method 'this.settings' points to Print.vue's settings and 'opt' points to element options.
     * if repeator calls this method 'this.settings' points to Repeator.vue's settings and 'opt' points to repeator's child's options.
     * @param {Object} options - preview settings
     * @param {String} type - element type
     * @param {Number} index - loop index
     * @return {Object} - Prepared options
     */
    prepareComponentsOptions(options: object, type: string, index: number, callback: (opt: object, bindingObject: object, key: string, index: number) => void): object {

      if (this.settings.grandParent === 'TemplateBuilder')
        return options

      let opt = this.clone(options) // Storing the options in opt
      opt.grandParent = 'Print'
      switch (type) {

        case 'repeator':
          var displaySet = opt.configs.dataSets[opt.configs.selectedDataSet] // use compute dataset again to be updated
          var rows = this.dataSets[opt.configs.selectedDataSet].rows // removing refrence to prevent recursion

          // it's normal repeator element and not a repeator of repeator
          if (!opt.repeatorId) {
            opt.configs.totalPages = this.locals.totalPages
            opt.configs.currentPage = index
          }

          // storing repeator's element's height in originalColumnHeight before settings whole element's height to auto to use it for each repeators height
          opt.styles.height = this.toFloatVal(opt.styles.height)
          // subtracting repeator's title's height from total height '24' is hard coded height for title
          opt.configs.originalHeight = opt.styles.height - 24 + 'px'
          opt.styles.height = 'auto'
          opt.styles.position = 'relative'

          rows = this.clone(rows)
          displaySet.options.configs.rows = rows
          break
        case 'dataset':
          var stylesTarget = opt.configs.defaultRow[0].options.configs.stylesTarget
          var selectedDataSet = opt.configs.selectedDataSet
          var displaySet = opt.configs.dataSets[selectedDataSet] // use computeDataSet again to be updated
          var columns = displaySet.options.configs.columns
          var rows

          // settings dataset stylesTarget based on defualtRow's stylesTarget
          opt.configs.stylesTarget = stylesTarget

          // if its called from repeator's methods therefore  dataset is in repeators options else get it's called from print's methods therefore dataset is in props
          var dataSets = opt.repeatorId ? this.settings.configs.dataSets : this.dataSets

          // if selectedDataSet contains "-" it means repeator's rows contains array therfore dataset should connect to child array
          var parentDataSetKey = selectedDataSet.split('-')[0]
          var childDataSetKey = selectedDataSet.split('-')[1]

          // repeator's rows contains array therfore dataset should connect to child array
          if (childDataSetKey)
            rows = dataSets[parentDataSetKey].options.configs.rows[index][childDataSetKey]

          // it's dataset appended to a repeator
          else if (opt.repeatorId)
            rows = dataSets[selectedDataSet].options.configs.rows

          // it's normal dataset element
          else
            rows = dataSets[selectedDataSet].rows

          // removing refrence to prevent recursion
          rows = prepareDataSetRows(this.clone(rows))
          displaySet.options.configs.rows = rows

          // storing dataset height in originalColumnHeight to use it for column height
          opt.configs.originalColumnHeight = opt.styles.height
          opt.styles.height = 'auto'

          for (let row of rows) {
            var objectKeys = Object.keys(row.options.configs.cells)
            for (let index = 0; index < objectKeys.length; index++) {

              // select styles manually to prevent some columns styles to be overwritten
              let data = row.options.configs.cells[objectKeys[index]]
              data.options.styles.width = columns[index].options.styles.width
              data.options.styles.textAlign = columns[index].options.styles.textAlign
              data.options.styles.fontWeight = columns[index].options.styles.fontWeight
              data.options.styles.fontFamily = columns[index].options.styles.fontFamily
              data.options.styles.fontSize = columns[index].options.styles.fontSize
              data.options.styles.border = columns[index].options.styles.border
              data.options.styles.borderTop = columns[index].options.styles.borderTop
              data.options.styles.borderBottom = columns[index].options.styles.borderBottom
              data.options.styles.borderLeft = columns[index].options.styles.borderLeft
              data.options.styles.borderRight = columns[index].options.styles.borderRight

              data.isActive = columns[index].isActive
            }
          }
          break

        case 'pagecounter':
          // if it's print.vue index is the main loop's index else currentPage is in repeator's options
          var currentPage = this.settings.configs ? this.settings.configs.currentPage + 1 : index
          var totalPages = this.settings.configs ? this.settings.configs.totalPages : this.locals.totalPages

          if (currentPage === 0)
            currentPage = 1

          if (totalPages === 0)
            totalPages = 1

          if (opt.configs.completeForm) {
            if (opt.configs.persianNumbers) {
              currentPage = toPersianDigits(currentPage)
              totalPages = toPersianDigits(totalPages)
              opt.configs.counter = this._$t('template-builder.pagecounter', { currentPage, totalPages })
            } else {
              opt.configs.counter = `page ${currentPage} / ${this.locals.totalPages}`
            }
          } else {
            opt.configs.counter = currentPage
          }
          break

        case 'bindingobject':
          let field = opt.configs.field
          var bindingObject: object = computeBindingObject(opt)

          // if it's repeator's bindingObject
          if (opt.repeatorId) {
            var dataSets = this.settings.configs.dataSets
            var selectedDataSet = this.settings.configs.selectedDataSet
            var displaySet = dataSets[selectedDataSet]
            var rows = dataSets[selectedDataSet].options.configs.rows

            // prepare bindingobject's data based on rows
            for (let key of Object.keys(bindingObject)) {
              let childDataSetKey = key.split('-')[1]
              if (childDataSetKey)
                for (let row of rows)
                  bindingObject[key].push(row[childDataSetKey])
            }
          }

          if (callback)
            callback(opt, bindingObject, field, index)

          else {
            if (bindingObject[field])
              opt.configs.value = bindingObject[field]
            else
              opt.configs.value = ''
          }
          break

        case 'textpattern':
          var bindingObject: object = computeBindingObject(opt)
          let matches = [], // an array to collect the strings that are matches
            types = [],
            regex = /{([^{]*?\w)(?=\})}/gim,
            text = opt.configs.text,
            curMatch

          while ((curMatch = regex.exec(text))) {
            types.push(curMatch[1])
            matches.push(curMatch[0])
          }

          for (let index = 0; index < types.length; index++) {
            text = text.replace(
              "{" + types[index] + "}",
              bindingObject[types[index]]
            )
          }
          opt.configs.value = text

          break

        case 'variable':

          opt.styles.backgroundColor = 'white'

        default:
          break
      }

      return opt
    },
  }
}

export default mixins