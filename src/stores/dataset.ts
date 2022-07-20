import { defineStore } from 'pinia'

interface State {
  dataSet: object
}

export const useDataSetStore = defineStore('dataSet', {
  
  state: (): State => ({
    dataSet: null,
  }),

  actions: {
    updateDataSet (payload: object) {
      this.dataSet = payload
    },
    clearDataSet () {
      this.$reset()
    }
  }
})