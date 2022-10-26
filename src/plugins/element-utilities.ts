import { IElement, IElementOptions, IBindingObject } from '~/interfaces/elements'
import { ISettings } from '~/interfaces/general'
import { IRawDataset, IRawColumn, IDatasets, IDataset, IRawDatasets, IRow, IColumn } from '../interfaces/datasets'

import { getDisplaySetModes } from '~/enums/general'

import { idGenerator, toFloatVal, clone, merge } from './general-utilities'

import { useBindingObjectStore } from '~/stores/binding-object'
import { useDataSetStore } from '~/stores/dataset'
import piniaInstance from './pinia-instance'

const bindingObjectStore = useBindingObjectStore(piniaInstance)
const dataSetStore = useDataSetStore(piniaInstance)

export default class Element {

  element: IElement
  resizerQuery: string
  $el: HTMLElement

  constructor($el: HTMLElement, resizerQuery: string, element: IElement) {
    this.$el = $el
    this.resizerQuery = resizerQuery
    this.element = element
  }

  /**
   * make element resiable
   * @emits {size-changed} call size-changed event and passes cleanedCoordinates, element, queryResizer.
   */
  resizable(): void {
    var elementSettings = this.element
    var element = this.$el
    const resizers = document.querySelectorAll(`.elem-resizer.${this.resizerQuery}`)

    for (let resizer of resizers)
      // @ts-ignore
      resizer.onmousedown = (e: any) => initDrag(e, resizer)

    element.onmousedown = this.dragable

    var startX: number, startY: number, startWidth: number, startHeight: number, originalLeft: number, originalTop: number, that = this

    function initDrag(e: any, resizer: HTMLElement): void {
      if (e.target.className.includes('elem-resizer')) { // If Clicking on the resizer
        originalLeft = element.offsetLeft
        originalTop = element.offsetTop
        startX = e.clientX
        startY = e.clientY
        startWidth = parseInt(document.defaultView!.getComputedStyle(element).width, 10)
        startHeight = parseInt(document.defaultView!.getComputedStyle(element).height, 10)
        document.onmousemove = (e) => doDrag(e, resizer)
        document.onmouseup = stopDrag
      }
    }
    function doDrag(e: any, resizer: HTMLElement): void {

      if (resizer.className.includes('right')) {

        if (that.validatePos(element, e.clientX - startX, 'width', e))
          element.style.width = startWidth + e.clientX - startX + "px"
      }

      else if (resizer.className.includes('top')) {

        if (that.validatePos(element, e.clientY - startHeight, 'height', e))
          element.style.height = startY - (e.clientY - startHeight) + "px"

        if (that.validatePos(element, e.clientY - startY, 'top', e))
          element.style.top = originalTop + (e.clientY - startY) + 'px'
      }

      else if (resizer.className.includes('bottom')) {
        if (that.validatePos(element, e.clientY - startY, 'height', e))
          element.style.height = startHeight + e.clientY - startY + "px"
      }

      else if (resizer.className.includes('left')) {
        if (that.validatePos(element, e.clientX + startX, 'width', e))
          element.style.width = startWidth - e.clientX + startX + "px"

        if (that.validatePos(element, e.clientX - startX, 'left', e))
          element.style.left = originalLeft + (e.clientX - startX) + 'px'
      }

      else if (resizer.className.includes('br')) {

        if (that.validatePos(element, e.clientX - startX, 'width', e))
          element.style.width = startWidth + e.clientX - startX + "px"

        if (that.validatePos(element, e.clientY - startY, 'height', e))
          element.style.height = startHeight + e.clientY - startY + "px"
      }

      else if (resizer.className.includes('tr')) {

        if (that.validatePos(element, e.clientX - startX, 'width', e))
          element.style.width = startWidth + e.clientX - startX + "px"

        if (that.validatePos(element, e.clientY - startHeight, 'height', e))
          element.style.height = startY - (e.clientY - startHeight) + "px"

        if (that.validatePos(element, e.clientY - startY, 'top', e))
          element.style.top = originalTop + (e.clientY - startY) + 'px'
      }

      else if (resizer.className.includes('bl')) {

        if (that.validatePos(element, e.clientX + startX, 'width', e))
          element.style.width = startWidth - e.clientX + startX + "px"

        if (that.validatePos(element, e.clientY - startY, 'height', e))
          element.style.height = startHeight + e.clientY - startY + "px"

        if (that.validatePos(element, e.clientX - startX, 'left', e))
          element.style.left = originalLeft + (e.clientX - startX) + 'px'
      }

      else if (resizer.className.includes('tl')) {

        if (that.validatePos(element, e.clientX + startX, 'width', e))
          element.style.width = startWidth - e.clientX + startX + "px"

        if (that.validatePos(element, e.clientY - startHeight, 'height', e))
          element.style.height = startY - (e.clientY - startHeight) + "px"

        if (that.validatePos(element, e.clientX - startX, 'left', e))
          element.style.left = originalLeft + (e.clientX - startX) + 'px'

        if (that.validatePos(element, e.clientY - startY, 'top', e))
          element.style.top = originalTop + (e.clientY - startY) + 'px'
      }
    }

    function stopDrag(e: any): void {
      document.onmousemove = null
      document.onmouseup = null
      element.dispatchEvent(new Event("finished-editing-element"))
      element.dispatchEvent(
        new CustomEvent('size-changed', {
          detail: {
            oldValue: {
              height: startHeight,
              width: startWidth,
              left: originalLeft,
              top: originalTop,
            },
            newValue: that.cleanedCoordinates(),
            elementDetails: { $el: that.$el, resizerQuery: that.resizerQuery, element: that.element }
          }
        })
      )
    }
  }

