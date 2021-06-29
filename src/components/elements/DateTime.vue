<template>
  <div
    v-if="settings.configs.hasDate == true && settings.configs.hasTime == false"
    ref="element"
    @click="this.clickedOnElement()"
    :class="locals.classType + ' element'"
    :style="settings.styles"
  >{{dateToday}}</div>
  <div
    v-else-if="settings.configs.hasTime == true && settings.configs.hasDate == false"
    ref="element"
    @click="this.clickedOnElement()"
    :class="locals.classType + ' element'"
    :style="settings.styles"
  >&nbsp; {{timeToday}}</div>
  <div
    v-else-if="settings.configs.hasDate && settings.configs.hasTime == true"
    ref="element"
    @click="this.clickedOnElement()"
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

    /**
     * Emmiting clicked on element and adding all the eventlistenners to the new element again
     */
    clickedOnElement() {
      this.$emit("clickedOnElement");
      this.Initialize(this.$refs.element, this.locals.classType);
    },
  },
};
</script>

<style>
</style>