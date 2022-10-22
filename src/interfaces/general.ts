import { IRawDataset } from './datasets'
import { IElement } from './elements'

interface ISettings {
  header: {
    isHeaderRepeatable: boolean,
    height: number,
    headerElements: IElement[],
    styles: {},
  },
  beforeBody: {
    height: number,
    beforeBodyElements: IElement[],
    styles: {},
  },
  body: {
    bodyElements: IElement[],
    styles: {},
  },
  afterBody: {
    height: number,
    afterBodyElements: IElement[],
    styles: {},
  },
  footer: {
    isFooterRepeatable: boolean,
    height: number,
    footerElements: IElement[],
    styles: {},
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