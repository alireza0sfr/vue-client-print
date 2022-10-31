import { IElement, IElementOptions, IBindingObject, IElementCoordinates, IEmptyElement } from '~/interfaces/elements'
import { ISettings } from '~/interfaces/general'
import { IRawDataset, IRawColumn, IDatasets, IDataset, IRawDatasets, IRow, IColumn, IRawRow } from '~/interfaces/datasets'

import { getDisplaySetModes } from '~/enums/general'
import { ElementTypes, ElementGrandParents, ElementParents } from '~/enums/element'

import { idGenerator, toFloatVal, clone, merge } from './general-utilities'

import { useBindingObjectStore } from '~/stores/binding-object'
import { useDataSetStore } from '~/stores/dataset'
import piniaInstance from './pinia-instance'

const bindingObjectStore = useBindingObjectStore(piniaInstance)
const dataSetStore = useDataSetStore(piniaInstance)

export class Element implements IElement {

  readonly type: ElementTypes
  readonly id: string
  protected _parent: ElementParents
  protected _grandParent: ElementGrandParents
  protected $el!: HTMLElement
  protected resizerQuery!: string
  configs: any
  styles: any
  isChild: boolean
  repeatorId?: string

  constructor(type: ElementTypes, parent: ElementParents, grandParent: ElementGrandParents, styles: any = {}, configs: any = {}, repeatorId: string = '') {
    this.type = type
    this.id = idGenerator(5)
    this._parent = parent
    this._grandParent = grandParent
    this.configs = configs
    this.styles = styles
    this.isChild = false
    this.repeatorId = repeatorId
  }

  get parent(): ElementParents {
    return this._parent
  }
  set parent(value: ElementParents) {
    this._parent = value
  }

  get grandParent(): ElementGrandParents {
    return this._grandParent
  }
  set grandParent(value: ElementGrandParents) {
    this._grandParent = value
  }

  /**
   * Initializing the element
   * @param {Object} element - html element
   * @param {String} resizerQuery - resizer query
   **/
  init(element: HTMLElement, resizerQuery: string) {

    this.$el = element
    this.resizerQuery = resizerQuery

    this.initStyles()
    this.makeResizable()
    this.makeDragable()
    this.makeClickable()
  }

  /**
   * set !important to all styles.
   * @param {Object} styles - raw styles
   * @return {Object} - styles with !important
   */
  initStyles(styles: any = this.styles): object {

    for (let key in styles)
      if (styles[key].indexOf('!important') === -1)
        styles[key] += ' !important'

    return styles
  }

