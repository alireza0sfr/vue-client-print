import { IRawDataset } from './datasets'
import { IElement } from './elements'

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
}

interface IConfigs {
  maximumFileSize: number,
  language: string
}

export { ISettings, IConfigs }