import { IRawDataset } from './datasets'
import { IElement, IVariable } from './elements'

interface ISettings {
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
  defaultHeightOfPaper: number,
  defaultWidthOfPaper: number
  totalHeightOfAPaper: number
  designName: string,
  orientation: string,
  pageSize: string,
  pageDirections: string,
  pageBorder: string,

  callback?(json: IJson): void
}

export interface IJson extends ISettings {
  variables: IVariable[]
}

interface IConfigs {
  maximumFileSize: number,
  language: string
}

export { ISettings, IConfigs }