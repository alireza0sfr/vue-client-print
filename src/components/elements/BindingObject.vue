<template>
	<div :id="settings.id" ref="element" @click="$emit('clickedOnElement')" @finished-editing-element="$emit('finished-editing-element')" :class="locals.classType + ' element content-wrapper'" :style="settings.styles">

		<!-- If its the template builder mode -->
		<div class="content" v-if="settings.grandParent === 'TemplateBuilder'">
			<span>
				{{ settings.configs.field === "" ? locals.text1 : locals.text + ' ' + settings.configs.field }}
			</span>
			<Resizers :query="`bindingobject-${settings.id}`" />
		</div>

		<!-- If its the print mode -->
		<div v-else>
			{{ computedValue }}
			<Resizers :query="`bindingobject-${settings.id}`" />
		</div>

	</div>
</template>

<script>
	export default {
		name: "bindingobject",
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
					classType: "bindingobject",
					text: this._$t('template-builder.elements.bindingobject'),
					text1: this._$t('template-builder.elements.binding-object-text')
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
	};
</script>

<style>
</style>