# Repeator

Can attach to dataset object and repeats based on dataset row count.

## Unique Configs

```ts
  configs: {
    appendedElements: {}, // appended elements its's based on dataset key| default: {}
    originalHeight: string // original height of repeator | default: '0'
    stylesTarget: string, // rows styles target | default: 'all'
    selectedDataSet: string, // selected dataset key | default: ''
    dataSets: object, // datasets props | default: {}
    }
```

## Features

- Can work as an element host elemnts can be added to repeator by dropping on repeator

::: tip DataSet 
  For further details check [DataSet Prop](/props/dataset).
:::

## Settings
  - DataSet Selector