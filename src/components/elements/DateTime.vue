<template>
  <div
    v-if="settings.configs.hasDate == true && settings.configs.hasTime == false"
    @click="this.$emit('clickedOnElement')"
    ref="element"
    :class="locals.classType + ' element'"
    :style="settings.styles"
  >{{dateToday}}</div>
  <div
    v-else-if="settings.configs.hasTime == true && settings.configs.hasDate == false"
    @click="this.$emit('clickedOnElement')"
    ref="element"
    :class="locals.classType + ' element'"
    :style="settings.styles"
  >&nbsp; {{timeToday}}</div>
  <div
    v-else-if="settings.configs.hasDate && settings.configs.hasTime == true"
    @click="this.$emit('clickedOnElement')"
    ref="element"
    :class="locals.classType + ' element'"
    :style="settings.styles"
  >{{dateToday}} &nbsp; {{timeToday}}</div>
</template>

<script>
import defaultStyles from "./js/default-styles.js";
import elementUtilities from "./js/element-utilities.js";
export default {
  name: "DateTime",
  props: {
    options: {
      type: Object,
    },
  },
  mounted() {
    this.Initialize(this.$refs.element, this.locals.classType);
  },
  watch: {
    options: {
      immediate: true,
      handler(val) {
        console.log("val", val);
        console.log("settings:", this.settings);
        let tmp = this.options.styles;
        Object.assign(this.settings, val);
        this.settings.styles = tmp;
        Object.assign(this.settings.styles, val.styles);
        console.log("settings2: ", this.settings);
      },
    },
  },
  data() {
    return {
      dateToday: new Date()
        .toLocaleDateString("fa-IR")
        .replace(/([۰-۹])/g, (token) =>
          String.fromCharCode(token.charCodeAt(0) - 1728)
        ),
      timeToday:
        new Date().getHours() +
        ":" +
        new Date().getMinutes() +
        ":" +
        new Date().getSeconds(),
      locals: {
        classType: "datetime",
      },
      settings: {
        configs: {
          hasDate: true,
          hasTime: true,
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