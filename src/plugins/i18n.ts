import { createI18n } from 'vue-i18n'
// @ts-ignore
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
})

export default i18n