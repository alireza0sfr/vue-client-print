import { config } from '@vue/test-utils'
//@ts-ignore
import mixins from '../src/plugins/mixins.ts'
config.global.mixins = [mixins]