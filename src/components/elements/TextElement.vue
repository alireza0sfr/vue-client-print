<template>
	<div :id="settings.id" ref="element" @click="$emit('clickedOnElement')" @finishededitingelement="$emit('finishedEditingElement')" :class="locals.classType + ' element'" :style="settings.styles">
		{{settings.configs.text}}
		<Resizers :query="`text-${settings.id}`" />
	</div>
</template>

<script>
	import ElementClass from '~/plugins/element-utilities.js'
	import Resizers from '~/components/elements/Resizers.vue'
	export default {
		components: {
			Resizers,
		},
		name: "TextElement",
		props: {
			options: Object,
		},
		mounted() {
			console.log(this.settings);
			if (this.settings.grandParent === "TemplateBuilder") { // Initialize on moutned if its the template builder mode
				this.Initialize()
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
			Initialize(element = this.$refs.element) {
				let elem = new ElementClass(element, `text-${this.settings.id}`)
				elem.clickable()
				elem.resizable()
				elem.dragable()
			},
		},
	};
</script>

<style>
</style>