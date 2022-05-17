<template>
	<div :id="settings.id" ref="element" @click="$emit('clickedOnElement')" @finishededitingelement="$emit('finishededitingelement')" :class="locals.classType + ' element content-wrapper'" :style="settings.styles">
		<div class="content">
			{{settings.configs.text}}
		</div>
		<Resizers :query="`text-${settings.id}`" />
	</div>
</template>

<script>
	export default {
		name: "TextElement",
		props: {
			options: Object,
		},
		mounted() {
			if (this.settings.grandParent === "TemplateBuilder") { // Initialize on moutned if its the template builder mode
				this.Initialize(this.$refs.element, `${this.locals.classType}-${this.settings.id}`, this.settings)
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
	};
</script>

<style>
</style>