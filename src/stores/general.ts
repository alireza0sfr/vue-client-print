import { defineStore } from 'pinia'
import { IConfigs } from '~/interfaces/general'

interface State {
  [key: string]: any
}

export const useGeneralStore = defineStore('general', {

  state: (): State => ({
    general: {
      configurations: null,
    }
  }),

  actions: {
    update(payload: State) {
      this.general = payload
    },
    updateByKey(key: string, payload: unknown) {
      this.general[key] = payload
    },
    clear() {
      this.$reset()
    }
  },
  getters: {
    all(state) {
      return state.general
    },
    getByKey: (state) => {
      return (key: string) => {
        return state.general[key]
      }
    }
  }
})