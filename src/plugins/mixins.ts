var mixins: object = {
  methods: {

    /**
     * Converts given image to base64.
     * @param {Number} n - number of digits
     * @return {String} - id
     */
    idGenerator(n: number): string {
      return Math.random().toString(36).substr(2, n)
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
     * Prepare element options before rendering.
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

        case 'dataset':
          opt.configs.originalColumnHeight = opt.styles.height // storing dataset height in originalColumnHeight to use it for column height
          opt.styles.height = 'auto'
          var displaySet = opt.configs.dataSets[opt.configs.selectedDataSet]
          var columns = displaySet.options.configs.columns
          var rows = displaySet.options.configs.rows
          for (let row of rows) {
            var objectKeys = Object.keys(row.options.configs.cells)
            for (let index = 0; index < objectKeys.length; index++) {
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