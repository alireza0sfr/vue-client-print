// @ts-ignore
import ElementClass from '~/plugins/element-utilities.ts'
// @ts-ignore
import { IElement } from '~/interfaces/elements.ts'
// @ts-ignore
import { IRow } from '~/interfaces/datasets.ts'

var mixins: object = {
  methods: {

    /** converting normal row object to dataset row objects
     * @param {Object} rows - Raw rows.
     * @param {String} parent - Parent name.
     * @return {Object} - Prepared rows.
     */
    prepareDataSetRows(rows: object[]): IRow[] {
      for (let index = 0; index < rows.length; index++) {
        var objectKeys = Object.keys(rows[index])
        var tempRow: IRow = {
          type: 'row',
          options: {
            id: this.idGenerator(5),
            styles: {},
            configs: {
              cells: {}
            }
          },
        }

        for (let key of objectKeys) {
          tempRow.options.configs.cells[key] = {
            type: 'cell',
            isActive: true,
            options: {
              id: this.idGenerator(5),
              styles: {},
              configs: {
                value: rows[index][key]
              },
            }
          }
        }
        rows[index] = tempRow
      }
      return rows
    },

    /**
     * Initializing the element utilities for the created element
     * @param {HTMLElement} $el - element's html
     * @param {String} resizerQuery - resizers query
     * @param {Object} element - element's settings
     * @return {Void} - void
     */
    Initialize($el: HTMLElement, resizerQuery: string, element: IElement): void {
      let elem = new ElementClass($el, resizerQuery, element)
      elem.clickable()
      elem.resizable()
      elem.dragable()
    },

    /**
     * Converts given image to base64.
     * @param {Number} n - number of digits
     * @return {String} - id
     */
    idGenerator(n: number): string {
      return Math.random().toString(36).substr(2, n)
    },

    /**
     * converts given pixel to inch.
     * @param {Number} pixels - pixels
     * @return {String} - given pixel to intches
     */
    convert2Inches(pixels: number): string {
      return (pixels / 96).toFixed(2)
    },

    /**
     * converts given inch to pixel.
     * @param {Number} inches - inches
     * @return {String} - given inches to pixels
     */
    convert2Pixels(inches: number): string {
      return (inches * 96).toFixed(2)
    },

    /**
     * Converts the given html to Image and append it to the body tag.
     * @param {String} modalId - modal element id
     * @param {String} closeBtnId - close button element id
     * @return {void} - void
     */
    modalManager(modalId: string, closeBtnId: string): void {
      var modal = document.getElementById(modalId)

      // Get the <span> element that closes the modal
      var span = document.getElementById(closeBtnId)

      // When the user clicks on <span> (x), close the modal
      span.onclick = function () {
        modal.style.display = "none"
      }
    },

    /**
     * Convert string val to float.
     * @param {String} val - val.
     * @return {Number} parsed val
     */
    toFloatVal(val: string): number {
      if (!val)
        return 0
      return parseFloat(val.split('p')[0])
    },

    /**
     * Converts the given number to persian digits.
     * @param {Number} n - given number
     * @return {string} - converted number
     */
    toPersianDigits(n: number): string {
      const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]

      return n.toString().replace(/\d/g, (x) => persianDigits[x])
    },

    /**
     * Check weather given item is object.
     * @param {any} item - given item to check.
     * @return {Boolean} - true if item is object.
     */
    isObject(item: any): boolean {
      return (item && typeof item === 'object' && !Array.isArray(item))
    },

    /**
     * Deep merge sources to target object recuresively.
     * @param {Object} target - Target object.
     * @param {Array} sources - Array of sources.
     * @return {Object} - Merged object.
     */
    merge(target: object, ...sources: object[]): object {

      if (!sources.length) return target
      const source = sources.shift()

      if (this.isObject(target) && this.isObject(source)) {
        for (const key in source) {
          if (this.isObject(source[key])) {
            if (!target[key]) Object.assign(target, {
              [key]: {}
            })
            this.merge(target[key], source[key])
          } else {
            Object.assign(target, {
              [key]: source[key]
            })
          }
        }
      }

      return this.merge(target, ...sources)
    },

    /**
     * Prepare element options before rendering
     * this method can be called from Repeators.vue & Print.vue
     * therefore, scope of this and settings can be diffrent.
     * in TB rows are unavailable and it will be set in Print Preview.
     * @param {Object} options - preview settings
     * @param {String} type - element type
     * @param {Number} index - loop index
     * @return {Object} - Prepared options
     */
    prepareComponentsOptions(options: object, type: string, index: number, callback: (opt: object, bindingObject: object, key: string, index: number) => void): object {

      if (this.settings.grandParent === 'TemplateBuilder')
        return options

      let opt = JSON.parse(JSON.stringify(options)) // Storing the options in opt
      opt.grandParent = 'Print'
      switch (type) {

        case 'repeator':
          var displaySet = opt.configs.dataSets[opt.configs.selectedDataSet]
          var rows = this.dataSets[opt.configs.selectedDataSet].rows // removing refrence to prevent recursion
          var elements = opt.configs.appendedElements[opt.configs.selectedDataSet]

          opt.configs.originalHeight = opt.styles.height // storing dataset height in originalColumnHeight to use it for column height
          opt.styles.height = 'auto'

          for (let elem of elements)
            elem.options.styles.position = 'static'

          rows = JSON.parse(JSON.stringify(rows))
          displaySet.options.configs.rows = rows
          break
        case 'dataset':
          var selectedDataSet = opt.configs.selectedDataSet
          var displaySet = opt.configs.dataSets[selectedDataSet]
          var columns = displaySet.options.configs.columns
          var rows

          // if its called from repeator's methods therefore  dataset is in repeators options else get it's called from print's methods therefore dataset is in props
          var dataSets = opt.repeatorId ? this.settings.configs.dataSets : this.dataSets

          // if selectedDataSet contains "-" it means repeator's rows contains array therfore dataset should connect to child array
          const parentDataSetKey = selectedDataSet.split('-')[0]
          const childDataSetKey = selectedDataSet.split('-')[1]

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
          rows = JSON.parse(JSON.stringify(rows))
          displaySet.options.configs.rows = this.prepareDataSetRows(rows)

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
          if (opt.configs.completeForm) {
            if (opt.configs.persianNumbers) {
              var currentPage = index ? this.toPersianDigits(index) : 1
              let totalPages = this.locals.totalPages ? this.toPersianDigits(this.locals.totalPages) : 1
              opt.configs.counter = opt.configs.counter.replace('1', this.$t('template-builder.page-counter', { currentPage, totalPages }))
            } else {
              opt.configs.counter = opt.configs.counter.replace('1', `page ${currentPage} / ${this.locals.totalPages}`)
            }
          } else {
            opt.configs.counter = currentPage
          }
          break

        case 'bindingobject':
          let key = opt.configs.field
          var bindingObject = opt.configs.bindingObject

          if (callback)
            callback(opt, bindingObject, key, index)

          else {

            if (bindingObject[key])
              opt.configs.value = bindingObject[key]
            else
              opt.configs.value = ''
          }
          break

        case 'textpattern':
          var bindingObject = opt.configs.bindingObject
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