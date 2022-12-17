import { IElement, IVariable } from './elements'
import { LoggerLevels, Directions, PageOrientations, PageFormats } from '~/enums/general'
export interface ISettings {
  header: {
    elements: IElement[],
    styles: {},
    height: number,
    repeatable: boolean,
  },
  beforeBody: {
    elements: IElement[],
    styles: {},
    height: number,
  },
  body: {
    elements: IElement[],
    height?: number
    styles: {},
  },
  afterBody: {
    elements: IElement[],
    styles: {},
    height: number,
  },
  footer: {
    elements: IElement[],
    styles: {},
    height: number,
    repeatable: boolean,
  },
  page: IPageDetails,
  designName: string,

  callback?(design: ISettings): void
}

export interface IPageDetails {
  format: PageFormats,
  orientation: PageOrientations,
  direction: Directions,
  border: string,
  size: PaperSizeType
}

export type PaperSizeType = Readonly<[number, number]> // height, width

export interface IFile {
  variables: IVariable[]
  design: ISettings
}

export interface IConfigs {
  maximumFileSize: number
  language: string
  imageSrc: string
  direction: string
  useAlert: boolean
  translateFunction: (key: string) => string
}

export interface ILogger {
  isDevBuild: boolean
  level: LoggerLevels
  levels: typeof LoggerLevels
  logOnBuild: boolean
  readonly DISPATCHELEMENTID: string

  validate(level: LoggerLevels, force: boolean): boolean
  alert(message: any, level?: LoggerLevels, forceAlert?: boolean): void
  time(func: () => any): void
  debug(messages: any[]): void
  log(messages: any[]): void
  force(messages: any[]): void
  warn(messages: any[]): void
  error(messages: any[]): void
  info(messages: any[]): void
  getCurrentLevel(): LoggerLevels
  setLevel(level: LoggerLevels): void
  clear(): void
  customHandler(func: () => any, level: LoggerLevels): void
  dispatchEvent(type: string, message: string): void
}