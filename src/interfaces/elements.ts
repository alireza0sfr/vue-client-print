interface IElement {
  readonly id: string
  readonly type: string
  readonly parent: string
  readonly grandParent: string
  options: {
    configs: object,
    styles: object
  }
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

export { IElement, IVariable, IBindingObject, classType }