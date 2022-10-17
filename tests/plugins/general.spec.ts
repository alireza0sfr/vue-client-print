import { expect, it, describe } from 'vitest'
import { findPropertyBasedOnPath, BindingObjectGenerator } from '../../src/plugins/general-utilities'

var nestedObj = {
  a: {
    b: {
      c: 'found'
    }
  }
}

var nestedObjWithArray = {
  a: {
    b: [
      {
        c: 'found'
      },
      {
        d: 'not found'
      }
    ]
  }
}

describe('findPropertyBasedOnPath', () => {

  it('Nested Ojbect', () => {
    expect(findPropertyBasedOnPath(nestedObj, 'a.b.c')).toBe('found')
  })

  it('Nested Ojbect With Array', () => {
    expect(findPropertyBasedOnPath(nestedObjWithArray, 'a.b[0].c')).toBe('found')
  })
})

describe('BindingObjectGenerator', () => {

  it('All Modes', () => {

    var obj = {
      string: 'found',
      withoutDisplay: 'found',
      function: 'f',
      nestedObj,
      nestedObjWithArray,
      nullValue: null
    }

    var displays = {
      string: '',
      function: (property: string): string => property += 'ound',
      nestedObj: 'a.b.c',
      nestedObjWithArray: 'a.b[0].c',
    }

    var result = {
      string: 'found',
      withoutDisplay: 'found',
      function: 'found',
      nestedObj: 'found',
      nestedObjWithArray: 'found',
      nullValue: null
    }

    expect(BindingObjectGenerator(obj, displays)).toEqual(result)
  })
})
