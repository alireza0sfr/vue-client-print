import { IElement, IBindingObject, IElementCoordinates, IEmptyElement, IPrepareInstanceExtraArgs, IBindingObjectLikeElement, IDataSetLikeElement } from '~/interfaces/elements'
import { ISettings } from '~/interfaces/general'
import { IRawDataset, IRawColumn, IDatasets, IDataset, IRawDatasets, IRow, IColumn, IRawRow } from '~/interfaces/datasets'

import { getDisplaySetModes } from '~/enums/general'
import { ElementTypes, ElementGrandParents, ElementParents, StylesTargets } from '~/enums/element'

import { idGenerator, toFloatVal, clone, merge, isEmpty, instnaceMerge } from './general-utilities'

import { useBindingObjectStore } from '~/stores/binding-object'
import { useDataSetStore } from '~/stores/dataset'
import piniaInstance from './pinia-instance'

const bindingObjectStore = useBindingObjectStore(piniaInstance)
const dataSetStore = useDataSetStore(piniaInstance)

export class EmptyElement implements IEmptyElement {
  type: ElementTypes = ElementTypes.EMPTY
  id: string = emptyId
  parent: ElementParents = ElementParents.EMPTY
  grandParent: ElementGrandParents = ElementGrandParents.TEMPLATEBUILDER
  styles: any = {}
  configs: any = {}
  isChild: boolean = false
  repeatorId?: string = ''
}

export class Element extends EmptyElement implements IElement {

  protected _$el!: HTMLElement
  protected _resizerQuery!: string

