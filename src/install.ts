import componentRegisterer from './plugins/components'
import mixins from './plugins/mixins'
import { idGenerator, encode2Base64, decodeFromBase64, clone, merge } from './plugins/general-utilities'
import { createLocalI18n } from './plugins/i18n'
import { BindingObjectGenerator } from './plugins/general-utilities'
// import { IRawDataset, IRawRow, IRawColumn } from '~/interfaces/datasets'
// import { IVariable, IBindingObject } from '~/interfaces/elements'


export { encode2Base64, decodeFromBase64, merge, clone, idGenerator, BindingObjectGenerator }
// export { IRawDataset as IDataset, IRawRow as IRow, IRawColumn as IColumn, IVariable, IBindingObject }

export default {
  install: (app: any, options: any): void => {
    app.mixin(mixins)
    componentRegisterer(app)

    // creating a local $t instance so that this instance wouldn't conflict with the global $t instance
    createLocalI18n(app)
  }
}