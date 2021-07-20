<template>
  <div
    :id="settings.id"
    ref="element"
    @click="clickedOnElement($refs.element)"
    @finishededitingelement="$emit('finishedEditingElement')"
    :class="locals.classType + ' element'"
    :style="settings.styles"
  >
    {{ computedValue }}
    <div ref="resizer" class="resizer"></div>
  </div>
</template>

<script>
import elementUtilities from "./js/element-utilities.js"
export default {
  name: "DateTime",
  props: {
    options: {
      type: Object,
    },
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
      if (this.settings.configs.hasDate && this.settings.configs.hasTime) {
        return this.dateToday + ' ' + this.timeToday
      } else if (this.settings.configs.hasDate && !this.settings.configs.hasTime) {
        return this.dateToday
      } else if (this.settings.configs.hasTime && !this.settings.configs.hasDate) {
        return this.timeToday
      } else {
        return ''
      }
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
        if (this.settings.configs.persianDate == true) {
          this.persianDate()
        } else {
          this.adDate()
        }
      },
    },
  },
  data() {
    return {
      dateToday: "",
      timeToday: "",
      locals: {
        classType: "datetime",
      },
      settings: {
        id: 0,
        configs: {
          hasDate: true,
          hasTime: true,
          persianDate: true,
        },
        styles: {}
      },
    }
  },
  methods: {
    Initialize(element, resizer, classType) {
      elementUtilities.resizable(element, resizer)
      elementUtilities.dragable(element, classType)
      elementUtilities.click(element, classType)
    },

    /**
     * Emmiting clicked on element and adding all the eventlistenners to the new element again
     */
    clickedOnElement(element) {
      this.$emit("clickedOnElement")
      if (element.lastChild.className != "resizer") {
        this.Initialize(element, this.locals.classType)
      }
    },
    persianDate() {
      let today = new Date().toLocaleDateString("fa-IR")
      this.dateToday = today
      this.timeToday = this.toPersianNumbers(this.timeNow())
    },
    adDate() {
      var today = new Date()
      var dd = String(today.getDate()).padStart(2, "0")
      var mm = String(today.getMonth() + 1).padStart(2, "0") //January is 0!
      var yyyy = today.getFullYear()

      this.dateToday = yyyy + "/" + dd + "/" + mm
      this.timeToday = this.timeNow()
    },
    timeNow() {
      return (
        new Date().getHours() +
        ":" +
        new Date().getMinutes() +
        ":" +
        new Date().getSeconds()
      )
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