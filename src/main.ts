import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import translations from './assets/translations'

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: translations
})

createApp(App).use(i18n).mount('#app')
