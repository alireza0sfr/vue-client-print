<template>
  <div>
    <img
      ref="element"
      @click="this.$emit('clickedOnElement')"
      :class="locals.classType + ' element'"
      :style="settings.styles"
      :src="settings.configs.imageSrc"
    />
  </div>
</template>

<script>
import defaultStyles from "./js/default-styles.js";
import elementUtilities from "./js/element-utilities.js";
export default {
  name: "ImageElement",
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
        classType: "imageelement",
      },
      settings: {
        configs: {
          imageSrc: '/src/components/elements/images/logo.png',
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