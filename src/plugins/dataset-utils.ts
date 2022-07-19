import { IRawDataset, IRawColumn, IDatasets, IRawDatasets, IRow, IColumn } from '../interfaces/datasets'
import mixins from './mixins'

var $methods: any
setTimeout(() => {
  $methods = mixins.methods
}, 100)

/**
 * @param {Object} sets - Raw dataset.
 * @return {Object} - Prepared dataset.
 */
function prepareDataSets(sets: IRawDatasets): IDatasets {

  var tmp: object = {}
  var keys: string[] = Object.keys(sets)
  var preparedSets = {}

  for (let set of keys) {
    var thisSet: IRawDataset = $methods.clone(sets[set]) // removing refrence to the original data.
    tmp = {
      options: {
        id: $methods.idGenerator(5),
        configs: {
          columns: prepareDataSetColumns(thisSet.columns),
          rows: prepareDataSetRows(thisSet.rows),
          title: thisSet.title,
          key: thisSet.key
        },
      }
    }
    preparedSets[set] = tmp
  }
  return preparedSets
}

/**
 * Preparing columns for dataset element.
 * @param {Object} columns - Raw columns.
 * @return {Object} - Prepared columns.
 */
function prepareDataSetColumns(columns: IRawColumn[]): IColumn[] {

  let tmp = {}
  var preparedColumns = []

  for (let index = 0; index < columns.length; index++) {
    var col = columns[index]

    tmp = {
      columns: col.columns || [], // if child has column
      title: col.title,
      key: col.key,
      isActive: true,
      hasResizer: columns.indexOf(col) !== columns.length - 1,
      type: 'column',
      options: {
        id: $methods.idGenerator(5),
        styles: {
          width: col.options.styles.width ? col.options.styles.width : '70px',
        },
      }
    }

    preparedColumns[index] = tmp
  }
  return preparedColumns
}

/** converting normal row object to dataset row objects
 * @param {Object} rows - Raw rows.
 * @return {Object} - Prepared rows.
 */
function prepareDataSetRows(rows: object[]): IRow[] {

  var preparedRows = []

  for (let index = 0; index < rows.length; index++) {
    var objectKeys = Object.keys(rows[index])
    var tempRow: IRow = {
      type: 'row',
      options: {
        id: $methods.idGenerator(5),
        styles: {},
        configs: {
          cells: {}
        }
      },
    }

    for (let key of objectKeys) {
      tempRow.options.configs.cells[key] = {
        type: 'cell',
        isActive: true,
        options: {
          id: $methods.idGenerator(5),
          styles: {},
          configs: {
            value: rows[index][key]
          },
        }
      }
    }
    preparedRows[index] = tempRow
  }
  
  return preparedRows
}

export { prepareDataSets, prepareDataSetColumns, prepareDataSetRows }