<template>
	<div :id="element.id" ref="element" @click="$emit('clickedOnElement')" @finished-editing-element="$emit('finished-editing-element')" :class="element.type + ' element content-wrapper'" :style="element.styles">

		<!-- If its the template builder mode -->
		<div class="content" v-if="element.grandParent === locals.ElementGrandParents.TEMPLATEBUILDER">
			<span>
				{{ element.configs.field === "" ? locals.text1 : locals.text + ' ' + element.configs.field }}
			</span>
			<Resizers :query="`${locals.ElementTypes.BINDINGOBJECT}-${element.id}`" />
		</div>

		<!-- If its the print mode -->
		<div v-else>
			{{ computedValue }}
			<Resizers :query="`${locals.ElementTypes.BINDINGOBJECT}-${element.id}`" />
		</div>

	</div>
</template>

<script lang="ts">
	import { ElementGrandParents, ElementTypes } from '~/enums/element'
	import { IElement } from '~/interfaces/elements'
	import { toPersianDigits, merge } from '~/plugins/general-utilities'
	import { defineComponent } from 'vue'
	export default defineComponent({
		name: ElementTypes.BINDINGOBJECT,
		props: {
			instance: Object as () => IElement,
		},
		emits: ['clickedOnElement', 'finished-editing-element'],
		mounted() {
			if (this.element.grandParent === ElementGrandParents.TEMPLATEBUILDER)
				this.element.init(this.$refs.element as HTMLElement, `${this.element.type}-${this.element.id}`)

		},
		computed: {
			computedValue() {

				if (this.element.configs.persianNumbers) {

					return toPersianDigits(this.element.configs.value)
				}

				return this.element.configs.value
			}
		},
		watch: {
			instance: {
				immediate: true,
				handler(val) {
					this.element = merge(val, this.element)
				},
			},
		},
		data() {
			return {
				locals: {
					ElementTypes: ElementTypes,
					ElementGrandParents: ElementGrandParents,
					text: this._$t('template-builder.elements.bindingobject'),
					text1: this._$t('template-builder.elements.binding-object-text')
				},
				element: {
					configs: {
						persianNumbers: false,
						field: "",
						value: null,
					},
					styles: {
						whiteSpace: "pre",
						width: "150px",
					},
				} as IElement,
			}
		},
	})
</script>

<style>
</style>