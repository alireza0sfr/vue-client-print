import { IDatasets } from '~/interfaces/datasets'
import { defineStore } from 'pinia'

interface State {
  dataSets: IDatasets | null
}

export const useDataSetStore = defineStore('dataSets', {

  state: (): State => ({
    dataSets: null,
  }),

  actions: {
    update(payload: IDatasets) {
      this.dataSets = payload
    },
    clear() {
      this.$reset()
    }
  },
  getters: {
    all(state) {
      return state.dataSets
    },
    getRowsByKey: (state) => {
      return (key: string) => {

        if (!state.dataSets)
          return []

        // its child dataset
        if (key.includes('-')) {

          var parentDataSetKey = key.split('-')[0]
          var childDataSetKey = key.split('-')[1]
          var result: any = []

          var rows = state.dataSets[parentDataSetKey].configs.rows
          var row: any

          for (row of rows) {
            if (Array.isArray(row[childDataSetKey]))
              result = result.concat(row[childDataSetKey])
          }
          return result
        }

        return state.dataSets[key].configs.rows
      }
    }
  }
})