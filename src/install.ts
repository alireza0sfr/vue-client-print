import componentRegisterer from './plugins/components'
import { idGenerator, encode2Base64, decodeFromBase64, merge } from './plugins/general-utilities'
import { createLocalI18n } from './plugins/i18n'
import { keyValueGenerator } from './plugins/general-utilities'
// import { IRawDataset, IRawRow, IRawColumn } from '~/interfaces/datasets'
// import { IBindingObject } from '~/interfaces/elements'


export { encode2Base64, decodeFromBase64, merge, idGenerator, keyValueGenerator }
// export { IRawDataset as IDataset, IRawRow as IRow, IRawColumn as IColumn, IBindingObject }

export default {
  install: (app: any, options: any): void => {
    componentRegisterer(app)

    // creating a local $t instance so that this instance wouldn't conflict with the global $t instance
    createLocalI18n(app)
  }
}