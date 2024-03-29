import { ISettings } from '~/interfaces/general'
import { TemplateBuilderSections, PageOrientations, PageFormats, Directions } from '~/enums/general'
import { DataSetLikeElement } from '~/plugins/element-utilities'
import Logger from '~/plugins/logger'
import i18nInstance from '~/plugins/i18n'

import piniaInstance from '~/plugins/pinia-instance'
import { useGeneralStore } from '~/stores/general'
import { ElementTypes } from '~/enums/element'
import { PAPERSIZES } from '@/statics/general'

const generalStore = useGeneralStore(piniaInstance)

/**
 * Converts nested object to key value pair to be used in bindingObject.
 * @param {Object} source - nested object.
 * @param {Object} displays - map to decide how to get the nested property.
 * @return {Object} - key value pair object
 */
export function keyValueGenerator(source: any, displays: any): any {

  let newObj: any = {}

  for (let key of Object.keys(source)) {

    var currentDisplay = displays[key]

    // if property is null
    if (!source[key])
      newObj[key] = null

    // if property is (string or number) and without display
    if ((typeof source[key] === 'string' || typeof source[key] === 'number') && !currentDisplay)
      newObj[key] = source[key]
  }

  for (var key of Object.keys(displays)) {

    var currentDisplay = displays[key]

    // if propperty has function as display
    if (typeof currentDisplay === 'function' && source[key])
      newObj[key] = currentDisplay(source[key])

    // if property has a path to corresponding property as display
    else if (typeof currentDisplay === 'string')
      newObj[key] = findPropertyBasedOnPath(source, currentDisplay)
  }

  return newObj
}

/**
 * Converts nested object to key value pair to be used in bindingObject.
 * @param {Object} obj - nested object.
 * @param {string} path - path to the property.
 * @return {Any} - the property
 */
export function findPropertyBasedOnPath(obj: object, path: string): any {

  var found: any = obj
  var splittedPath = path.split(".")

  while (splittedPath.length) {

    // Trying to find if there is brackets and getting index from it.
    var matchBrackets = splittedPath[0].match(/(.*?)\[(.*?)\]/)

    if (matchBrackets) { // it's array
      var property = matchBrackets[1]
      var index = parseInt(matchBrackets[2])

      if (found)
        found = found[property][index]

      splittedPath.splice(0, 1)
    }

    else { // it's object
      var property = splittedPath[0]

      if (found)
        found = found[property]

      splittedPath.splice(0, 1)
    }
  }

  return found
}


/**
 * Converts given image to base64.
 * @param {Number} n - number of digits
 * @return {String} - id
 */
export function idGenerator(n: number = 5): string {
  return Math.random().toString(36).substr(2, n)
}

/**
 * converts given pixel to inch.
 * @param {Number} pixels - pixels
 * @return {String} - given pixel to intches returns 0 if number is NaN
 */
export function convert2Inches(pixels: number): number {

  var number = parseFloat((pixels / 96).toFixed(2))

  if (Number.isNaN(number))
    return 0

  return number
}

/**
 * converts given inch to pixel.
 * @param {Number} inches - inches
 * @return {Number} - given inches to pixels returns 0 if number is NaN
 */
export function convert2Pixels(inches: number): number {

  var number = parseFloat((inches * 96).toFixed(2))

  if (Number.isNaN(number))
    return 0

  return number
}

/**
 * Check whether given item is object.
 * @param {any} item - given item to check.
 * @return {Boolean} - true if item is object.
 */
export function isObject(item: any): boolean {
  return (item && typeof item === 'object' && !Array.isArray(item))
}

/**
 * Converts the given number to persian digits.
 * @param {Number} n - given number
 * @return {string} - converted number
 */
export function toPersianDigits(n: string): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]

  return n.toString().replace(/\d/g, (x: any) => persianDigits[x])
}

/**
 * Convert string val to float.
 * @param {String} val - val.
 * @return {Number} parsed val
 */
export function toFloatVal(val: string): number {
  if (!val)
    return 0
  return parseFloat(val.split('p')[0])
}

/**
 * Deep merge sources to target object recuresively.
 * @param {Object} target - target to merge into
 * @param {Array} sources - given objects to merge
 * @return {Object} - Merged object.
 */
