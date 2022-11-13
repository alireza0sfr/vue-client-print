<template>
	<div :id="element.id" @click="$emit('clickedOnElement', element)" @finished-editing-element="$emit('finished-editing-element')" :class="element.type + ' element content-wrapper'" :style="element.styles" ref="element">
		<span v-if="element.configs.variableType === locals.VariableTypes.TEXT ? true : false" class="content">
			{{ element.configs.context }}
		</span>
		<img v-else class="image" :src="element.configs.context" alt="Image" />
		<Resizers :query="`${element.type}-${element.id}`" />
	</div>
</template>

<script lang="ts">
	import { ElementGrandParents, ElementTypes, VariableTypes } from '~/enums/element'
	import { IElement } from '~/interfaces/elements'
	import { shallowMerge } from '~/plugins/general-utilities'
	import { defineComponent } from 'vue'
	export default defineComponent({
		name: ElementTypes.VARIABLE,
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
					this.element = shallowMerge(val, this.element)
				},
			},
		},
		data() {
			return {
				locals: {
					ElementTypes: ElementTypes,
					VariableTypes: VariableTypes
				},
				element: {
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
