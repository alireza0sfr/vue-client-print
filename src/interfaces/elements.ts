import { ElementGrandParents, ElementParents, ElementTypes, VariableTypes } from '~/enums/element'
import { emptyId } from '~/plugins/element-utilities'
import { IRawRow, IRow, IDatasets, IColumn } from './datasets'
import { ISettings } from './general'

export interface IElementCoordinates {
  height: string | number
  width: string | number
  top: string | number
  left: string | number
}

export interface IEmptyElement {
  type: ElementTypes
  id: typeof emptyId
  parent: ElementParents
  grandParent: ElementGrandParents
  styles: any
  configs: any
  isChild: boolean
  repeatorId?: string
}

export interface IElement extends IEmptyElement {

  $el?: HTMLElement
  resizerQuery?: string

  init(element: HTMLElement, resizerQuery: string): void
  initStyles(styles: any): object
  makeResizable(element: HTMLElement, resizerQuery: string): void
  makeDragable(element: HTMLElement): void
  makeClickable(element: HTMLElement): void
  getCoordinates(returnType: string): IElementCoordinates
  validatePos(element: HTMLElement, newVal: number, pos: string, e: any): boolean
}

export interface ICreateElementExtraArgs {
  e?: any,
  variable?: IVariable | IEmptyElement,
  styles?: any,
  configs?: any
}

export interface IBindingObject {
  [key: string]: string
}

export interface IVariable {
  variableId: string
  name: string
  context: string
  variableType: VariableTypes
}

export interface IDataSetLikeElement extends IElement {
  prepareDataSetRows(rows: IRawRow[], columns: IColumn[]): IRow[]
  computeDatasets(settings?: ISettings | any): IDatasets | null
}

export interface IBindingObjectLikeElement extends IElement {
  computeBindingObject(settings?: ISettings | any): IBindingObject
}

export interface IPrepareInstanceExtraArgs {
  index: number
  settings: ISettings,
  // currentPage: number
  totalPages?: number
  repeatorInstance?: IDataSetLikeElement
}