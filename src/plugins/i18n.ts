import { createI18n } from 'vue-i18n'
// @ts-ignore
// import translations from '../assets/translations.ts'
import en from '../locales/en.json';
// @ts-ignore
import fa from '../locales/fa.json';

const i18n = createI18n({
  locale: 'fa',
  fallbackLocale: 'en',
  // @ts-ignore
  messages: {
    en,
    fa
  },
  globalInjection: true
})

export default i18n