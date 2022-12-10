<template>
	<div :id="element.id" :data-testid="element.id" ref="element" @click="$emit('clickedOnElement', element)" @finished-editing-element="$emit('finished-editing-element')"
		:class="element.type + ' vcp-element content-wrapper'" :style="element.styles" tabindex="-1">
		<div class="content">
			{{element.configs.text}}
		</div>
		<Resizers :query="`${element.type}-${element.id}`" />
	</div>
</template>

<script lang="ts">
	import { ElementGrandParents, ElementTypes } from '~/enums/element'
	import { IElement } from '~/interfaces/elements'
	import { defineComponent } from 'vue'
	export default defineComponent({
		name: ElementTypes.TEXTELEMENT,
		props: {
			instance: Object as () => IElement,
		},
		emits: ['clickedOnElement', 'finished-editing-element'],
		mounted() {
			if (this.element.grandParent === ElementGrandParents.TEMPLATEBUILDER)
				this.element.init(this.$refs.element as HTMLElement, `${this.element.type}-${this.element.id}`)
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
				element: {
					configs: { text: this._$t('template-builder.elements.configs.type-text') },
					styles: {
						whiteSpace: "pre",
						width: "150px",
						fontWeight: "",
					},
				} as IElement,
			}
		},
	})
</script>

<style>
</style>