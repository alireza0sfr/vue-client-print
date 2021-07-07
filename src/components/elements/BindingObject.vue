<template>
  <div>
    <div
      v-if="$parent.$options.name == 'TemplateBuilder'"
      :id="settings.id"
      ref="element"
      @click="$emit('clickedOnElement')"
      @finishededitingelement="$emit('finishedEditingElement')"
      :class="locals.classType + ' element'"
      :style="settings.styles"
    >
      {{settings.configs.field}}
      <div ref="resizer" class="resizer"></div>
    </div>
    <div
      v-else
      :id="settings.id"
      ref="element"
      @click="$emit('clickedOnElement')"
      :class="locals.classType + ' element'"
      :style="settings.styles"
    >
      {{settings.configs.value}}
      <div ref="resizer" class="resizer"></div>
    </div>
  </div>
</template>

<script>
import elementUtilities from "./js/element-utilities.js";
export default {
  name: "bindingObject",
  props: {
    options: Object,
  },
  mounted() {
    if (this.$parent.$options.name == "TemplateBuilder") {
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
        classType: "bindingObject",
      },
      settings: {
        id: 0,
        configs: {
          field: "اتصال فیلد را انتخاب کنید",
          value: null,
        },
        styles: {},
      },
    };
  },
  methods: {
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