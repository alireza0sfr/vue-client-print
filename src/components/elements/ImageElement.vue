<template>
	<div :id="settings.id" @click="$emit('clickedOnElement')" @finishededitingelement="$emit('finishedEditingElement')" :class="locals.classType + ' element'" :style="settings.styles" ref="element">
		<img class="image" draggable="false" :src="settings.configs.imageSrc" alt="Image" />
		<Resizers :query="`imageelement-${settings.id}`" />
	</div>
</template>

<script>
	import ElementClass from '~/plugins/element-utilities.js'
	import DefaultLogo from '@/assets/images/logo.png'
	import Resizers from '~/components/elements/Resizers.vue'
	export default {
		components: {
			Resizers,
		},
		name: "ImageElement",
		props: {
			options: Object,
		},
		mounted() {
			if (this.$parent.$options.name === "TemplateBuilder") { // Initialize on moutned if its the template builder mode
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
					classType: "imageelement",
				},
				settings: {
					id: 0,
					configs: {
						imageSrc: DefaultLogo,
					},
					styles: {},
				},
			}
		},
		methods: {

			/**
			 *  Convertes the given number to persian format 
			 */
			Initialize(element = this.$refs.element) {
				let elem = new ElementClass(element, `imageelement-${this.settings.id}`)
				elem.click()
				elem.resizable()
				elem.dragable()
			},
			test() {
				console.log('hi im image')
			},
		},
	};
</script>

<style>
</style>