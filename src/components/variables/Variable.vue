<template>
  <div>
    <div
      v-if="variable.type == 'text'"
      :id="settings.id"
      ref="element"
      @click="$emit('clickedOnElement')"
      @finishededitingelement="$emit('finishedEditingElement')"
      :class="locals.classType + ' element'"
      :style="settings.styles"
    >
      {{ variable.context }}
      <div ref="resizer" class="resizer"></div>
    </div>
    <div
      v-else
      :id="settings.id"
      ref="element"
      @click="$emit('clickedOnElement')"
      @finishededitingelement="$emit('finishedEditingElement')"
      :class="locals.classType + ' element'"
      :style="settings.styles"
    >
      <img :src="variable.context" />
      <div ref="resizer" class="resizer"></div>
    </div>
  </div>
</template>

<script>
import elementUtilities from '../elements/js/element-utilities'
export default {
  name: "Variable",
  props: {
    options: Object,
    variable: Object,
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
    },
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
        classType: "variable",
      },
      settings: {
        id: 0,
        configs: {
          uniqueId: '',
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