import { defineStore } from 'pinia'

interface State {
  bindingObject: object
}

export const useBindingObjectStore = defineStore('bindingObject', {
  
  state: (): State => ({
    bindingObject: null,
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