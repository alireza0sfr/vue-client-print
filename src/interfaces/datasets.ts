import { ElementGrandParents, StylesTargets } from '@/enums/element'

interface IRawDataset {
  readonly key: string
  title: string
  columns: Array<IRawColumn>,
  rows?: object[]
}

interface IDataset {
  readonly id: string,
  configs: {
    readonly key: string,
    title: string,
    rows: IRow[],
    columns: IColumn[]
  }
}

interface IRawDatasets {
  [key: string]: IRawDataset
}

interface IDatasets {
  [key: string]: IDataset
}

interface IRawColumn {
  readonly key: string
  title: string
  columns?: IRawColumn[]
  styles?: any
}

interface IColumn {
  readonly id: string
  readonly type: string
  configs: {
    readonly key: string,
    hasResizer: boolean
    columns: IColumn[]
    title: string,
    order: number,
  }
  styles?: any
}
interface ICellValue {
  readonly id: string
  type: string
  configs: {
    value: string
  }
  styles: object
}
interface ICell {
  value: string
  styles: any
}

interface IRow {
  readonly type: string
  readonly id: string
  grandParent: ElementGrandParents
  configs: {
    stylesTarget: StylesTargets
    cells: ICell[]
  }
  styles: object
}

interface IRawRow {
  [key: string]: string
}

export { IRawDataset, IDataset, ICell, IRawRow, IRow, IRawColumn, IColumn, IRawDatasets, IDatasets }