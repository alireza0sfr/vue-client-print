import { config } from '@vue/test-utils'

config.global.mocks = {
  _$t: (text: string): string => text,
  _$i18n: { locale: ['en', 'fa'] }
}