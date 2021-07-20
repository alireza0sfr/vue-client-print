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
      @click="$emit('clickedOnElement')"
      @finishededitingelement="$emit('finishedEditingElement')"
      :class="locals.classType + ' element'"
      ref="element"
    >
      <img
        class="image"
        draggable="false"
        :style="settings.styles"
        :src="variable.context"
        alt="Image"
      />
      <div ref="resizer" class="resizer"></div>
    </div>
  </div>
</template>

<script>
import elementUtilities from './js/element-utilities'
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
        this.locals.classType,
        this.$refs.resizer,
      )
    }
  },
  computed: {
    computedVariable() {
      return this.variable
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
    Initialize(element, classType, resizer) {
      elementUtilities.resizable(element, resizer)
      elementUtilities.dragable(element, classType)
      elementUtilities.click(element, classType)
    },
  },
};
</script>

<style>
</style>