  /**
   * element click handler 
   * @emits {click} call click event and passes element, queryResizer.
   */
  clickable(): void {
    var element = this.$el
    var that = this
    element.addEventListener("mousedown", onClick, false)
    function onClick(e: any) {
      e.stopPropagation() // prevent event to call parent events aswell
      let selectedElements = document.getElementsByClassName('element selected')
      for (let index = 0; index < selectedElements.length; index++) {
        selectedElements[index].classList.remove('selected')
      }
      element.classList.add('selected')
      element.dispatchEvent(
        new CustomEvent('click', {
          detail: {
            elementDetails: { $el: that.$el, resizerQuery: that.resizerQuery, element: that.element }
          }
        })
      )
    }

  }

  /**
   * make element dragable
   * @emits {drag-end} call drag-end event and passes cleanedCoordinates, element, queryResizer.
   */
  dragable(): void {
    let element = this.$el
    var startX: number, startY: number, newLeft: number, newTop: number, that = this

    // move the DIV from anywhere inside the DIV:
    element.onmousedown = dragMouseDown

    function dragMouseDown(e: any): void {
      if (e.target.className.includes('resizer'))
        return

      if (e.target.className.includes('element') || e.target.offsetParent.className.includes('element')) { // if dragging element or image element/variable
        e = e || window.event
        e.preventDefault()
        // get the mouse cursor position at startup:
        startX = e.clientX
        startY = e.clientY
        document.onmouseup = closeDragElement
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag
      }

      function elementDrag(e: any): void {
        e = e || window.event
        e.preventDefault()
        // calculate the new cursor position:
        newLeft = startX - e.clientX
        newTop = startY - e.clientY
        startX = e.clientX
        startY = e.clientY

        if (that.validatePos(element, newLeft, 'left', e))
          element.style.left = element.offsetLeft - newLeft + "px"

        if (that.validatePos(element, newTop, 'top', e))
          element.style.top = element.offsetTop - newTop + "px"

      }

      function closeDragElement(): void {
        // stop moving when mouse button is released:
        document.onmouseup = null
        document.onmousemove = null
        element.dispatchEvent(new Event("finished-editing-element"))
        element.dispatchEvent(
          new CustomEvent('drag-end', {
            detail: {
              newValue: that.cleanedCoordinates(),
              elementDetails: { $el: that.$el, resizerQuery: that.resizerQuery, element: that.element }
            }
          })
        )
      }
    }
  }

