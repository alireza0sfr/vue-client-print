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
      type: Object,
      default: []
    },
  },
  mounted() {
    this.Initialize(this.$refs.element, this.locals.classType)
  },
  watch: {
    options: {
      immediate: true,
      handler(val){
        let tmp = this.options.styles
        console.log('tmp', tmp);
        Object.assign(this.settings, val)
        console.log('settings', this.settings);
        console.log('val', val);
        this.settings.styles = tmp
        Object.assign(this.settings.styles, val.styles)
        console.log('settings style', this.settings.styles);
        
      }
    }
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