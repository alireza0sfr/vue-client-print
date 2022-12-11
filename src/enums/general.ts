export enum fileEntryTypes {
  imageElement = 1,
  imageVariable,
  VCPSrcFile
}

export enum getDisplaySetModes {
  TEMPLATEBUILDERCHILD = 'templatebuilder_child', // child element of repeator
  TEMPLATEBUILDERSEPRATE = 'templatebuilder_seprate',
  REPEATOR = 'repeator'
}

export enum TemplateBuilderSections {
  HEADER = 'header',
  BEFOREBODY = 'beforeBody',
  BODY = 'body',
  AFTERBODY = 'afterBody',
  FOOTER = 'footer',
}

export enum Tabs {
  SETTINGS = 'settings',
  VARIABLES = 'variables',
  OTHERS = 'others'
}

export enum AppStates {
  TEMPLATEBUILDER = 'templatebuilder',
  PRINTPREVIEW = 'printpreview',
  EMPTY = ''
}

export enum LoggerLevels {
  LOG,
  DEBUG,
  INFO,
  WARN,
  ERROR,
  OFF = 99
}

export enum LoggerBase {
  DEBUG = '[LOGGER DEBUG]',
  LOG = '[LOGGER LOG]',
  WARN = '[LOGGER WARN]',
  ERROR = '[LOGGER ERROR]',
  INFO = '[LOGGER INFO]',
  FORCE = '[LOGGER FORCE]',
}

export enum PageOrientations {
  PORTRAIT = 'portrait',
  LANDSCAPE = 'landscape'
}

export enum PageSizes {
  A3 = 'A3',
  A4 = 'A4',
  A5 = 'A5'
}

export enum Directions {
  RTL = 'rtl',
  LTR = 'ltr'
}