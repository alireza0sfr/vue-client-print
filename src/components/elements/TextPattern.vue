<template>
	<div :id="settings.id" ref="element" @click="$emit('clickedOnElement')" @finishededitingelement="$emit('finishededitingelement')" :class="locals.classType + ' element'" :style="settings.styles">

		<!-- If its the template builder mode -->
		<div v-if="settings.grandParent === 'TemplateBuilder'">
			{{ settings.configs.text }}
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
	};
</script>

<style>
</style>