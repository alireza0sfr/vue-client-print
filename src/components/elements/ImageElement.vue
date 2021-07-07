<template>
  <div>
    <img
      :id="settings.id"
      ref="element"
      @click="$emit('clickedOnElement')"
      @finishededitingelement="$emit('finishedEditingElement')"
      :class="locals.classType + ' element'"
      :style="settings.styles"
      :src="settings.configs.imageSrc"
      alt="Image"
    />
  </div>
</template>

<script>
import elementUtilities from "./js/element-utilities.js";
export default {
  name: "ImageElement",
  props: {
    options: Object,
  },
  mounted() {
    if (this.$parent.$options.name == "TemplateBuilder") {
      this.Initialize(
        this.$refs.element,
        this.locals.classType
      );
    }
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
        id: 0,
        configs: {
          imageSrc: require("./images/logo.png"),
        },
        styles: {},
      },
    };
  },
  methods: {
    Initialize(element, classType) {
      elementUtilities.dragable(element, classType);
      elementUtilities.click(element, classType);
    },
  },
};
</script>

<style>
</style>