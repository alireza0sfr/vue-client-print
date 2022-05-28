// Import vue component
import Print from '~/components/Print.vue'
import TemplateBuilder from '~/components/TemplateBuilder.vue'
import { createI18n } from 'vue-i18n'
import translations from './assets/translations'

const i18n = createI18n({
  locale: 'fa',
  fallbackLocale: 'en',
  // @ts-ignore
  messages: translations
})


export default {
  install: (app: any, options: any): void => {
    app.component('Print', Print)
    app.component('TemplateBuilder', TemplateBuilder)
    app.use(i18n)
    console.log('app', app)
    console.log('i18n', i18n)
  }
}

export { Print, TemplateBuilder }