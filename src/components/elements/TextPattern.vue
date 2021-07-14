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
      {{ settings.configs.text }}
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
      {{ computedValue }}
      <div ref="resizer" class="resizer"></div>
    </div>
  </div>
</template>

<script>
import elementUtilities from "./js/element-utilities.js"
export default {
  name: "TextPattern",
  props: {
    options: Object,
  },
  mounted() {
    if (this.$parent.$options.name == "TemplateBuilder") {
      this.Initialize(
        this.$refs.element,
        this.$refs.resizer,
        this.locals.classType
      )
    }
  },
  computed: {
    computedValue() {
      if (this.settings.configs.persianNumbers) {
        return this.toPersianNumbers(this.settings.configs.value)
      }
      return this.settings.configs.value
    }
  },
  watch: {
    options: {
      immediate: true,
      deep: true,
      handler(val) {
        let tmp = this.options.styles
        Object.assign(this.settings, val)
        this.settings.styles = tmp
        Object.assign(this.settings.styles, val.styles)
      },
    },
  },
  data() {
    return {
      locals: {
        classType: "textpattern",
      },
      settings: {
        id: 0,
        configs: {
          persianNumbers: false,
          text: "الگوی خود را وارد کنید",
          value: null,
        },
        styles: {},
      },
    }
  },
  methods: {
    Initialize(element, resizer, classType) {
      elementUtilities.resizable(element, resizer)
      elementUtilities.dragable(element, classType)
      elementUtilities.click(element, classType)
    },
    toPersianNumbers(n) {
      const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]

      return n.toString().replace(/\d/g, (x) => farsiDigits[x])
    },
  },
};
</script>

<style>
</style>