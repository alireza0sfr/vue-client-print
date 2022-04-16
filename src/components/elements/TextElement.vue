<template>
	<div>
		<div :id="settings.id" ref="element" @click="$emit('clickedOnElement')" @finishededitingelement="$emit('finishedEditingElement')" :class="locals.classType + ' element'" :style="settings.styles">
			{{settings.configs.text}}
			<div v-for="area in cleanedResizeables" :key="area" :class="`elem-resizer ${area}`"></div>
		</div>
	</div>
</template>

<script>
	import elementUtilities from '~/plugins/element-utilities.js'
	export default {
		name: "TextElement",
		props: {
			options: Object,
		},
		mounted() {
			if (this.$parent.$options.name === "TemplateBuilder") { // Initialize on moutned if its the template builder mode
				this.Initialize(
					this.$refs.element,
					this.locals.classType
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
		computed: {
			cleanedResizeables() {
				return this.resizableAreas.filter(x => x && x.length > 1)
			},
		},
		data() {
			return {
				resizableAreas: ['br'],
				locals: {
					classType: "text",
				},
				settings: {
					id: 0,
					configs: {
						text: this.$t('template-builder.elements.configs.type-text'),
					},
					styles: {},
				},
			}
		},
		methods: {

			/**
			* Initializing the element utilities for the created element
			*/
			Initialize(element, classType) {
				elementUtilities.resizable(element)
				elementUtilities.dragable(element, classType)
				elementUtilities.click(element, classType)
			},
		},
	};
</script>

<style>
</style>