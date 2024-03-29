<template>
	<div :id="element.id" ref="element" @click="$emit('clickedOnElement', element)" @finished-editing-element="$emit('finished-editing-element')" :class="element.type + ' vcp-element content-wrapper'"
		:style="element.styles" tabindex="-1">
		<div class="content">
			{{ computedValue }}
			<Resizers :query="`${element.type}-${element.id}`" />
		</div>

	</div>
</template>

<script lang="ts">
	import { ElementGrandParents, ElementTypes } from '~/enums/element'
	import { IElement } from '~/interfaces/elements'
	import { toPersianDigits } from '~/plugins/general-utilities'
	import { defineComponent } from 'vue'

	import { useGeneralStore } from '~/stores/general'
	const generalStore = useGeneralStore()

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
				
				var translateFunction = (key: string): string => key
				const storeFunction = generalStore.getByKey('configurations').translateFunction

				if (storeFunction && typeof storeFunction === 'function')
					translateFunction = storeFunction

				if (this.element.grandParent === ElementGrandParents.TEMPLATEBUILDER)
					return this.element.configs.field === "" ? this.locals.text1 : this.locals.text + ' ' + translateFunction(this.element.configs.field)

				else {

					if (this.element.configs.persianNumbers)
						return toPersianDigits(this.element.configs.value)

					return this.element.configs.value
				}

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
					translateFunction: null,
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