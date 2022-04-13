import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import translations from './assets/translations'
import mixins from './plugins/mixins'

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: translations
})

const app = createApp(App)
app.mixin(mixins)
app.use(i18n)
app.mount('#app')