  constructor(type: ElementTypes, parent: ElementParents, grandParent: ElementGrandParents, styles: any = {}, configs: any = {}, repeatorId: string = '') {
    super()
    this.type = type
    this.id = idGenerator()
    this.parent = parent
    this.grandParent = grandParent
    this.configs = configs

    var baseStyles = {
      color: '#000000',
      backgroundColor: '#ffffff'
    }

    this.styles = merge(baseStyles, styles)
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
   * returns a new instance of this class with current state
   * */
  clone() {
    return Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this))
  }

  merge(...sources: any[]) {
    return instnaceMerge<IElement>(this, ...sources)
  }

  /**
   * set !important to all styles.
   * @param {Object} styles - raw styles
   * @return {Object} - styles with !important
   */
  initStyles(styles: any = this.styles): object {

    const EXCLUDEDSTYLES = ['color', 'backgroundColor']

    for (let key in styles)
      if (styles[key].indexOf('!important') === -1 && !EXCLUDEDSTYLES.includes(key))
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
  prepareDataSetRows(rows: IRawRow[], columns: IColumn[]): IRow[] {

    var preparedRows = []

    for (let index = 0; index < rows.length; index++) {
      var activeKeys = columns.map(x => x.configs.key)

      var configsRow: any = {
        cells: [],
        stylesTarget: StylesTargets.ALL
      }

      for (let key of activeKeys)
        configsRow.cells.push({
          styles: {
            width: columns.find(x => x.configs.key === key)?.styles.width || DEFAULTCOLUMNWIDTH
          },
          value: rows[index][key]
        })

      preparedRows[index] = createElement(ElementTypes.ROW, ElementParents.EMPTY, ElementGrandParents.PRINT, {}, configsRow)
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
    if (this.repeatorId && this.isChild && settings) {

      var parentSection = this.parent
      var repeatorIndex = settings[parentSection].elements.findIndex((x: IElement) => x.id === this.repeatorId)
      var parentElement = settings[parentSection].elements[repeatorIndex]

      // if user has selected a dataset
      if (!isEmpty(parentElement.configs.dataSets) && !isEmpty(parentElement.configs.selectedDataSet)) {

        var displaySet = parentElement.configs.dataSets[parentElement.configs.selectedDataSet]
        var columns: IColumn[] = displaySet.configs.columns
        var parentKey: string = displaySet.configs.key
        var parentTitle: string = displaySet.configs.title

        for (let col of columns) {

          // columns should contains child columns to be used inside repeator
          if (col.configs.columns && col.configs.columns.length) {
            var title = `${parentTitle}-${col.configs.title}`
            var key = `${parentKey}-${col.configs.key}`

            var configs = {
              title,
              key,
              rows: [],
              columns: col.configs.columns,
            }

            var instance = createElement(ElementTypes.DATASET, ElementParents.EMPTY, ElementGrandParents.TEMPLATEBUILDER, {}, configs)
            this.configs.dataSets[key] = instance
            additional[key] = instance

          }
        }
      }
    }
    return merge({}, dataSetStore.all, additional)
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

export const DEFAULTCOLUMNWIDTH = '70px'

export const DEFAULTROWSHEIGHT = 20


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

    preparedSets[set] = createElement(ElementTypes.DATASET, ElementParents.EMPTY, ElementGrandParents.TEMPLATEBUILDER, {}, configs)
  }
  return preparedSets
}

/**
 * Preparing columns for dataset element.
 * @param {Object} columns - Raw columns.
 * @return {Object} - Prepared columns.
 */
export function prepareDataSetColumns(columns: IRawColumn[]): IColumn[] {

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

    preparedColumns[index] = createElement(ElementTypes.COLUMN, ElementParents.EMPTY, ElementGrandParents.TEMPLATEBUILDER, styles, configs)
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

/**
 * Prepare element before rendering
 * @param {Object} instance - element instance
 * @param {IPrepareInstanceExtraArgs} extraArgs - element's styles
 * @return {IElement} - prepare element
 */
export function prepareElementInstance(instance: IElement, extraArgs: IPrepareInstanceExtraArgs): IElement {
  var element: any = instance.clone()
  element.grandParent = ElementGrandParents.PRINT

  switch (element.type) {

    case ElementTypes.REPEATOR:
      var selectedDataSet = element.configs.selectedDataSet
      var displaySet = element.configs.dataSets[selectedDataSet]
      var columns = displaySet.configs.columns
      var storeRows: IRow[] = element.prepareDataSetRows(dataSetStore.getRowsByKey(selectedDataSet), columns)

      element.styles.position = 'relative'

      displaySet.configs.rows = storeRows
      break

    case ElementTypes.DATASET:
      var stylesTarget = element.configs.dataSetDefaultRow[0].configs.stylesTarget
      var selectedDataSet = element.configs.selectedDataSet
      var displaySet = element.configs.dataSets[selectedDataSet]
      var columns = displaySet.configs.columns
      var rows = dataSetStore.getRowsByKey(selectedDataSet)

      element.configs.stylesTarget = stylesTarget
      element.configs.originalColumnHeight = element.styles.height
      element.styles.height = 'auto'

      // if selectedDataSet contains "-" it means repeator's rows contains array therfore dataset should connect to child array
      var parentDataSetKey = selectedDataSet.split('-')[0]
      var childDataSetKey = selectedDataSet.split('-')[1]

      // repeator's rows contains array therfore dataset should connect to child array
      if (childDataSetKey) {
        let storeRows: any = dataSetStore.getRowsByKey(parentDataSetKey)
        rows = storeRows[extraArgs.index][childDataSetKey]
      }

      rows = element.prepareDataSetRows(rows, columns)

      for (let row of rows) {
        for (let index = 0; index < row.configs.cells.length; index++) {

          // select styles manually to prevent some row styles to be overwritten eg: bg-color / color
          let data = row.configs.cells[index]
          data.styles.width = columns[index].styles.width
          data.styles.textAlign = columns[index].styles.textAlign
          data.styles.fontWeight = columns[index].styles.fontWeight
          data.styles.fontFamily = columns[index].styles.fontFamily
          data.styles.fontSize = columns[index].styles.fontSize
          data.styles.border = columns[index].styles.border
          data.styles.borderTop = columns[index].styles.borderTop
          data.styles.borderBottom = columns[index].styles.borderBottom
          data.styles.borderLeft = columns[index].styles.borderLeft
          data.styles.borderRight = columns[index].styles.borderRight
        }
      }

      displaySet.configs.rows = rows
      break

    case ElementTypes.PAGECOUNTER:

      element.configs.currentPage = (extraArgs.index || 0) + 1
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

      if (element.repeatorId && extraArgs.repeatorInstance) {
        var dataSets = extraArgs.repeatorInstance.configs.dataSets
        var selectedDataSet = extraArgs.repeatorInstance.configs.selectedDataSet

        if (!isEmpty(dataSets) && !isEmpty(selectedDataSet)) {
          var displaySet: any = dataSets![selectedDataSet]
          var columns = displaySet.configs.columns
          let rows = displaySet.configs.rows

          // prepare bindingobject's data based on rows
          for (let key of Object.keys(bindingObject)) {

            let childDataSetKey = key.split('-')[1]

            if (childDataSetKey)
              for (let row of rows)
                (bindingObject[key] as unknown as any[]).push(row[childDataSetKey])
          }
        }
      }

      var selectedFieldData = bindingObject[field]

      if (selectedFieldData) {

        if (Array.isArray(selectedFieldData))
          element.configs.value = bindingObject[field][extraArgs.index]
        else
          element.configs.value = bindingObject[field]

      }
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

/**
* create element.
* @param {String} parent - element's parent
* @param {String} parent - element's grandParent
* @param {Object} styles - element's styles
* @param {Object} configs - element's configs
* @return {IElement} - returns instance of element class
*/
export function createElement(elementType: ElementTypes, parent: ElementParents, grandParent: ElementGrandParents = ElementGrandParents.TEMPLATEBUILDER, styles: any = {}, configs: any = {}, repeatorId: string = ''): IElement {

  switch (elementType) {

    case ElementTypes.REPEATOR:
    case ElementTypes.DATASET:
      return new DataSetLikeElement(elementType, parent, grandParent, styles, configs, repeatorId)

    case ElementTypes.BINDINGOBJECT:
    case ElementTypes.TEXTPATTERN:
      return new BindingObjectLikeElement(elementType, parent, grandParent, styles, configs, repeatorId)

    default:
      break
  }
  return new Element(elementType, parent, grandParent, styles, configs, '')
}

export function createInstnaceFromObject(element: IElement) {

  const createColumnsInstanceFromObject = (columns: IColumn[]): IColumn[] => {
    for (var col of columns) {

      if (col.configs.columns)
        createColumnsInstanceFromObject(col.configs.columns)

      col = createElement(col.type, col.parent, col.grandParent, col.styles, col.configs)
    }

    return columns
  }

  switch (element.type) {
    case ElementTypes.REPEATOR:
    case ElementTypes.DATASET:

      for (var set of Object.keys(element.configs.dataSets)) {
        element.configs.dataSets[set].configs.columns = createColumnsInstanceFromObject(element.configs.dataSets[set].configs.columns)
      }

      return createElement(element.type, element.parent, element.grandParent, element.styles, element.configs, element.repeatorId)

    default:
      break
  }

  return createElement(element.type, element.parent, element.grandParent, element.styles, element.configs, element.repeatorId)
}