import { IVariable } from '~/interfaces/elements'
import { defineStore } from 'pinia'

interface State {
  variables: IVariable[] | null
}

export const useVariablesStore = defineStore('variables', {

  state: (): State => ({
    variables: null,
  }),

  actions: {
    updateVariables(payload: IVariable[]) {
      this.variables = payload
    },
    clearVariables() {
      this.$reset()
    },
    updateSingleVariable(payload: IVariable) {

      if (!this.variables)
        return null

      var index = this.variables?.findIndex(x => x.id === payload.id)
      if (index > -1)
        this.variables![index] = payload
    },
    pushVariable(payload: IVariable) {

      if (!this.variables)
        this.variables = [payload]

      this.variables.push(payload)
    }
  },
  getters: {
    getVariableById: (state) => {
      return (id: string) => {

        if (!state.variables)
          return null

        var index: number = state.variables?.findIndex((x: IVariable) => x.id === id)
        if (index > -1)
          return state.variables![index]

        return null
      }
    },
    getVarialbesList: (state) => {
      if (state.variables)
        return state.variables

      return []
    }
  }
})