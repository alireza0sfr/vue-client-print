<template>
	<div>

		<!-- If its the template builder mode -->
		<div v-if="settings.grandParent === 'TemplateBuilder'" :id="settings.id" ref="element" @click="$emit('clickedOnElement')" @finishededitingelement="$emit('finishededitingelement')" :class="locals.classType + ' element'" :style="settings.styles">
			{{ settings.configs.field === "" ? locals.text1 : locals.text + ' ' + settings.configs.field }}
			<Resizers :query="`bindingobject-${settings.id}`" />
		</div>

		<!-- If its the print mode -->
		<div v-else :id="settings.id" ref="element" @click="$emit('clickedOnElement')" :class="locals.classType + ' element'" :style="settings.styles">
			{{ computedValue }}
			<Resizers :query="`bindingobject-${settings.id}`" />
		</div>

	</div>
</template>

<script>
	import ElementClass from '~/plugins/element-utilities.js'
	import Resizers from '~/components/elements/Resizers.vue'
	export default {
		name: "bindingobject",
		props: {
			options: Object,
		},
		components: {
			Resizers,
		},
		mounted() {
			console.log(this.settings);
			if (this.settings.grandParent === "TemplateBuilder") { // Initialize on moutned if its the template builder mode
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
					this.settings = this.merge(this.settings, val)
				},
			},
		},
		data() {
			return {
				locals: {
					classType: "bindingobject",
					text: this.$t('template-builder.elements.binding-objects'),
					text1: this.$t('template-builder.elements.binding-object-text')
				},
				settings: {
					id: 0,
					grandParent: 'TemplateBuilder',
					configs: {
						persianNumbers: false,
						field: "",
						value: null,
						bindingObject: {},
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
				let elem = new ElementClass(element, `bindingobject-${this.settings.id}`, this.settings)
				elem.clickable()
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