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
  BEFOREBODY = 'beforebody',
  BODY = 'body',
  AFTERBODY = 'afterbody',
  FOOTER = 'footer',
  ELEMENT = 'element',
  EMPTY = ''
}

export enum ElementGrandParents {
  TEMPLATEBUILDER = 'templatebuilder',
  PRINT = 'print',
  HEADER = 'header',
  BEFOREBODY = 'beforebody',
  BODY = 'body',
  AFTERBODY = 'afterbody',
  FOOTER = 'footer',
  ELEMENT = 'element',
  EMPTY = ''
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