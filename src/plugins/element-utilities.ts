import { IElement, IBindingObject, IElementCoordinates, IEmptyElement, IPrepareInstanceExtraArgs } from '~/interfaces/elements'
import { ISettings } from '~/interfaces/general'
import { IRawDataset, IRawColumn, IDatasets, IDataset, IRawDatasets, IRow, IColumn, IRawRow } from '~/interfaces/datasets'

import { getDisplaySetModes } from '~/enums/general'
import { ElementTypes, ElementGrandParents, ElementParents, StylesTargets } from '~/enums/element'

import { idGenerator, toFloatVal, clone, merge, isEmpty } from './general-utilities'

import { useBindingObjectStore } from '~/stores/binding-object'
import { useDataSetStore } from '~/stores/dataset'
import piniaInstance from './pinia-instance'

const bindingObjectStore = useBindingObjectStore(piniaInstance)
const dataSetStore = useDataSetStore(piniaInstance)

export class EmptyElement implements IEmptyElement {
  type: ElementTypes = ElementTypes.EMPTY
  id: string = emptyId
  protected _parent: ElementParents = ElementParents.EMPTY
  protected _grandParent: ElementGrandParents = ElementGrandParents.TEMPLATEBUILDER
  styles: any = {}
  configs: any = {}
  isChild: boolean = false
  repeatorId?: string = ''

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
}

export class Element extends EmptyElement implements IElement {

  protected _$el!: HTMLElement
  protected _resizerQuery!: string

  constructor(type: ElementTypes, parent: ElementParents, grandParent: ElementGrandParents, styles: any = {}, configs: any = {}, repeatorId: string = '') {
    super()
    this.type = type
    this.id = idGenerator()
    this._parent = parent
    this._grandParent = grandParent
    this.configs = configs
    this.styles = styles
    this.isChild = false
    this.repeatorId = repeatorId
  }

  get $el(): HTMLElement {
    return this._$el
  }
  set $el(value: HTMLElement) {
    this._$el = value
  }

