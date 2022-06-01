# Text Pattern

Can attach to given object or any field of given dataset object and print dynamic text.

## Unique Configs

```ts
  configs: {
    persianNumbers: boolean, // whether to use persian digits for value | default: false
    field: "", // Selected field in binding object prop | default: ""
    value: null, // Selected value in binding object prop | default: null
    bindingObject: {}, // Binding object prop | default: {}
  }
```

::: tip BindingObject
For further details check [Binding Object Prop](/props/bindingobject).
:::

## Settings

- Persian Digits Toggle.
- Data Selection Dropdown

::: tip Data Selection Dropdown
This dropdown is only for information and not for data selection, data selection is based on given patterns.
:::
