import { expect, it, describe } from 'vitest'
import * as methods from '~/plugins/general-utilities'

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

  it('Nested Object', () => {
    expect(methods.findPropertyBasedOnPath(nestedObj, 'a.b.c')).toBe('found')
  })

  it('Nested Object With Array', () => {
    expect(methods.findPropertyBasedOnPath(nestedObjWithArray, 'a.b[0].c')).toBe('found')
  })
})

describe('BindingObjectGenerator', () => {

  var obj: any = {
    string: 'found',
    withoutDisplay: 'found',
    function: 'f',
    nestedObj,
    nestedObjWithArray,
    nullValue: null,
    integer: 12,
    float: 12.5,
  }

  var displays: any = {
    string: '',
    function: (property: string): string => property += 'ound',
    nestedObj: 'a.b.c',
    nestedObjWithArray: 'a.b[0].c',
  }

  var result: any = {
    string: 'found',
    withoutDisplay: 'found',
    function: 'found',
    nestedObj: 'found',
    nestedObjWithArray: 'found',
    nullValue: null,
    integer: 12,
    float: 12.5,
  }

  for (var key in obj) {
    it(`${key}`, () => expect(methods.BindingObjectGenerator({ test: obj[key] }, { test: displays[key] })).toEqual({ test: result[key] }))
  }

})

describe('Other Methods', () => {

  it('convert2Pixels', () => {

    expect(methods.convert2Pixels(22)).toBe(2112)
    expect(methods.convert2Pixels(0.5)).toBe(48)
    expect(methods.convert2Pixels(NaN)).toBe(0)

  })

  it('convert2Inches', () => {

    expect(methods.convert2Inches(2112)).toBe(22)
    expect(methods.convert2Inches(48)).toBe(0.5)
    expect(methods.convert2Inches(NaN)).toBe(0)

  })

  it('toFloatVal', () => {

    expect(methods.toFloatVal('22.02')).toBe(22.02)
    expect(methods.toFloatVal('20')).toBe(20)
    expect(methods.toFloatVal('0.5')).toBe(0.5)

  })

  it('toPersianDigits', () => {

    expect(methods.toPersianDigits(9876543210)).toBe('۹۸۷۶۵۴۳۲۱۰')

  })

  it('isObject', () => {

    expect(methods.isObject(1)).toBe(false)
    expect(methods.isObject(1.0)).toBe(false)
    expect(methods.isObject('1')).toBe(false)
    expect(methods.isObject([])).toBe(false)
    expect(methods.isObject(() => { })).toBe(false)
    expect(methods.isObject({})).toBe(true)

  })

  it('clone', () => {

    var mainObj = { a: 1 }
    var clone: any = methods.clone(mainObj)

    expect(clone).not.to.equal(mainObj)

  })

  it('merge', () => {

    var first = { a: 1 }
    var second = { b: 2 }
    var result = { a: 1, b: 2 }

    var overlap = { b: 3 }
    var resultOverlap = { a: 1, b: 3 }

    var deep1 = { a: { b: 1 } }
    var deep2 = { a: { b: 2 } }
    var resultDeep = { a: { b: 2 } }

    expect(methods.merge(first, second)).toStrictEqual(result)
    expect(first).not.to.toStrictEqual(result) // immutation
    expect(methods.merge(first, second, overlap)).toStrictEqual(resultOverlap) // overlaps
    expect(methods.merge(deep1, deep2)).toStrictEqual(resultDeep) // deep

  })

  it('encode2Base64', () => {

    var str: string = 'test'
    var result = 'dGVzdA=='

    expect(methods.encode2Base64(str)).toBe(result)

  })

  it('decodeFromBase64', () => {

    var str: string = 'dGVzdA=='
    var result = 'test'

    expect(methods.decodeFromBase64(str)).toBe(result)

  })

  it('isEmpty', () => {

    expect(methods.isEmpty(null)).toBe(true)
    expect(methods.isEmpty(undefined)).toBe(true)
    expect(methods.isEmpty([])).toBe(true)
    expect(methods.isEmpty('')).toBe(true)
    expect(methods.isEmpty({})).toBe(true)
  })
})