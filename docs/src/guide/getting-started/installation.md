# Installation

```bash
npm install vcp --save
```

## Register the plugin in Vue 2

```js
// main.js
import Vue from 'vue';
import Print from 'vcp';

Vue.use(Print);
```

## Register the plugin in Vue 3

```js
import { createApp } from 'vue';
import App from './App.vue'; // e.g: main app file
import Print from 'vcp';

const app = createApp(App);
app.use(Print);
```
