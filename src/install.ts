// Import vue component
import Print from '~/components/Print.vue'
import TemplateBuilder from '~/components/TemplateBuilder.vue'

export default {
  install: (app: any, options: any): void => {
    app.component('Print', Print)
    app.component('TemplateBuilder', TemplateBuilder)
  }
}

export { Print, TemplateBuilder }