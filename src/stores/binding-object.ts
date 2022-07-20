import { defineStore } from 'pinia'

interface State {
  bindingObject: object
}

export const useBindingObjectStore = defineStore('bindingObject', {
  
  state: (): State => ({
    bindingObject: {test: 'hello'},
  }),

  actions: {
    updateBindingObject (payload: object) {
      this.bindingObject = payload
    },
    clearBindingObject () {
      this.$reset()
    }
  }
})