  get resizerQuery(): string {
    return this._resizerQuery
  }
  set resizerQuery(value: string) {
    this._resizerQuery = value
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
            newValue: this.getCoordinates('numeric'),
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
            newValue: this.getCoordinates('numeric'),
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
      element.focus()
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
  getCoordinates(returnType: string = 'string'): IElementCoordinates {

    let compStyle = getComputedStyle(this.$el)

    if (returnType === 'string')
      return {
        top: compStyle.getPropertyValue("top"),
        left: compStyle.getPropertyValue("left"),
        height: compStyle.getPropertyValue("height"),
        width: compStyle.getPropertyValue("width"),
      }

    else
      return {
        top: toFloatVal(compStyle.getPropertyValue("top")),
        left: toFloatVal(compStyle.getPropertyValue("left")),
        height: toFloatVal(compStyle.getPropertyValue("height")),
        width: toFloatVal(compStyle.getPropertyValue("width")),
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

      var configsRow: any = {
        cells: {},
        rowsHeight: 'auto',
        stylesTarget: StylesTargets.ALL
      }

      for (let key of objectKeys) {

        var configsCell = {
          isActive: true,
          value: rows[index][key]
        }

        configsRow.cells[key] = new Element(ElementTypes.CELL, ElementParents.EMPTY, ElementGrandParents.PRINT, {}, configsCell)
      }

      preparedRows[index] = new Element(ElementTypes.ROW, ElementParents.EMPTY, ElementGrandParents.PRINT, {}, configsRow)
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
    var clonedStore: IDatasets = clone(dataSetStore.all) || {}

    if (this.repeatorId && this.isChild && settings) {

      var parentSection = this.parent
      var repeatorIndex = settings[parentSection].elements.findIndex((x: IElement) => x.id === this.repeatorId)
      var parentElement = settings[parentSection].elements[repeatorIndex]

      // if user has selected a dataset
      if (!isEmpty(parentElement.configs.dataSets) && !isEmpty(parentElement.configs.selectedDataSet)) {

        var displaySet = parentElement.configs.dataSets[parentElement.configs.selectedDataSet]
        var columns: IColumn[] = displaySet.configs.columns
        var key: string = displaySet.configs.key

        for (let col of columns) {

          // columns should contains child columns to be used inside repeator
          if (col.configs.columns && col.configs.columns.length) {
            var name = `${key}-${col.configs.key}`

            var configs = {
              title: name,
              key: col.configs.key,
              rows: [],
              columns: col.configs.columns,
            }

            var instance = new Element(ElementTypes.DATASET, ElementParents.EMPTY, ElementGrandParents.TEMPLATEBUILDER, {}, configs)
            this.configs.dataSets[name] = instance
            additional[name] = instance

          }
        }
      }
    }
    return merge({}, clonedStore, additional)
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
    if (this.repeatorId && this.isChild && settings) {
      var parentSection = this.parent
      var repeatorIndex = settings[parentSection].elements.findIndex((x: IElement) => x.id === this.repeatorId)
      var parentElement = settings[parentSection].elements[repeatorIndex]

      // if user has selected a dataset
      if (!isEmpty(parentElement.configs.dataSets) && !isEmpty(parentElement.configs.selectedDataSet)) {
        var displaySet = parentElement.configs.dataSets[parentElement.configs.selectedDataSet]
        var columns: IColumn[] = displaySet.configs.columns
        var key: string = displaySet.configs.key

        for (let col of columns) {

          // if columns contains child columns it means row data will be array and can't be assigned to bindingobject
          if (col.configs.columns && col.configs.columns.length)
            continue

          var name = `${key}-${col.configs.key}`
          additional[name] = []
        }
      }
    }
    return merge({}, bindingObjectStore.all, additional)
  }

}

export const emptyId: string = '00000'

export const emptyDataSet = {
  id: emptyId,
  configs: {
    title: '',
    key: 'empty',
    rows: [],
    columns: []
  }
}


/**
 * @param {Object} sets - Raw dataset.
 * @return {Object} - Prepared dataset.
 */
export function prepareDataSets(sets: IRawDatasets): IDatasets {

  var keys: string[] = Object.keys(sets)
  var preparedSets: any = {}

  for (let set of keys) {
    var thisSet: IRawDataset = clone(sets[set]) // removing refrence to the original data.

    var configs = {
      columns: prepareDataSetColumns(thisSet.columns),
      rows: thisSet.rows,
      title: thisSet.title,
      key: thisSet.key
    }

    preparedSets[set] = new Element(ElementTypes.DATASET, ElementParents.EMPTY, ElementGrandParents.TEMPLATEBUILDER, {}, configs)
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

  var preparedColumns = []

  for (let index = 0; index < columns.length; index++) {
    var col = columns[index]

    var configs = {
      columns: col.columns && col.columns.length ? prepareDataSetColumns(col.columns) : [], // if child has column
      title: col.title,
      key: col.key,
      order: index,
      hasResizer: columns.indexOf(col) !== columns.length - 1,
    }

    var styles = {
      width: col.styles.width ? col.styles.width : DEFAULTCOLUMNWIDTH,
    }

    preparedColumns[index] = new Element(ElementTypes.COLUMN, ElementParents.EMPTY, ElementGrandParents.TEMPLATEBUILDER, styles, configs)
  }

  return preparedColumns
}

/**
 * find and returns current displaySet
 * @param {IElement} selectedElement - selected element
 * @param {ISettings} settings - settings
 * @return {IDatasets} - display set
 */
export function getDisplaySet(selectedElement: IElement, settings: ISettings | IElement | any, mode = getDisplaySetModes.TEMPLATEBUILDERCHILD): IDataset {

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

export function prepareElementInstance(instance: IElement, extraArgs: IPrepareInstanceExtraArgs): IElement {
  // var element = clone(instance)
  var element: any = instance
  element.grandParent = ElementGrandParents.PRINT

  switch (element.type) {

    case ElementTypes.PAGECOUNTER:

      element.configs.currentPage = extraArgs.index || 1
      element.configs.totalPages = extraArgs.totalPages || 1
      break

    case ElementTypes.TEXTPATTERN:
      var bindingObject: IBindingObject = element.computeBindingObject(extraArgs.settings)
      let matches = [], // an array to collect the strings that are matches
        types = [],
        regex = /{([^{]*?\w)(?=\})}/gim,
        text = element.configs.text,
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
      element.configs.value = text
      break

    case ElementTypes.BINDINGOBJECT:
      let field = element.configs.field
      var bindingObject: IBindingObject = element.computeBindingObject(extraArgs.settings)

      if (bindingObject[field])
        element.configs.value = bindingObject[field]
      else
        element.configs.value = ''
      break

    case ElementTypes.VARIABLE:
      element.styles.backgroundColor = 'white'
      break

    default:
      break
  }
  return element
}