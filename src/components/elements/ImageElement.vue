<template>
	<div :id="element.id" :data-testid="element.id" @click="$emit('clickedOnElement', element)" @finished-editing-element="$emit('finished-editing-element')" :class="element.type + ' vcp-element'"
		:style="element.styles" ref="element" tabindex="-1">
		<img class="image" :src="element.configs.imageSrc" alt="Image" />
		<Resizers :query="`${element.type}-${element.id}`" />
	</div>
</template>

<script lang="ts">
	import { ElementGrandParents, ElementTypes } from '~/enums/element'
	import { IElement } from '~/interfaces/elements'
	import { defineComponent } from 'vue'
	export default defineComponent({
		name: ElementTypes.IMAGEELEMENT,
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
					styles: {
						width: "100px",
						height: "100px",
					}
				} as IElement,
			}
		},
	})
</script>

<style>
</style>