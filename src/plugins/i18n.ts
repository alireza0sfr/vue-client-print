import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import fa from '../locales/fa.json'

const i18n = createI18n({
  locale: 'en',
  messages: {
    en,
    fa
  },
})

export function createLocalI18n(app: any): void {
  app.config.globalProperties._$t = i18n.global.t
  app.config.globalProperties._$i18n = i18n.global
}

export default i18n