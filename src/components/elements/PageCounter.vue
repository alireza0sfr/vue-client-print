<template>
	<div :id="settings.id" :data-testid="settings.id" ref="element" @click="$emit('clickedOnElement')" @finished-editing-element="$emit('finished-editing-element')" :class="locals.classType + ' element content-wrapper'" :style="settings.styles">
		<span class="content">
			{{ computedCounter }}
		</span>
		<Resizers :query="`pagecounter-${settings.id}`" />
	</div>
</template>

<script>
import { initElementStyles, initializeGeneralElement } from '~/plugins/element-utilities'
import { toPersianDigits, merge } from '~/plugins/general-utilities'
	export default {
		name: "PageCounter",
		props: {
			options: Object,
		},
		emits:['clickedOnElement', 'finished-editing-element'],
		mounted() {
			if (this.settings.grandParent === "TemplateBuilder") {
				initializeGeneralElement(this.$refs.element, `${this.locals.classType}-${this.settings.id}`, this.settings)
			}
		},
		computed: {
			computedCounter() {
				if (this.settings.grandParent === "TemplateBuilder") { // Initialize on moutned if its the template builder mode
					if (this.settings.configs.completeForm) {
						if (this.settings.configs.persianNumbers) {
							return toPersianDigits('صفحه ۱ از ۱')
						}
						return 'page 1 / 1'
					}
					if (this.settings.configs.persianNumbers) {
						return toPersianDigits(this.settings.configs.counter)
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
					this.settings = merge(this.settings, val)
					this.settings.styles = initElementStyles(this.settings.styles)
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
						persianNumbers: false,
						completeForm: true,
					},
					styles: {},
				},
			}
		},
	};
</script>

<style>
</style>