  /**
   * make element resiable
   * @param {Object} element - html element
   * @param {String} resizerQuery - resizer query
   * @return {Void}
   * @emits {size-changed} call size-changed event and passes getCoordinates, element, queryResizer.
   */
  makeResizable(element: HTMLElement = this.$el, resizerQuery: string = this.resizerQuery): void {

    const resizers: any = document.querySelectorAll(`.elem-resizer.${resizerQuery}`)

    for (let resizer of resizers)
      resizer.onmousedown = (e: any) => initDrag(e, resizer)

    //@ts-ignore
    element.onmousedown = this.makeDragable

    var startX: number, startY: number, startWidth: number, startHeight: number, originalLeft: number, originalTop: number

    const initDrag = (e: any, resizer: HTMLElement): void => {
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
    const doDrag = (e: any, resizer: HTMLElement): void => {

      if (resizer.className.includes('right')) {

        if (this.validatePos(element, e.clientX - startX, 'width', e))
          element.style.width = startWidth + e.clientX - startX + "px"
      }

      else if (resizer.className.includes('top')) {

        if (this.validatePos(element, e.clientY - startHeight, 'height', e))
          element.style.height = startY - (e.clientY - startHeight) + "px"

        if (this.validatePos(element, e.clientY - startY, 'top', e))
          element.style.top = originalTop + (e.clientY - startY) + 'px'
      }

      else if (resizer.className.includes('bottom')) {
        if (this.validatePos(element, e.clientY - startY, 'height', e))
          element.style.height = startHeight + e.clientY - startY + "px"
      }

      else if (resizer.className.includes('left')) {
        if (this.validatePos(element, e.clientX + startX, 'width', e))
          element.style.width = startWidth - e.clientX + startX + "px"

        if (this.validatePos(element, e.clientX - startX, 'left', e))
          element.style.left = originalLeft + (e.clientX - startX) + 'px'
      }

      else if (resizer.className.includes('br')) {

        if (this.validatePos(element, e.clientX - startX, 'width', e))
          element.style.width = startWidth + e.clientX - startX + "px"

        if (this.validatePos(element, e.clientY - startY, 'height', e))
          element.style.height = startHeight + e.clientY - startY + "px"
      }

      else if (resizer.className.includes('tr')) {

        if (this.validatePos(element, e.clientX - startX, 'width', e))
          element.style.width = startWidth + e.clientX - startX + "px"

        if (this.validatePos(element, e.clientY - startHeight, 'height', e))
          element.style.height = startY - (e.clientY - startHeight) + "px"

        if (this.validatePos(element, e.clientY - startY, 'top', e))
          element.style.top = originalTop + (e.clientY - startY) + 'px'
      }

      else if (resizer.className.includes('bl')) {

        if (this.validatePos(element, e.clientX + startX, 'width', e))
          element.style.width = startWidth - e.clientX + startX + "px"

        if (this.validatePos(element, e.clientY - startY, 'height', e))
          element.style.height = startHeight + e.clientY - startY + "px"

        if (this.validatePos(element, e.clientX - startX, 'left', e))
          element.style.left = originalLeft + (e.clientX - startX) + 'px'
      }

      else if (resizer.className.includes('tl')) {

        if (this.validatePos(element, e.clientX + startX, 'width', e))
          element.style.width = startWidth - e.clientX + startX + "px"

        if (this.validatePos(element, e.clientY - startHeight, 'height', e))
          element.style.height = startY - (e.clientY - startHeight) + "px"

        if (this.validatePos(element, e.clientX - startX, 'left', e))
          element.style.left = originalLeft + (e.clientX - startX) + 'px'

        if (this.validatePos(element, e.clientY - startY, 'top', e))
          element.style.top = originalTop + (e.clientY - startY) + 'px'
      }
    }

    const stopDrag = (e: any): void => {
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
            newValue: this.getCoordinates(),
            elementDetails: { $el: element, resizerQuery: resizerQuery, element: this }
          }
        })
      )
    }
  }

  /**
   * make element dragable
   * @param {Object} element - html element
   * @return {Void}
   * @emits {drag-end} call drag-end event and passes getCoordinates, element, queryResizer.
   */
  makeDragable(element: HTMLElement = this.$el): void {

    var startX: number, startY: number, newLeft: number, newTop: number

    const elementDrag = (e: any): void => {
      e = e || window.event
      e.preventDefault()
      // calculate the new cursor position:
      newLeft = startX - e.clientX
      newTop = startY - e.clientY
      startX = e.clientX
      startY = e.clientY

      if (this.validatePos(element, newLeft, 'left', e))
        element.style.left = element.offsetLeft - newLeft + "px"

      if (this.validatePos(element, newTop, 'top', e))
        element.style.top = element.offsetTop - newTop + "px"

    }

    const closeDragElement = (): void => {
      // stop moving when mouse button is released:
      document.onmouseup = null
      document.onmousemove = null
      element.dispatchEvent(new Event("finished-editing-element"))
      element.dispatchEvent(
        new CustomEvent('drag-end', {
          detail: {
            newValue: this.getCoordinates(),
            elementDetails: { $el: element, element: this }
          }
        })
      )
    }

    const dragMouseDown = (e: any): void => {

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
    }

    // move the DIV from anywhere inside the DIV:
    element.onmousedown = dragMouseDown
  }

  /**
   * element click handler 
   * @param {Object} element - html element
   * @return {Void}
   * @emits {click} call click event and passes element, queryResizer.
   */
  makeClickable(element: HTMLElement = this.$el): void {

    const onClick = (e: any) => {
      e.stopPropagation() // prevent event to call parent events aswell
      let selectedElements = document.getElementsByClassName('element selected')
      for (let index = 0; index < selectedElements.length; index++) {
        selectedElements[index].classList.remove('selected')
      }
      element.classList.add('selected')
      element.dispatchEvent(
        new CustomEvent('click', {
          detail: {
            elementDetails: { $el: element, element: this }
          }
        })
      )
    }

    element.addEventListener("mousedown", onClick, false)

  }

  /**
   * returns element coordinates
   * @return {IElementCoordinates}
   **/
  getCoordinates(): IElementCoordinates {
    return {
      height: toFloatVal(this.$el.style.height),
      width: toFloatVal(this.$el.style.width),
      left: toFloatVal(this.$el.style.left),
      top: toFloatVal(this.$el.style.top),
    }
  }

  /**
   * validates new position of element
   * @params {HTMLElement} element to validate
   * @params {newVal} new val position
   * @params {pos} position type
   * @params {e} js event
   * @returns {boolean} true if valid
   */
  validatePos(element: HTMLElement = this.$el, newVal: number, pos: string, e: any): boolean {
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
}

export class DataSetLikeElement extends Element {

