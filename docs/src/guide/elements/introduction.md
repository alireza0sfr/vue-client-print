# Elements

Elements are pre defined components to make users generate their prefered components.

### Features

- All elements are draggable & resizeable
- All elements have their own unique settings explained in their own section activated by clicking
- All elements have their own unique style selection panel
- All elements can be dragged using arrow keys on keyboard
- All elements can be resized using ctrl+arrow keys on keyboard
- All elements can be deleted using delete key on keyboard
- All elements can be copied using ctrl+c key on keyboard
- All elements can be pasted using ctrl+v key on keyboard

::: tip Element's Section 
Elements get created by component itself and you dont have to do anything, nor settings any options
<ins>Element's options explained in their own sections are mainly to help you understand element better</ins>
:::

### Elements Object Structure

```ts
  options:object {
  readonly id: string // unique id given by component
  readonly type: string // unique type given by component
  readonly parent: string // determines section that element is dropped into
  readonly grandParent: string // ONLY FOR REPEATOR ELEMENT! repeator's id that element is dropped into
  options: {
    configs: object, // element's unique configs
    styles: object // element styles
  }
}
```

### Usage

All Elements support drag & drop functionality to be dropped in the section that you want.

::: danger Element's Section 
Element's section are defined by dropping them on a section and you <ins>CAN NOT</ins> drag them into other sections
:::