export function merge<T>(target: any, ...sources: any[]): T {

  if (!sources.length)
    return target

  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, {
          [key]: {}
        })
        merge(target[key], source[key])
      } else {
        Object.assign(target, {
          [key]: source[key]
        })
      }
    }
  }
  return merge(target, ...sources)
}

/**
 * merge instance of a class with given objects
 * @param {Object} instance - class instance
 * @param {Array} sources - given objects to merge
 * @return {Object} - cloned instance.
 */

export function instnaceMerge<T>(instance: any, ...sources: any[]): T {

  if (!sources.length)
    return instance

  const source = sources.shift()

  if (isEmpty(source))
    return instance

  if (instance === source)
    return instance

  if (isObject(instance) && isObject(source)) {
    for (const key in source) {

      if (!instance[key])
        instance[key] = source[key]

      else if (isObject(source[key]))
        instnaceMerge(instance[key], source[key])
    }
  }
  return instnaceMerge(instance, ...sources)
}

/**
* encode given string to base64.
* @param {String} str - given string
* @return {*} - base64
*/
export function encode2Base64(str: string): string {
  {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {

        // @ts-ignore
        return String.fromCharCode('0x' + p1)
      }))
  }
}

/**
 * decode given string to base64.
 * @param {String} str - given string
 * @return {*} - base64
 */
export function decodeFromBase64(str: string): string {
  return decodeURIComponent(atob(str).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))
}

/**
 * check if given arg is empty.
 * @param {Any} arg - raw styles
 * @return {Boolean}
 */
export function isEmpty(arg: object[] | object | string | undefined | null): boolean {

  if (!arg) // null or undefined
    return true

  if (typeof arg === 'string')
    return arg.trim().length === 0

  if (Array.isArray(arg))
    return arg.length === 0

  if (isObject(arg))
    return Object.keys(arg).length === 0

  return false
}

/**
* sync the given settings with the defaults.
* @return {Object} - returns settings objects
*/
export function getDefaultSettings(): ISettings {
  return {
    header: {
      repeatable: true,
      height: 1,
      elements: [],
      styles: {},
    },
    beforeBody: {
      height: 1,
      elements: [],
      styles: {},
    },
    body: {
      elements: [],
      styles: {},
    },
    afterBody: {
      height: 1,
      elements: [],
      styles: {},
    },
    footer: {
      repeatable: true,
      height: 1,
      elements: [],
      styles: {},
    },
    page: {
      orientation: PageOrientations.PORTRAIT,
      format: PageFormats.A4,
      direction: Directions.RTL,
      border: '',
      size: PAPERSIZES[PageFormats.A4]
    },
    designName: '',
  }
}

/**
 * Prepare settings on init
 * @param {ISettings} updatedSettings - updated Settings
 * @return {Object} - merged new settings and old/default settings
 */
export function prepareSettings(updatedSettings: ISettings): ISettings {
  var newSettings = merge<ISettings>(getDefaultSettings(), updatedSettings)

  var dir = generalStore.getByKey('configurations').direction

  if (Object.values(Directions).includes(dir))
    newSettings.page.direction = dir

  return newSettings
}

/**
 * settings validator.
 * @param {ISettings} settings - settings
 * @return {Boolean} - wether it's valid 
 */

export function validateDesign(settings: ISettings): boolean {

  var sections = Object.values(TemplateBuilderSections)

  for (let section of sections) {

    for (var element of settings[section].elements) {


      if (element instanceof DataSetLikeElement) {

        if (!element.configs.selectedDataSet) {
          var text = i18nInstance.global.t('template-builder.alerts.select-dataset')
          Logger.alert(text, Logger.levels.ERROR)
          return false
        }

        for (var set of Object.keys(element.configs.dataSets))
          element.configs.dataSets[set].configs.rows = []

        if (element.type === ElementTypes.REPEATOR) {

          for (var child of element.configs.appendedElements) {

            child.states.isNew = false
            child.$el = undefined
          }

        }

      }

      // in large projects $el property gets larger and larger and creates a circular state in instance therefore instance cant be stringified
      // but when TB opens again and new elements are created $el gets filled by init method again
      element.states.isNew = false
      element.$el = undefined
    }
  }
  return true
}