interface IRawDataset {
  readonly key: string
  title: string
  columns: Array<IRawColumn>,
  rows?: object[]
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
}

interface IDataset extends IRawDataset {
  readonly id: number
}


interface ICellValue {
  type: string
  isActive: boolean
  options: {
    readonly id: string
    readonly parent: string
    configs: {
      value: string
    }
    styles: object
  }
}
interface ICell {
  [key: string]: ICellValue
}

interface IRow {
  readonly type: string
  options: {
    readonly id: string
    readonly parent: string
    configs: {
      cells: ICell
    }
    styles: object
  }
}

interface IColumn extends IRawColumn {
  readonly id: string
  readonly type: string
  hasResizer: boolean
  isActive: boolean
  options: object
}

export { IRawDataset, IRawColumn, IDataset, ICell, IRow, IColumn, IRawDatasets, IDatasets }