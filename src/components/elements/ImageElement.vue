<template>
	<div :id="settings.id" :data-testid="settings.id" @click="$emit('clickedOnElement')" @finished-editing-element="$emit('finished-editing-element')" :class="locals.classType + ' element'" :style="settings.styles" ref="element">
		<img class="image" :src="settings.configs.imageSrc" alt="Image" />
		<Resizers :query="`imageelement-${settings.id}`" />
	</div>
</template>

<script>
import { initElementStyles, initializeGeneralElement } from '~/plugins/element-utilities'
	import { merge } from '~/plugins/general-utilities'
	export default {
		name: "ImageElement",
		props: {
			options: Object,
		},
		emits:['clickedOnElement', 'finished-editing-element'],
		mounted() {
			if (this.settings.grandParent === "TemplateBuilder") { // Initialize on moutned if its the template builder mode
				initializeGeneralElement(this.$refs.element, `${this.locals.classType}-${this.settings.id}`, this.settings)
			}
		},
		watch: {
			options: {
				immediate: true,
				deep: true,
				handler(val) {
					this.settings = merge(this.settings, val)
					this.settings.styles = initElementStyles(this.settings.styles)
				},
			},
		},
		data() {
			return {
				locals: {
					classType: "imageelement",
				},
				settings: {
					grandParent: 'TemplateBuilder',
					id: 0,
					configs: {
						imageSrc: '',
					},
					styles: {
						width: "100px",
						height: "100px",
					}
				},
			}
		},
	};
</script>

<style>
</style>