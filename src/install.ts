// Import vue component
import Print from '~/components/Print.vue'
import TemplateBuilder from '~/components/TemplateBuilder.vue'
// @ts-ignore
import mixins from '../src/plugins/mixins.ts'

export default {
  install: (app: any, options: any): void => {
    app.component('Print', Print)
    app.component('TemplateBuilder', TemplateBuilder)
    app.mixin(mixins)
  }
}

export { Print, TemplateBuilder }