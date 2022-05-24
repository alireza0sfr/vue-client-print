// Import vue component
import Print from '~/components/Print.vue'

export default {
  install: (app: any, options: any): void => {
    app.component('Print', Print)
  }
}