  /** converting normal row object to dataset row objects
   * @param {Object} rows - Raw rows.
   * @return {Object} - Prepared rows.
   */
  prepareDataSetRows(rows: IRawRow[]): IRow[] {

    var preparedRows = []

    for (let index = 0; index < rows.length; index++) {
      var objectKeys = Object.keys(rows[index])
      var tempRow: IRow = {
        type: ElementTypes.ROW,
        id: idGenerator(5),
        styles: {},
        configs: {
          cells: {}
        }
      }

      for (let key of objectKeys) {
        tempRow.configs.cells[key] = {
          type: ElementTypes.CELL,
          id: idGenerator(5),
          styles: {},
          configs: {
            isActive: true,
            value: rows[index][key]
          },
        }
      }
      preparedRows[index] = tempRow
    }

    return preparedRows
  }

  /**
   * prepare datasets data based on repeator's selected dataset
   * @param {ISettings} settings - app settings
   * @return {Object} - preapred bindingObject options
   */
  computeDatasets(settings?: ISettings | any): IDatasets | null {

    let additional: any = {}

    if (this.repeatorId && this.isChild) {

      var parentSection = this.parent
      var repeatorIndex = settings[parentSection].elements.findIndex((x: IElement) => x.id === this.repeatorId)
      var parentElement = settings[parentSection].elements[repeatorIndex]
      var displaySet = parentElement.configs.dataSets[parentElement.configs.selectedDataSet]
      var columns: IRawColumn[] = displaySet.configs.columns
      var key: string = displaySet.configs.key

      for (let col of columns) {

        // columns should contains child columns to be used inside repeator
        if (col.columns && col.columns.length) {
          var name = `${key}-${col.key}`
          additional[name] = {
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
    return merge({}, dataSetStore.dataSets, additional)
  }
}

export class BindingObjectLikeElement extends Element {

  /**
   * prepare bindingObject data based on repeator's selected dataset
   * @param {ISettings} settings - app settings
   * @return {IBindingObject} - preapred bindingObject options
   */
  computeBindingObject(settings?: ISettings | any): IBindingObject {

    let additional: any = {}

    // it's repeator's child
    if (this.repeatorId && this.isChild) {

      var parentSection = this.parent
      var repeatorIndex = settings[parentSection].elements.findIndex((x: IElement) => x.id === this.repeatorId)
      var parentElement = settings[parentSection].elements[repeatorIndex]
      var displaySet = parentElement.configs.dataSets[parentElement.configs.selectedDataSet]
      var columns: IRawColumn[] = displaySet.configs.columns
      var key: string = displaySet.configs.key

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

}

export class EmptyElement implements IEmptyElement {
  readonly type: ElementTypes = ElementTypes.EMPTY
  readonly id: string = emptyId
  parent: ElementParents = ElementParents.EMPTY
  grandParent: ElementGrandParents = ElementGrandParents.TEMPLATEBUILDER
  styles: any = {}
  configs: any = {}
}

export const emptyId: string = '00000'


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
      id: idGenerator(5),
      configs: {
        columns: prepareDataSetColumns(thisSet.columns),
        rows: thisSet.rows,
        title: thisSet.title,
        key: thisSet.key
      },
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
      type: ElementTypes.COLUMN,
      id: idGenerator(5),
      configs: {
        columns: col.columns || [], // if child has column
        title: col.title,
        key: col.key,
        isActive: false,
        hasResizer: columns.indexOf(col) !== columns.length - 1,
      },
      styles: {
        width: col.styles.width ? col.styles.width : DEFAULTCOLUMNWIDTH,
      },
    }

    preparedColumns[index] = tmp
  }

  return preparedColumns as IColumn[]
}

/**
 * find and returns current displaySet
 * @param {IElement} selectedElement - selected element
 * @param {ISettings} settings - settings
 * @return {IDatasets} - display set
 */
export function getDisplaySet(selectedElement: IElement, settings: ISettings | IElementOptions | any, mode = getDisplaySetModes.TEMPLATEBUILDERCHILD): IDataset {

  var displaySet

  switch (mode) {

    case getDisplaySetModes.REPEATOR:
      displaySet = settings.configs.dataSets[settings.configs.selectedDataSet]
      break

    case getDisplaySetModes.TEMPLATEBUILDERSEPRATE:
      displaySet = selectedElement.configs.dataSets[selectedElement.configs.selectedDataSet]
      break

    case getDisplaySetModes.TEMPLATEBUILDERCHILD:
    default:
      var parentSection = selectedElement.parent
      var repeatorIndex = settings[parentSection].elements.findIndex((x: IElement) => x.id === selectedElement.repeatorId)
      var repeatorElement = settings[parentSection].elements[repeatorIndex]
      displaySet = repeatorElement.configs.dataSets[repeatorElement.configs.selectedDataSet]
      break
  }

  return displaySet

}