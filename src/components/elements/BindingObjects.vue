<template>
  <div>
    <div
      :id="settings.id"
      ref="element"
      @click="this.$emit('clickedOnElement')"
      :class="locals.classType + ' element'"
      :style="settings.styles"
    >
      {{settings.configs.value || settings.configs.field }}
      <div ref="resizer" class="resizer"></div>
    </div>
  </div>
</template>

<script>
import defaultStyles from "./js/default-styles.js";
import elementUtilities from "./js/element-utilities.js";
export default {
  name: "BindingObjects",
  props: {
    mode: {
      type: String,
      default: "template",
    },
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
        classType: "bindingobjects",
      },
      settings: {
        id: 0,
        configs: {
          field: "اتصال فیلد را انتخاب کنید",
          value: null,
        },
        styles: defaultStyles,
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