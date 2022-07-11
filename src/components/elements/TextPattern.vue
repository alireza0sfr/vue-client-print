<template>
	<div :id="settings.id" ref="element" @click="$emit('clickedOnElement')" @finished-editing-element="$emit('finished-editing-element')" :class="locals.classType + ' element content-wrapper'" :style="settings.styles">

		<!-- If its the template builder mode -->
		<div class="content" v-if="settings.grandParent === 'TemplateBuilder'">
			<span>
				{{ settings.configs.text }}
			</span>
			<Resizers :query="`textpattern-${settings.id}`" />
		</div>

		<!-- If its the print mode -->
		<div v-else>
			{{ computedValue }}
			<Resizers :query="`textpattern-${settings.id}`" />
		</div>

	</div>
</template>

<script>
	export default {
		name: "TextPattern",
		props: {
			options: Object,
		},
		emits:['clickedOnElement', 'finished-editing-element'],
		mounted() {
			if (this.settings.grandParent === "TemplateBuilder") { // Initialize on moutned if its the template builder mode
				this.Initialize(this.$refs.element, `${this.locals.classType}-${this.settings.id}`, this.settings)
			}
		},
		computed: {
			computedValue() {
				if (this.settings.configs.persianNumbers) {
					return this.toPersianDigits(this.settings.configs.value)
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
					this.settings.styles = this.initStyles(this.settings.styles)
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
						text: this._$t('template-builder.elements.configs.pattern-input'),
						value: null,
						bindingObject: {},
					},
					styles: {},
				},
			}
		},
	};
</script>

<style>
</style>