  /**
   * validates new position of element
   * @params {element} element to validate
   * @params {newVal} new val position
   * @params {pos} position type
   * @params {e} js event
   * @returns {boolean} true if valid
   */
  validatePos(element: HTMLElement, newVal: number, pos: string, e: any): boolean {
    return true
    // var elementSettings = this.element
    // var pageCoordinates = document.getElementById(`${elementSettings.parent}Template`).getBoundingClientRect()

    // if (pos === 'top') {
    //   // if element doesn't go out of page from top
    //   if (element.offsetTop - newVal > 0)
    //     // if element doesn't go out of page from bottom
    //     if (element.offsetTop + element.offsetHeight - newVal < pageCoordinates.height) {
    //       // if element is on top of element or containg section
    //       var fromPoint = document.elementFromPoint(e.clientX, e.clientY)
    //       if (fromPoint && (fromPoint.id || fromPoint.id === `${elementSettings.parent}Template`))
    //         return true
    //     }
    // }

    // else if (pos === 'left') {
    //   // if element doesn't go out of page from left
    //   if (element.offsetLeft - newVal > 0)
    //     // if element doesn't go out of page from right
    //     if (element.offsetLeft + element.offsetWidth - newVal < pageCoordinates.width) {
    //       // if element is on top of element or containg section
    //       var fromPoint = document.elementFromPoint(e.clientX, e.clientY)
    //       if (fromPoint && (fromPoint.id || fromPoint.id === `${elementSettings.parent}Template`))
    //         return true
    //     }
    // }

    // else if (pos === 'width') {
    //   // if element doesn't go out of page from right
    //   if (element.offsetLeft + element.offsetWidth - newVal < pageCoordinates.width) {
    //     // if element is on top of element or containg section
    //     var fromPoint = document.elementFromPoint(e.clientX, e.clientY)
    //     if (fromPoint && (fromPoint.id || fromPoint.id === `${elementSettings.parent}Template`))
    //       return true

    //   }
    // }

    // if (pos === 'height') {
    //   // if element doesn't go out of page from bottom
    //   if (element.offsetTop + element.offsetHeight - newVal < pageCoordinates.height) {
    //     // if element is on top of element or containg section
    //     var fromPoint = document.elementFromPoint(e.clientX, e.clientY)
    //     if (fromPoint && (fromPoint.id || fromPoint.id === `${elementSettings.parent}Template`))
    //       return true
    //   }
    // }
    // return false
  }

  cleanedCoordinates(): object {
    return {
      height: toFloatVal(this.$el.style.height),
      width: toFloatVal(this.$el.style.width),
      left: toFloatVal(this.$el.style.left),
      top: toFloatVal(this.$el.style.top),
    }
  }

}

/**
 * @param {Object} sets - Raw dataset.
 * @return {Object} - Prepared dataset.
 */
export function prepareDataSets(sets: IRawDatasets): IDatasets {

  var tmp: object = {}
  var keys: string[] = Object.keys(sets)
  var preparedSets: any = {}

  for (let set of keys) {
    var thisSet: IRawDataset = clone(sets[set]) // removing refrence to the original data.
    tmp = {
      options: {
        id: idGenerator(5),
        configs: {
          columns: prepareDataSetColumns(thisSet.columns),
          rows: prepareDataSetRows(thisSet.rows || []),
          title: thisSet.title,
          key: thisSet.key
        },
      }
    }
    preparedSets[set] = tmp
  }
  return preparedSets
}

/**
 * Preparing columns for dataset element.
 * @param {Object} columns - Raw columns.
 * @return {Object} - Prepared columns.
 */
export function prepareDataSetColumns(columns: IRawColumn[]): IColumn[] {

  const DEFAULTCOLUMNWIDTH = '70px'

  let tmp = {}
  var preparedColumns = []

  for (let index = 0; index < columns.length; index++) {
    var col = columns[index]

    tmp = {
      columns: col.columns || [], // if child has column
      title: col.title,
      key: col.key,
      isActive: true,
      hasResizer: columns.indexOf(col) !== columns.length - 1,
      type: 'column',
      options: {
        id: idGenerator(5),
        styles: {
          width: col.options.styles.width ? col.options.styles.width : DEFAULTCOLUMNWIDTH,
        },
      }
    }

    preparedColumns[index] = tmp
  }

  return preparedColumns as IColumn[]
}

/** converting normal row object to dataset row objects
 * @param {Object} rows - Raw rows.
 * @return {Object} - Prepared rows.
 */
export function prepareDataSetRows(rows: any): IRow[] {

  var preparedRows = []

  for (let index = 0; index < rows.length; index++) {
    var objectKeys = Object.keys(rows[index])
    var tempRow: IRow = {
      type: 'row',
      options: {
        id: idGenerator(5),
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
          id: idGenerator(5),
          styles: {},
          configs: {
            value: rows[index][key]
          },
        }
      }
    }
    preparedRows[index] = tempRow
  }

  return preparedRows
}

