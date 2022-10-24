import { IBindingObject } from '~/interfaces/elements'
import { defineStore } from 'pinia'

interface State {
  bindingObject: IBindingObject | null
}

export const useBindingObjectStore = defineStore('bindingObject', {
  
  state: (): State => ({
    bindingObject: null,
  }),

  actions: {
    updateBindingObject (payload: IBindingObject) {
      this.bindingObject = payload
    },
    clearBindingObject () {
      this.$reset()
    }
  }
})