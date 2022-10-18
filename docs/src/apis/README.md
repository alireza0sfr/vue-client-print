---
sidebar: auto
---

# API

## Clone

Make a copy of nested objects like [lodash cloneDeep](https://lodash.com/docs/4.17.15#cloneDeep).

- Type: `function`
- Params: `object`
- Return: `object`
- Sample:

```ts
import { clone } from 'vcp'
clone(object: object): object
```

## Merge

Merge array of objects like [lodash merge](https://lodash.com/docs/4.17.15#merge).

- Type: `function`
- Params: `object[]`
- Return: `object`
- Sample:

```ts
import { merge } from 'vcp'
merge(...objects): object
```

## IdGenerator

Generate unique id.

- Type: `function`
- Params: `integer`
- Return: `string`
- Sample:

```ts
import { idGenerator } from 'vcp'
idGenerator(n: integer): string
```

## Encode2Base64

Encode given string to base64.

- Type: `function`
- Params: `string`
- Return: `string`
- Sample:

```ts
import { encode2Base64 } from 'vcp'
encode2Base64(string: string): string
```

## DecodeFromBase64

Decode given string from base64.

- Type: `function`
- Params: `string`
- Return: `string`
- Sample:

```ts
import { decodeFromBase64 } from 'vcp'
decodeFromBase64(string: string): string
```

## BindingObjectGenerator

Generate nested object to key value pairs understandable for [bindingObject](/guide/elements/bindingobject)

- Type: `function`
- Params:

  - source: `given object with nested key value pairs`
  - display: `display object to customize which properties to be used as value`
- Return: `string`
- Sample:

```ts
import { bindingObjectGenerator } from 'vcp'

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

    var obj = {
      string: 'found',
      withoutDisplay: 'found',
      function: 'f',
      nestedObj,
      nestedObjWithArray,
      nullValue: null,
      integer: 12,
      float: 12.5
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
      nullValue: null,
      integer: 12,
      float: 12.5
    }

bindingObjectGenerator(source: object[], displays: object[]): object[]
```
