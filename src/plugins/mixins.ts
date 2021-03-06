// @ts-ignore
import ElementClass from '~/plugins/element-utilities.ts'

// @ts-ignore
import { ISettings } from '~/interfaces/general.ts'
// @ts-ignore
import { IElement } from '~/interfaces/elements.ts'
// @ts-ignore
import { IMixins } from '~/interfaces/general.ts'
// @ts-ignore
import { prepareDataSetRows, prepareDataSetColumns } from './dataset-utils.ts'
// @ts-ignore
import { IRawColumn, IDatasets, IColumn } from '~/interfaces/datasets.ts'

// @ts-ignore
import { useBindingObjectStore } from '~/stores/binding-object.ts'
// @ts-ignore
import piniaInstance from '~/plugins/pinia-instance.ts'

const bindingObjectStore = useBindingObjectStore(piniaInstance)

var mixins: IMixins = {
  methods: {

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
      const persianDigits = ["??", "??", "??", "??", "??", "??", "??", "??", "??", "??"]

      return n.toString().replace(/\d/g, (x) => persianDigits[x])
    },

    /**
     * Check whether given item is object.
     * @param {any} item - given item to check.
     * @return {Boolean} - true if item is object.
     */
    isObject(item: any): boolean {
      return (item && typeof item === 'object' && !Array.isArray(item))
    },

    /**
     * Deep clone given object.
     * @param {Object} target - Target object.
     * @return {Object} - Cloned object.
     */
    clone(target: object): object {
      return JSON.parse(JSON.stringify(target))
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
          var displaySet = opt.configs.dataSets[opt.configs.selectedDataSet]
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
          var displaySet = opt.configs.dataSets[selectedDataSet]
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
              currentPage = this.toPersianDigits(currentPage)
              totalPages = this.toPersianDigits(totalPages)
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
          var bindingObject: object = this.computeBindingObject(opt)

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
          var bindingObject: object = this.computeBindingObject(opt)
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

    /**
 * encode given string to base64.
 * @param {String} str - given string
 * @return {*} - base64
 */
    encode2Base64(str: string): string {
      {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
          function toSolidBytes(match, p1) {

            // @ts-ignore
            return String.fromCharCode('0x' + p1)
          }))
      }
    },

    /**
     * decode given string to base64.
     * @param {String} str - given string
     * @return {*} - base64
     */
    decodeFromBase64(str: string): string {
      return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
    },

    /**
     * set !important to all styles.
     * @param {Object} obj - raw styles
     * @return {Object} - styles with !important
     */
    initStyles(obj: object): object {
      for (let key in obj) {
        obj[key] += ' !important'
      }
      return obj
    },

    /**
     * check if given arg is empty.
     * @param {Any} arg - raw styles
     * @return {Boolean}
     */
    isEmpty(arg: object[] | object | string | undefined | null): boolean {

      if (!arg) // null or undefined
        return true

      if (typeof arg === 'string')
        return arg.trim().length === 0

      if (Array.isArray(arg))
        arg.length === 0

      if (this.isObject(arg))
        return Object.keys(arg).length === 0

      return false
    },

    /**
 * sync the given settings with the defaults.
 * @return {Object} - returns settings objects
 */
    getDefaultSettings(): ISettings {
      return {
        header: {
          isHeaderRepeatable: true,
          height: 1,
          headerElements: [],
          styles: {},
        },
        beforeBody: {
          height: 1,
          beforeBodyElements: [],
          styles: {},
        },
        body: {
          bodyElements: [],
          styles: {},
        },
        afterBody: {
          height: 1,
          afterBodyElements: [],
          styles: {},
        },
        footer: {
          isFooterRepeatable: true,
          height: 1,
          footerElements: [],
          styles: {},
        },
        defaultHeightOfPaper: 11.7, // Standard Height of the chosen paper in inch
        defaultWidthOfPaper: 8.26, // Standard Width of the chosen paper in inch
        totalHeightOfAPaper: 10.4, // Useable height for body tag
        designName: '',
        orientation: 'portrait',
        pageSize: 'a4',
        pageDirections: 'rtl',
        dataSets: {},
        pageBorder: '',
      }
    },

    /**
     * prepare bindingObjects data based on repeator's selected dataset
     * this method can be called for element or elements of repeator
     * if repeator calls this method 'this.settings' points to Repeator.vue's settings and 'opt' points to repeator's child's options.
     * else if element(TB/PP) calls this method 'this.settings' points to either TB settings or Print settings and 'opt' points to element's options.
     * @param {String} opt - element's options
     * @return {Object} - preapred bindingObject options
     */
    computeBindingObject(opt: IElement = this.locals.selectedElement.options): object {

      if (opt.repeatorId && opt.isChild) {
        // it's repeator's child
        var parentElement: IElement = {}

        if (opt.grandParent === 'TemplateBuilder') {
          var parent = this.locals.selectedElement.options.parent
          var index = this.settings[parent][`${parent}Elements`].findIndex(x => x.options.id === opt.repeatorId)
          parentElement = this.settings[parent][`${parent}Elements`][index]
        }

        else if (this.locals && this.locals.classType === 'repeator') {
          parentElement.options = this.settings
        }

        var displaySet = parentElement.options.configs.dataSets[parentElement.options.configs.selectedDataSet]
        var columns: IRawColumn[] = displaySet.options.configs.columns
        var key: string = displaySet.options.configs.key
        let tmp = {}

        for (let col of columns) {

          // if columns contains child columns it means row data will be array and can't be assigned to bindingobject
          if (col.columns && col.columns.length)
            continue

          var name = `${key}-${col.key}`
          tmp[name] = []
        }
        return this.merge({}, bindingObjectStore.bindingObject, tmp)
      }
      return bindingObjectStore.bindingObject
    },

    /**
     * prepare datasets data based on repeator's selected dataset
     * @param {Array} columns - element's raw columns
     * @param {String} key - columns key
     * @return {Object} - preapred bindingObject options
     */
    computeDatasets(columns: IColumn[], key: string): IDatasets {
      if (this.locals.selectedElement.repeatorId && this.locals.selectedElement.isChild) {
        var tmp = {}
        for (let col of columns) {

          if (col.columns && col.columns.length) {
            var name = `${key}-${col.key}`
            tmp[name] = {
              options: {
                id: this.idGenerator(5),
                configs: {
                  title: col.title,
                  key: col.key,
                  rows: [],
                  columns: prepareDataSetColumns(col.columns),
                }
              }
            }
          }
        }
        return tmp
      }
    },

    /**
     * Prepare settings on init
     * @param {Object} val - new Settings
     * @return {Object} - merged new settings and old/default settings
     */
    prepareSettings(val: ISettings): void {
      this.settings = this.merge(this.settings, val)
      bindingObjectStore.updateBindingObject(this.bindingObject)
    },
  }
}

export default mixins