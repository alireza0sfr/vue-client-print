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

        return state.dataSets[key].configs.rows
      }
    }
  }
})