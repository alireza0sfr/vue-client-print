# Installation

```bash
npm install vcp --save
```

## Register the plugin in Vue 2

```js
// main.js
import Vue from 'vue';
import Print from 'vcp';
import 'vcp/dist/style.css';

Vue.use(Print);
```

## Register the plugin in Vue 3

```js
import { createApp } from 'vue'
import Print from 'vcp';
import 'vcp/dist/style.css';
import App from './App.vue' // e.g: main app file

const app = createApp(App)
app.use(Print)
```

### Usage

```js
// main.js
//...
import VuePersianDatetimePicker from 'vue-persian-datetime-picker';
Vue.component('date-picker', VuePersianDatetimePicker);
//...
```

Or in component

```html
<template>
  <div>
    <date-picker v-model="date" />
  </div>
</template>

<script>
  import VuePersianDatetimePicker from 'vue-persian-datetime-picker';
  export default {
    data() {
      return {
        date: '',
      };
    },
    components: {
      datePicker: VuePersianDatetimePicker,
    },
  };
</script>
```

## Global setup

```js
// main.js
import VuePersianDatetimePicker from 'vue-persian-datetime-picker';
Vue.use(VuePersianDatetimePicker, {
  name: 'custom-date-picker',
  props: {
    format: 'YYYY-MM-DD HH:mm',
    displayFormat: 'jYYYY-jMM-jDD HH:mm',
    editable: false,
    inputClass: 'form-control my-custom-class-name',
    placeholder: 'Please select a date',
    altFormat: 'YYYY-MM-DD HH:mm',
    color: '#00acc1',
    autoSubmit: true,
    //...
    //... And whatever you want to set as default.
    //...
  },
});
```

Then use in component

```html
<custom-date-picker v-model="date" />
```
