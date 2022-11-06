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
    update (payload: IBindingObject) {
      this.bindingObject = payload
    },
    clear () {
      this.$reset()
    }
  },
  getters: {
    all(state) {
      return state.bindingObject
    }
  }
})