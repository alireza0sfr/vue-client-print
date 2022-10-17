---
sidebar: auto
---

# Interfaces

Interfaces of datas passed to VCP

## IDataset

```ts
interface IDataset {
  readonly key: string;
  title: string;
  columns: Array<IColumn>;
  rows?: object[];
}
```

## IRow

```ts
interface IRow {
  [key: string]: string;
}
```

## IColumn

```ts
interface IColumn {
  readonly key: string
  title: string
  columns?: IColumn[]
  options: {
    styles?: any
  }
}
```

## IVariable

```ts
interface IVariable {
  readonly uniqueId: string,
  readonly type: string,
  name: string,
  context: string,
}
```

## IBindingObject

```ts
interface IBindingObject {
  [key: string]: string
}
```