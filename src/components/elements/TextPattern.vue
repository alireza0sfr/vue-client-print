<template>
	<div>

		<!-- If its the template builder mode -->
		<div v-if="settings.grandParent === 'TemplateBuilder'" :id="settings.id" ref="element" @click="$emit('clickedOnElement')" @finishededitingelement="$emit('finishededitingelement')" :class="locals.classType + ' element'" :style="settings.styles">
			{{ settings.configs.text }}
			<Resizers :query="`textpattern-${settings.id}`" />
		</div>

		<!-- If its the print mode -->
		<div v-else :id="settings.id" ref="element" @click="$emit('clickedOnElement')" :class="locals.classType + ' element'" :style="settings.styles">
			{{ computedValue }}
			<Resizers :query="`textpattern-${settings.id}`" />
		</div>

	</div>
</template>

<script>
	import ElementClass from '~/plugins/element-utilities.js'
	import Resizers from '~/components/elements/Resizers.vue'
	export default {
		components: {
			Resizers,
		},
		name: "TextPattern",
		props: {
			options: Object,
		},
		mounted() {
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
					classType: "textpattern",
				},
				settings: {
					grandParent: 'TemplateBuilder',
					id: 0,
					configs: {
						persianNumbers: false,
						text: this.$t('template-builder.elements.configs.pattern-input'),
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
				let elem = new ElementClass(element, `textpattern-${this.settings.id}`, this.settings)
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