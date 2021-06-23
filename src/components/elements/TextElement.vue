<template>
  <div class="element text" :style="settings.styles">{{settings.text}}</div>
</template>

<script>
import defaultStyles from './styles/default-styles.js'
export default {
  name: "TextElement",
  props: {
    options: {
      text: {
        default: '',
        type: String,
      },
      styles: {
        type: Array,
      },
    },
  },
  watch: {
    options: function (val) {
      Object.assign(this.settings, val);
    },
  },
  data() {
    return {
        settings: {
            text: "Enter Your Text",
            styles: defaultStyles
        }
    };
  },
};
</script>

<style>
</style>