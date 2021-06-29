<template>
  <div>
    <p
      ref="element"
      @click="this.$emit('clickedOnElement')"
      :class="locals.classType + ' element'"
      :style="settings.styles"
    >{{settings.configs.counter}}</p>
  </div>
</template>

<script>
import defaultStyles from "./js/default-styles.js";
import elementUtilities from "./js/element-utilities.js";
export default {
  name: "PageCounter",
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
        if (this.settings.configs.persianNumbers == true) {
          this.settings.configs.counter = this.toPersianNumbers(this.settings.configs.counter);
        } else {
          this.settings.configs.counter = 1
        }
      },
    },
  },
  data() {
    return {
      locals: {
        classType: "pagecounter",
      },
      settings: {
        configs: {
          counter: 1,
          persianNumbers: true,
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
    toPersianNumbers(n) {
      const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

      return n.toString().replace(/\d/g, (x) => farsiDigits[x]);
    },
  },
};
</script>

<style>
</style>