interface IRawDataset {
  readonly key: string
  title: string
  columns: Array<IRawColumn>,
  rows?: object[]
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
  options: {
    styles?: any
  }
}

interface IColumn extends IRawColumn {
  readonly type: string
  hasResizer: boolean
  isActive: boolean
  options: {
    readonly id: string
    styles?: any
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

interface IRawRow {
  [key: string]: string
}

export { IRawDataset, IDataset, ICell, IRawRow, IRow, IRawColumn, IColumn, IRawDatasets, IDatasets }