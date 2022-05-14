import { createApp } from 'vue'
// import { createI18n } from 'vue-i18n'
import { createI18n } from 'vue-i18n/index'
import App from './App.vue'
import translations from './assets/translations'
import mixins from './plugins/mixins'
// @ts-ignore
import componentRegisterer from './plugins/components.ts'

const i18n = createI18n({
  locale: 'fa',
  fallbackLocale: 'en',
  // @ts-ignore
  messages: translations
})

const app = createApp(App)
app.mixin(mixins)
app.use(i18n)
componentRegisterer(app)
app.mount('#app')