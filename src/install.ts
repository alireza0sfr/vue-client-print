// @ts-ignore
import componentRegisterer from './plugins/components.ts'
// @ts-ignore
import mixins from './plugins/mixins.ts'
// @ts-ignore
// import i18n from './plugins/i18n.ts'

export default {
  install: (app: any, options: any): void => {
    app.mixin(mixins)
    componentRegisterer(app)
    // app.use(i18n)
  }
}

export { Print, TemplateBuilder }