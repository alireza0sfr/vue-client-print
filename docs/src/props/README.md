---
sidebar: auto
---

# Props

## Binding Object

- Type: `object`
- Default: `{}`
- Sample:

```ts
{
  name: 'VCP';
}
```

## Configurations

- Type: `object`
- Default:

```ts
{
  language: 'en',
  maximumFileSize: 1000,
  imageSrc: VCP LOGO
}
```

imageSrc: Given image for imageElement and variable with image type.

maximumFileSize: Maximum file size in KB.

## Variables

- Type: `array`
- Default: `[]`
- Sample:

```ts
[
  {
    uniqueId: '',
    name: '',
    context: '',
    type: 'text',
  },
];
```

## DataSets

- Type: `object`
- Default: `{}`
- Sample:

```ts
object = {
  users: { // dataset name
    key: 'username', // dataset unique key
    title: 'Username DataSset' // dataset title
    columns: [
      {
        title: 'firstName',
        key: 'firstName',
        options: {
          styles: {
            width: '70px',
          },
        },
      },
      {
        title: 'lastName',
        key: 'lastName',
        options: {
          styles: {
            width: '70px',
          },
        },
      },
    ]
    rows: [
      {
        firstName: 'Alireza',
        lastName: 'Safari'
      },
      {
        firstName: 'John',
        lastName: 'Doe'
      },
    ]
  }
};
```

### Rows with object data

If you have rows with object data, You should add another column object to that specific column like below:

```ts
columns: [
  {
    title: 'firstName',
    key: 'firstName',
    columns: [
      {
        title: 'Child Columns',
        key: 'child Columns',
        options: {
          styles: {
            width: '70px',
          },
        },
      },
    ]
    options: {
      styles: {
        width: '70px',
      },
    },
  },
];
```

And then add [DatasetElement](/guide/elements/dataset) to a [RepeatorElement](/guide/elements/repeator), now your array data is avaiable in dataset's settings.