/**
 * set !important to all styles.
 * @param {Object} obj - raw styles
 * @return {Object} - styles with !important
 */
export function initElementStyles(obj: any): object {

  for (let key in obj)
    if (obj[key].indexOf('!important') === -1)
      obj[key] += ' !important'

  return obj
}

/**
 * Initializing the element utilities for the created element
 * @param {HTMLElement} $el - element's html
 * @param {String} resizerQuery - resizers query
 * @param {Object} element - element's settings
 * @return {Void} - void
 */
export function initializeGeneralElement($el: HTMLElement, resizerQuery: string, element: IElement): void {
  let elem = new Element($el, resizerQuery, element)
  elem.clickable()
  elem.resizable()
  elem.dragable()
}

/**
 * prepare bindingObject
 * if its a not child element it will display the bindingObject given by the user
 * if its appended to a reapeator it will display bindingObject prop and dataset bound data
 * @param {IElement} selectedElement - selected Element
 * @param {ISettings} settings - app settings
 * @return {IBindingObject} - preapred bindingObject options
 */
export function computeBindingObject(selectedElement: IElement, settings?: ISettings | any): IBindingObject {

  let additional: any = {}
  var options = selectedElement.options

  // it's repeator's child
  if (options.repeatorId && options.isChild) {

    var parentSection = selectedElement.options.parent
    var repeatorIndex = settings[parentSection].elements.findIndex((x: IElement) => x.options.id === options.repeatorId)
    var parentElement = settings[parentSection].elements[repeatorIndex]
    var displaySet = parentElement.options.configs.dataSets[parentElement.options.configs.selectedDataSet]
    var columns: IRawColumn[] = displaySet.options.configs.columns
    var key: string = displaySet.options.configs.key

    for (let col of columns) {

      // if columns contains child columns it means row data will be array and can't be assigned to bindingobject
      if (col.columns && col.columns.length)
        continue

      var name = `${key}-${col.key}`
      additional[name] = []
    }
  }
  return merge({}, bindingObjectStore.bindingObject, additional)
}

/**
 * prepare datasets data based on repeator's selected dataset
 * @param {Array} columns - element's raw columns
 * @param {String} key - columns key
 * @return {Object} - preapred bindingObject options
 */
export function computeDatasets(selectedElement: IElement, settings?: ISettings | any): IDatasets | null {
  
  let additional: any = {}
  var options = selectedElement.options

  if (options.repeatorId && options.isChild) {

    var parentSection = selectedElement.options.parent
    var repeatorIndex = settings[parentSection].elements.findIndex((x: IElement) => x.options.id === options.repeatorId)
    var parentElement = settings[parentSection].elements[repeatorIndex]
    var displaySet = parentElement.options.configs.dataSets[parentElement.options.configs.selectedDataSet]
    var columns: IRawColumn[] = displaySet.options.configs.columns
    var key: string = displaySet.options.configs.key

    for (let col of columns) {

      // columns should contains child columns to be used inside repeator
      if (col.columns && col.columns.length) {
        var name = `${key}-${col.key}`
        additional[name] = {
          options: {
            id: idGenerator(5),
            configs: {
              title: name,
              key: col.key,
              rows: [],
              columns: prepareDataSetColumns(col.columns),
            }
          }
        }
      }
    }
  }
  return merge({}, dataSetStore.dataSets, additional)
}

/**
 * find and returns current displaySet
 * @param {IElement} selectedElement - selected element
 * @param {ISettings} settings - settings
 * @return {IDatasets} - display set
 */
 export function getDisplaySet(selectedElement: IElement, settings: ISettings | IElementOptions | any, mode = getDisplaySetModes.TEMPLATEBUILDER): IDataset {

  var displaySet

  switch (mode) {

    case getDisplaySetModes.REPEATOR:
      displaySet = settings.configs.dataSets[settings.configs.selectedDataSet]
      break

    case getDisplaySetModes.TEMPLATEBUILDER:
    default:
      var parentSection = selectedElement.options.parent
      var repeatorIndex = settings[parentSection].elements.findIndex((x: IElement) => x.options.id === selectedElement.options.repeatorId)
      var repeatorElement = settings[parentSection].elements[repeatorIndex]
      displaySet = repeatorElement.options.configs.dataSets[repeatorElement.options.configs.selectedDataSet]
      break
  }

  return displaySet

}