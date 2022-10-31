import { ElementGrandParents, ElementParents, ElementTypes } from '~/enums/element'

export interface IElementOptions {
  readonly parent: string
  readonly grandParent: string
  readonly id: string
  configs: any,
  styles: object
  isChild: boolean
  repeatorId?: string
}

export interface IElementCoordinates {
  height: number
  width: number
  top: number
  left: number
}

export interface IElement {
  readonly type: ElementTypes
  readonly id: string
  parent: ElementParents
  grandParent: ElementGrandParents
  configs: any,
  styles: object
  isChild: boolean
  repeatorId?: string

  init(element: HTMLElement, resizerQuery: string): void
  initStyles(styles: any): object
  makeResizable(element: HTMLElement, resizerQuery: string): void
  makeDragable(element: HTMLElement): void
  makeClickable(element: HTMLElement): void
  getCoordinates(): IElementCoordinates
  validatePos(element: HTMLElement, newVal: number, pos: string, e: any): boolean
}

export interface IVariable {
  readonly uniqueId: string,
  readonly type: string,
  name: string,
  context: string,
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