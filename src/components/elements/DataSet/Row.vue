<template>
	<div :id="element.id" ref="element" class="vcp-row" :style="element.styles" tabindex="-1">
		<div v-for="cell in element.configs.cells" class="vcp-cell" :style="cell.styles" :key="cell">{{cell.value}}</div>
	</div>
</template>

<script lang="ts">
	import { ElementGrandParents, ElementTypes, StylesTargets } from '~/enums/element'
	import { IElement } from '~/interfaces/elements'
	import { DEFAULTROWSHEIGHT } from '~/plugins/element-utilities'
	import { defineComponent } from 'vue'
	export default defineComponent({
		name: ElementTypes.ROW,
		props: {
			instance: Object as () => IElement,
		},
		watch: {
			instance: {
				immediate: true,
				handler(val) {
					this.element = val.merge(this.element)
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
						stylesTarget: StylesTargets.ALL
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