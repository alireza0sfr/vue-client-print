<template>
  <div>
    <p
      ref="element"
      @click="this.$emit('clickedOnElement')"
      :class="locals.classType + ' element'"
      :style="settings.styles"
    >{{settings.configs.text}}</p>
  </div>
</template>

<script>
import defaultStyles from "./js/default-styles.js";
import elementUtilities from "./js/element-utilities.js";
export default {
  name: "TextElement",
  props: {
    options: Object,
  },
  mounted() {
    this.Initialize(this.$refs.element, this.locals.classType);
  },
  watch: {
    options: {
      immediate: true,
      deep: true,
      handler(val) {
        let tmp = this.options.styles;
        Object.assign(this.settings, val);
        this.settings.styles = tmp;
        Object.assign(this.settings.styles, val.styles);
      },
    },
  },
  data() {
    return {
      locals: {
        classType: "text",
      },
      settings: {
        configs: {
          text: "Enter Your Text",
        },
        styles: defaultStyles,
      },
    };
  },
  methods: {
    Initialize(element, classType) {
      elementUtilities.resizable(element);
      elementUtilities.dragable(element, classType);
      elementUtilities.click(element, classType);
    },
  },
};
</script>

<style>
</style>