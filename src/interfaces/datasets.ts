interface IRawDataset {
  readonly key: string
  title: string
  columns: Array<IRawColumn>,
  rows?: object[]
}

interface IRawColumn {
  readonly key: string
  title: string
  columns?: IRawColumn[]
}

interface IDataset {
  readonly key: string
  readonly id: number
  title: string
  columns: Array<IColumn>,
  rows: Array<IRow>
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

interface IColumn {
  readonly id: string
  readonly key: string
  readonly type: string
  hasResizer: boolean
  isActive: boolean
  options: object
  title: string
  columns?: Array<IColumn>
}

export { IRawDataset, IRawColumn, IDataset, ICell, IRow, IColumn }