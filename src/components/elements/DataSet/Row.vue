<template>
	<tr :id="element.id" ref="element" :class="element.type" :style="element.styles">
		<td v-for="cell in element.configs.cells" :style="cell.styles" :key="cell">{{cell.value}}</td>
	</tr>
</template>

<script lang="ts">
	import { ElementGrandParents, ElementTypes } from '~/enums/element'
	import { IElement } from '~/interfaces/elements'
	import { shallowMerge } from '~/plugins/general-utilities'
	import { DEFAULTROWSHEIGHT } from '~/plugins/element-utilities'
	import { defineComponent } from 'vue'
	export default defineComponent({
		name: ElementTypes.ROW,
		props: {
			instance: Object as () => IElement,
		},
		emits: ['styles-target-changed'],
		watch: {
			instance: {
				immediate: true,
				handler(val) {
					this.$emit('styles-target-changed', val.configs.stylesTarget)
					this.element = shallowMerge(val, this.element)
				},
			},
		},
		mounted() {
			if (this.element.grandParent === ElementGrandParents.TEMPLATEBUILDER)
				this.initialize()
		},
		methods: {
			/**
			 * Initializing the element utilities for the created element
			 */
			initialize() {
				this.element.makeClickable(this.$refs.element as HTMLElement)
			},
		},
		data() {
			return {
				element: {
					configs: {
						cells: [],
						stylesTarget: 'all'
					},
					styles: {
						height: 'auto',
						minHeight: DEFAULTROWSHEIGHT,
					},
				} as IElement,
			}
		},
	})
</script>

<style>
</style>