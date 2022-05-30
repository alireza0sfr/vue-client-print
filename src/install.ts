// Import vue component
import Print from '~/components/Print.vue'
import TemplateBuilder from '~/components/TemplateBuilder.vue'
// @ts-ignore
import mixins from '../src/plugins/mixins.ts'
// @ts-ignore
import i18n from '../src/plugins/i18n.ts'

export default {
  install: (app: any, options: any): void => {
    app.component('Print', Print)
    app.component('TemplateBuilder', TemplateBuilder)
    app.mixin(mixins)
    app.use(i18n)
  }
}

export { Print, TemplateBuilder }