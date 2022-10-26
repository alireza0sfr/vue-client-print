interface IElement {
  readonly type: string
  options: IElementOptions
}

interface IElementOptions {
    readonly parent: string
    readonly grandParent: string
    readonly id: string
    configs: any,
    styles: object
    isChild: boolean
    repeatorId?: string
}

interface IVariable {
  readonly uniqueId: string,
  readonly type: string,
  name: string,
  context: string,
}

type classType =
  'textelement' | 'bindingobject' |
  'datetime' | 'imageelement' |
  'pagecounter' | 'repeator' |
  'textpattern' | 'variable' |
  'dataset' | 'row' | 'column'

interface IBindingObject {
  [key: string]: string
}

export { IElement, IVariable, IBindingObject, IElementOptions, classType }