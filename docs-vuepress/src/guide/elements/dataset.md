# DataSet

Can attach to dataset object and display tables.

## Unique Configs

```ts
  configs: {
  stylesTarget: string, // rows styles target | default: 'all'
  selectedSet: string, // selected dataset key | default: ''
  dataSets: object, // datasets props | default: {}
    }
```

## Features

- columns can resize
- each section dataset/ row / column has it's own unique styles

::: tip DataSet 
  For further details check [DataSet Prop](/props/#dataset).
:::

## DataSet Settings
#### Triggers By: Clicking on title.

- Column Visibilty Toggle.
- Column Name 

## Column Settings
#### Triggers By: Clicking on column.

- Selected Column Visibilty Toggle.
- Selected Column Name 

## Row Settings
#### Triggers By: Clicking on default row on the bottom.

- Row Styles Target.
- Rows Height

::: tip DataSet Size 
  DataSet width adjusted by resizing is dataset width, BUT,

  DataSet Height adjusted by resizing is columns height.
  <ins>DataSet height depends on rows count and rows height</ins>

  DataSet height formula is: columnsHeight + (rowscount * rowHeight)
:::