# Variables

Variables are element that can be used to store data across all templates.

### Features

::: tip Variables Features
Variables are elements therefore, They inherits all the features and functionality of elements.
:::

### Variable's Object Structure

```ts
  options:object {
  readonly id: string // unique id given by component
  readonly type: string // unique type given by component
  readonly parent: string // determines section that element is dropped into
  readonly grandParent: string // ONLY FOR REPEATOR ELEMENT! repeator's id that element is dropped into
  configs: {
    name: string, // variable's name | default: ''
    context: string, // variable's context | default: ''
  }
}
```

### Usage

Treat variables like normal elements, They can be [textElement](/guide/elements/text), [imageElement](/guide/elements/image)
