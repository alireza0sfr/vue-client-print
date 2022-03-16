<template>
  <div>
    <div
      :id="settings.id"
      ref="element"
      @click="$emit('clickedOnElement')"
      @finishededitingelement="$emit('finishedEditingElement')"
      :class="locals.classType + ' element'"
      :style="settings.styles"
    >
      {{settings.configs.text}}
      <div ref="resizer" class="resizer"></div>
    </div>
  </div>
</template>

<script>
import elementUtilities from '~/plugins/element-utilities.js'
export default {
  name: "TextElement",
  props: {
    options: Object,
  },
  mounted() {
    if (this.$parent.$options.name == "TemplateBuilder") { // Initialize on moutned if its the template builder mode
      this.Initialize(
        this.$refs.element,
        this.$refs.resizer,
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
        classType: "text",
      },
      settings: {
        id: 0,
        configs: {
          text: "متن خود را وارد نمایید",
        },
        styles: {},
      },
    };
  },
  methods: {

     /**
     * Initializing the element utilities for the created element
     */
    
    Initialize(element, resizer, classType) {
      elementUtilities.resizable(element, resizer);
      elementUtilities.dragable(element, classType);
      elementUtilities.click(element, classType);
    },
  },
};
</script>

<style>
</style>