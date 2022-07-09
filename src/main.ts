import { createApp } from 'vue-demi'
import App from './App.vue'
// @ts-ignore
import { createLocalI18n } from './plugins/i18n.ts'
// @ts-ignore
import mixins from './plugins/mixins.ts'
// @ts-ignore
import componentRegisterer from './plugins/components.ts'

const app = createApp(App)
app.mixin(mixins)
// creating a local $t instance so that this instance wouldn't conflict with the global $t instance
createLocalI18n(app)

componentRegisterer(app)
app.mount('#app')