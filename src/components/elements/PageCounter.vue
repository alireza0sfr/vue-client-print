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
      {{ computedCounter }}
      <div ref="resizer" class="resizer"></div>
    </div>
  </div>
</template>

<script>
import elementUtilities from "./js/element-utilities.js"
export default {
  name: "PageCounter",
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
    computedCounter() {
      if (this.settings.configs.completeForm) {
        if (this.settings.configs.persianNumbers) {
          return this.toPersianNumbers('صفحه ۱ از ۱')
        }
        return 'صفحه 1 از 1'
      }
      if (this.settings.configs.persianNumbers) {
        return this.toPersianNumbers(this.settings.configs.counter)
      }
      return this.settings.configs.counter
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
        classType: "pagecounter",
      },
      settings: {
        id: 0,
        configs: {
          counter: 1,
          persianNumbers: true,
          completeForm: true,
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