<template>
	<div :id="settings.id" ref="element" @click="$emit('clickedOnElement')" @finishededitingelement="$emit('finishededitingelement')" :class="locals.classType + ' element'" :style="settings.styles">

		<!-- If its the template builder mode -->
		<div v-if="settings.grandParent === 'TemplateBuilder'">
			{{ settings.configs.field === "" ? locals.text1 : locals.text + ' ' + settings.configs.field }}
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
			if (this.settings.grandParent === "TemplateBuilder") { // Initialize on moutned if its the template builder mode
				this.Initialize()
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
		},
	};
</script>

<style>
</style>