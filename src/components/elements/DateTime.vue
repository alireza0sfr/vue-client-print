<template>
  <div class="element datetime" :style="settings.styles"></div>
</template>

<script>
import defaultStyles from './styles/default-styles.js'
export default {
  name: "DateTime",
  props: {
    options: {
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
            styles: defaultStyles
        }
    };
  },
};
</script>

<style>
</style>