<template>
  <div v-if="variable">

    <!-- If the variable is text -->
    <div
      v-show="variable.type === 'text' ? true : false"
      :id="settings.id"
      @click="$emit('clickedOnElement')"
      @finishededitingelement="$emit('finishedEditingElement')"
      :class="locals.classType + ' element'"
      :style="settings.styles"
      ref="textVariable"
    >
      {{ variable.context }}
      <div ref="textResizer" class="resizer"></div>
    </div>

    <!-- If the variable is image -->
    <div
      v-show="variable.type === 'image' ? true : false"
      :id="settings.id"
      @click="$emit('clickedOnElement')"
      @finishededitingelement="$emit('finishedEditingElement')"
      :class="locals.classType + ' element'"
      :style="settings.styles"
      ref="imageVariable"
    >
      <img
        class="image"
        draggable="false"
        :src="variable.context"
        alt="Image"
      />
      <div ref="imageResizer" class="resizer"></div>
    </div>

  </div>
</template>

<script>
import elementUtilities from '../../plugins/element-utilities'
export default {
  name: "Variable",
  props: {
    options: Object,
    variable: Object,
  },
  mounted() {
    if (this.$parent.$options.name === "TemplateBuilder" && (this.$refs.textVariable || this.$refs.imageVariable)) { // Initialize on moutned if its the template builder mode
      this.Initialize(
        this.$refs.textVariable,
        this.locals.classType,
        this.$refs.textResizer,
      )
      this.Initialize(
        this.$refs.imageVariable,
        this.locals.classType,
        this.$refs.imageResizer,
      )
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

    /**
     * Initializing the element utilities for the created element
     */

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
