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
    updateDataSets (payload: IDatasets) {
      this.dataSets = payload
    },
    clearDataSets () {
      this.$reset()
    }
  },
  getters: {
    all(state) {
      return state.dataSets
    }
  }
})