// @ts-ignore
import componentRegisterer from './plugins/components.ts'
// @ts-ignore
import mixins from './plugins/mixins.ts'
// @ts-ignore
import { createLocalI18n } from './plugins/i18n.ts'

const _encode2Base64 = mixins.methods.encode2Base64
const _decodeFromBase64 = mixins.methods.decodeFromBase64
const _merge = mixins.methods.merge
const _clone = mixins.methods.clone
const _idGenerator = mixins.methods.idGenerator

export { _encode2Base64 as encode2Base64, _decodeFromBase64 as decodeFromBase64, _merge as merge, _clone as clone, _idGenerator as idGenerator }

export default {
  install: (app: any, options: any): void => {
    app.mixin(mixins)
    componentRegisterer(app)
    
    // creating a local $t instance so that this instance wouldn't conflict with the global $t instance
    createLocalI18n(app)
  }
}