import { createApp } from 'vue-demi'
import App from './App.vue'
import { createLocalI18n } from './plugins/i18n'
import mixins from './plugins/mixins'
import componentRegisterer from './plugins/components'
import piniaInstance from '~/plugins/pinia-instance'

const app = createApp(App)

app.use(piniaInstance)
app.mixin(mixins)

// creating a local $t instance so that this instance wouldn't conflict with the global $t instance
createLocalI18n(app)

componentRegisterer(app)
app.mount('#app')