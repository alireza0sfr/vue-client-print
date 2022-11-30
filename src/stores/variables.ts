import { IVariable } from '~/interfaces/elements'
import { defineStore } from 'pinia'

interface State {
  variables: IVariable[]
}

export const useVariablesStore = defineStore('variables', {

  state: (): State => ({
    variables: [],
  }),

  actions: {
    updateVariables(payload: IVariable[]) {

      for (var variable of payload) {
        var index = this.variables.findIndex((x: IVariable) => x.variableId === variable.variableId)
        
        if (index === -1)
          this.variables.push(variable)
        else
          this.variables[index] = variable
      }

    },
    clearVariables() {
      this.$reset()
    },
    updateSingleVariable(payload: IVariable) {

      var index = this.variables?.findIndex((x: IVariable) => x.variableId === payload.variableId)
      if (index > -1)
        this.variables![index] = payload
    },
    pushVariable(payload: IVariable) {
      this.variables.push(payload)
    },
    deleteById(id: string) {
      let index = this.variables.findIndex((x: IVariable) => x.variableId === id) // delete variable from variables list
      if (index > -1)
        this.variables.splice(index, 1)
    },
  },
  getters: {
    getVariableById: (state) => {
      return (id: string) => {
        var index: number = state.variables?.findIndex((x: IVariable) => x.variableId === id)
        if (index > -1)
          return state.variables![index]

        return null
      }
    },
    all: (state) => {
      return state.variables
    }
  }
})