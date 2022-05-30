import { createI18n } from 'vue-i18n/index'
// @ts-ignore
import translations from '../assets/translations.ts'
const i18n = createI18n({
  locale: 'fa',
  fallbackLocale: 'en',
  // @ts-ignore
  messages: translations,
  globalInjection: true
})

export default i18n