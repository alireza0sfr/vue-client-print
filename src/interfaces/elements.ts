import { ElementGrandParents, ElementParents, ElementTypes, VariableTypes } from '~/enums/element'
import { emptyId } from '~/plugins/element-utilities'
import { IRawRow, IRow, IDatasets } from './datasets'
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

export type classType =
  'textelement' | 'bindingobject' |
  'datetime' | 'imageelement' |
  'pagecounter' | 'repeator' |
  'textpattern' | 'variable' |
  'dataset' | 'row' | 'column'

export interface IBindingObject {
  [key: string]: string
}

export interface IVariable {
  id: string
  name: string
  context: string
  variableType: VariableTypes
}

export interface IDataSetLikeElement extends IElement {
  prepareDataSetRows(rows: IRawRow[]): IRow[]
  computeDatasets(settings?: ISettings | any): IDatasets | null
}

export interface BindingObjectLikeElement extends IElement {
  computeBindingObject(settings?: ISettings | any): IBindingObject
}