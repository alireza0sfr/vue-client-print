import { IRawDataset } from './datasets'
import { IElement } from './elements'

interface ISettings {
  header: {
    elements: IElement[],
    styles: {},
    height: number,
    isHeaderRepeatable: boolean,
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
    isFooterRepeatable: boolean,
  },
  defaultHeightOfPaper: number,
  defaultWidthOfPaper: number
  totalHeightOfAPaper: number
  designName: string,
  orientation: string,
  pageSize: string,
  pageDirections: string,
  dataSets: IRawDataset | object,
  pageBorder: string,
}

interface IConfigs {
  maximumFileSize: number,
  language: string
}

export { ISettings, IConfigs }