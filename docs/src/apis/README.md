---
sidebar: auto
---

# API

## clone

Make a copy of nested objects like [lodash cloneDeep](https://lodash.com/docs/4.17.15#cloneDeep).
- Type: `function`
- Params: `object`
- Return: `object`
- Sample:

```ts
import { clone } from 'vcp'
clone(object: object): object
```

## merge

Merge array of objects like [lodash merge](https://lodash.com/docs/4.17.15#merge).

- Type: `function`
- Params: `object[]`
- Return: `object`
- Sample:

```ts
import { merge } from 'vcp'
merge(...objects): object
```

## idGenerator

Generate unique id.

- Type: `function`
- Params: `integer`
- Return: `string`
- Sample:

```ts
import { idGenerator } from 'vcp'
idGenerator(n: integer): string
```

## encode2Base64

Encode given string to base64.

- Type: `function`
- Params: `string`
- Return: `string`
- Sample:

```ts
import { encode2Base64 } from 'vcp'
encode2Base64(string: string): string
```

## decodeFromBase64

Decode given string from base64.

- Type: `function`
- Params: `string`
- Return: `string`
- Sample:

```ts
import { decodeFromBase64 } from 'vcp'
decodeFromBase64(string: string): string
```