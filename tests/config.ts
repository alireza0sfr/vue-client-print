import { config } from '@vue/test-utils'
import mixins from '../src/plugins/mixins'

config.global.mixins = [mixins]
config.global.mocks = {
  _$t: (text: string): string => text,
  _$i18n: { locale: ['en', 'fa'] }
}