export enum ElementTypes {
  TEXTELEMENT = 'textelement',
  BINDINGOBJECT = 'bindingobject',
  DATETIME = 'datetime',
  IMAGEELEMENT = 'imageelement',
  REPEATOR = 'repeator',
  PAGECOUNTER = 'pagecounter',
  TEXTPATTERN = 'textpattern',
  VARIABLE = 'variable',
  ROW = 'row',
  COLUMN = 'column',
  CELL = 'cell',
  DATASET = 'dataset',
  EMPTY = 'empty'
}

export enum ElementParents {
  HEADER = 'header',
  BEFOREBODY = 'beforeBody',
  BODY = 'body',
  AFTERBODY = 'afterBody',
  FOOTER = 'footer',
  REPEATOR = 'repeator',
  EMPTY = ''
}

export enum ElementGrandParents {
  TEMPLATEBUILDER = 'templatebuilder',
  PRINT = 'print'
}

export enum StylesTargets {
  ALL = 'all',
  ODD = 'odd',
  EVEN = 'even'
}

export enum VariableTypes {
  IMAGE = 'image',
  TEXT = 'text'
}