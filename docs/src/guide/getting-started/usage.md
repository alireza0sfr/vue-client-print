# Basic Usage

::: warning API & Props    
This assumes you have already read [APIs](/guide/apis/templatebuilder/) and [Props](/config/) section.
:::

```html
<template>
  <div>
    <button @click="templateBuilder">Template Builder</button>
    <button @click="printPreview">Print Preview</button>
    <Print
      ref="print"
      :dataSets="dataSets"
      :bindingObject="bindingObject"
      :variables="variables"
      :configurations="configurations"
    />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dataSets: {},
        bindingObject: {},
        variables: {},
        configurations: {},
        printOptions: {},
      };
    },
    methods: {
      templateBuilder() {
        this.$refs.print.templateBuilder(this.printOptions, (json) => {
          this.printOptions = json;
        });
      },
      printPreview() {
        this.$refs.print.printPreview(this.printOptions);
      },
    },
  };
</script>
```

## Print Body

Print Body renders by:

- [Gievn slot with name of 'printData'](/guide/slots/slots)
- [By passing dataset and building template](/guide/elements/dataset)