<template>
	<div :id="element.id" ref="element" @click="$emit('clickedOnElement', element)" @finished-editing-element="$emit('finished-editing-element')" :class="element.type + ' element content-wrapper'" :style="element.styles">

		<!-- If its the template builder mode -->
		<div class="content" v-if="element.grandParent === locals.ElementGrandParents.TEMPLATEBUILDER">
			<span>
				{{ element.configs.text }}
			</span>
			<Resizers :query="`${element.type}-${element.id}`" />
		</div>

		<!-- If its the print mode -->
		<div v-else>
			{{ computedValue }}
			<Resizers :query="`${element.type}-${element.id}`" />
		</div>

	</div>
</template>

<script lang="ts">
	import { ElementGrandParents, ElementTypes } from '~/enums/element'
	import { IElement } from '~/interfaces/elements'
	import { defineComponent } from 'vue'
	import { toPersianDigits } from '~/plugins/general-utilities'
	export default defineComponent({
		name: ElementTypes.TEXTPATTERN,
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
					this.element = val.merge(this.element)
				},
			},
		},
		data() {
			return {
				locals: {
					ElementGrandParents: ElementGrandParents,
				},
				element: {
					configs: {
						persianNumbers: false,
						text: this._$t('template-builder.elements.configs.pattern-input'),
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