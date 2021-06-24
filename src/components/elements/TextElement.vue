<template>
  <div ref="element" @click="this.$emit('clickedOnElement')" :class="locals.classType + ' element'" :style="settings.styles">{{settings.text}}</div>
</template>

<script>
import defaultStyles from './js/default-styles.js'
import elementUtilities from './js/element-utilities.js'
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
  mounted() {
    this.Initialize(this.$refs.element, this.locals.classType)
  },
  watch: {
    options: function (val) {
      console.log(val);
      this.settings = Object.assign(this.settings, val);
    },
  },
  data() {
    return {
      locals: {
        classType: 'text'
      },
        settings: {
            text: "Enter Your Text",
            styles: defaultStyles
        }
    };
  },
  methods: {
    Initialize(element, classType) {
      elementUtilities.resizable(element)
      elementUtilities.dragable(element, classType)
      elementUtilities.click(element, classType);
    }
  }
};
</script>

<style>
</style>