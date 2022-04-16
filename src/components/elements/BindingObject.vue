<template>
	<div>

		<!-- If its the template builder mode -->
		<div v-if="$parent.$options.name === 'TemplateBuilder'" :id="settings.id" ref="element" @click="$emit('clickedOnElement')" @finishededitingelement="$emit('finishedEditingElement')" :class="locals.classType + ' element'" :style="settings.styles">
			{{ settings.configs.field === "" ? locals.text1 : locals.text + settings.configs.field }}
			<Resizers />
		</div>

		<!-- If its the print mode -->
		<div v-else :id="settings.id" ref="element" @click="$emit('clickedOnElement')" :class="locals.classType + ' element'" :style="settings.styles">
			{{ computedValue }}
			<Resizers />
		</div>

	</div>
</template>

<script>
	import ElementClass from '~/plugins/element-utilities.js'
	import Resizers from './Resizers.vue'
	export default {
		name: "bindingObject",
		props: {
			options: Object,
		},
		components: {
			Resizers,
		},
		mounted() {
			if (this.$parent.$options.name === "TemplateBuilder") { // Initialize on moutned if its the template builder mode
				this.Initialize()
			}
		},
		computed: {
			computedValue() {

				if (this.settings.configs.persianNumbers) {

					return this.toPersianNumbers(this.settings.configs.value)
				}

				return this.settings.configs.value
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
					classType: "bindingObject",
					text: this.$t('template-builder.elements.binding-objects'),
					text1: this.$t('template-builder.elements.binding-object-text')
				},
				settings: {
					id: 0,
					configs: {
						persianNumbers: false,
						field: "",
						value: null,
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
				let elem = new ElementClass(element)
				elem.click()
				elem.resizable()
				elem.dragable()
			},
			/**
			 *  Convertes the given number to persian format 
			 */
			toPersianNumbers(n) {
				const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]

				return n.toString().replace(/\d/g, (x) => farsiDigits[x])
			},

		},
	};
</script>

<style>
</style>