import { createApp } from 'vue-demi'
import App from './App.vue'
// @ts-ignore
import i18n from './plugins/i18n.ts'
// @ts-ignore
import mixins from './plugins/mixins.ts'
// @ts-ignore
import componentRegisterer from './plugins/components.ts'

const app = createApp(App)
app.mixin(mixins)
app.use(i18n)
componentRegisterer(app)
app.mount('#app')