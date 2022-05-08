<template>
	<div>
		<div :id="settings.id" ref="element" @click="$emit('clickedOnElement')" @finishededitingelement="$emit('finishedEditingElement')" :class="locals.classType + ' element'" :style="settings.styles">
			{{ computedCounter }}
			<Resizers :query="`pagecounter-${settings.id}`"/>
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
		name: "PageCounter",
		props: {
			options: Object,
		},
		mounted() {
			if (this.settings.grandParent === "TemplateBuilder") {
				this.Initialize()
			}
		},
		computed: {
			computedCounter() {
				if (this.settings.grandParent === "TemplateBuilder") { // Initialize on moutned if its the template builder mode
					if (this.settings.configs.completeForm) {
						if (this.settings.configs.persianNumbers) {
							return this.toPersianNumbers('صفحه ۱ از ۱')
						}
						return 'page 1 / 1'
					}
					if (this.settings.configs.persianNumbers) {
						return this.toPersianNumbers(this.settings.configs.counter)
					}
				}
				return this.settings.configs.counter
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
					classType: "pagecounter",
				},
				settings: {
					grandParent: 'TemplateBuilder',
					id: 0,
					configs: {
						counter: '1',
						persianNumbers: true,
						completeForm: true,
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
				let elem = new ElementClass(element, `pagecounter-${this.settings.id}`)
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