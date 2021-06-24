<template>
  <div
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
      styles: {
        type: Array,
      },
    },
  },
  mounted() {
    this.Initialize(this.$refs.element, this.locals.classType);
  },
  watch: {
    options: function (val) {
      Object.assign(this.settings, val);
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