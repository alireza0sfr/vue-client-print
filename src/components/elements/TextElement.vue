<template>
	<div :id="settings.id" :data-testid="settings.id" ref="element" @click="$emit('clickedOnElement')" @finished-editing-element="$emit('finished-editing-element')" :class="locals.classType + ' element content-wrapper'" :style="settings.styles">
		<div class="content">
			{{settings.configs.text}}
		</div>
		<Resizers :query="`${this.locals.classType}-${settings.id}`" />
	</div>
</template>

<script>
	export default {
		name: "TextElement",
		props: {
			options: Object,
		},
		emits:['clickedOnElement', 'finished-editing-element'],
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
					classType: "textelement",
				},
				settings: {
					configs: {},
					styles: {},
				},
			}
		},
	};
</script>

<style>
</style>