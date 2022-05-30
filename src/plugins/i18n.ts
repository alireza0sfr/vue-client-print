import { createI18n } from 'vue-i18n/index'
import translations from '../assets/translations'
const i18n = createI18n({
  locale: 'fa',
  fallbackLocale: 'en',
  // @ts-ignore
  messages: translations,
  globalInjection: true
})

export default i18n