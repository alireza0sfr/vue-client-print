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

interface IDataset {
  options: {
    readonly id: string,
    configs: {
      readonly key: string,
      title: string,
      rows: IRow[],
      columns: IColumn[]
    }
  }
}


interface ICellValue {
  type: string
  isActive: boolean
  options: {
    readonly id: string
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
    configs: {
      cells: ICell
    }
    styles: object
  }
}

interface IColumn extends IRawColumn {
  readonly type: string
  hasResizer: boolean
  isActive: boolean
  options: {
    readonly id: string
    styles: object
  }
}

export { IRawDataset, IRawColumn, IDataset, ICell, IRow, IColumn, IRawDatasets, IDatasets }