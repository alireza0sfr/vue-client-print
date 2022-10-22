import { expect, it, describe } from 'vitest'
import * as methods from '~/plugins/element-utilities'

describe('Methods', () => {

  it('initElementStyles', () => {

    var styles = {
      fontSize: '16px',
      'color': 'red',
      display: 'flex !important',
      flexDirection: 'row!important'
    }

    var result = {
      fontSize: '16px !important',
      'color': 'red !important',
      display: 'flex !important',
      flexDirection: 'row!important'
    }

    expect(methods.initElementStyles(styles)).toStrictEqual(result)
  })
})