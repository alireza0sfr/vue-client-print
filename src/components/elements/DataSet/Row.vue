<template>
	<div :id="element.id" ref="element" :class="element.type" :style="element.styles">
		<span v-for="row in element.configs.rows" :key="row" class="label" :style="row.styles">{{row.configs.value}}</span>
	</div>
</template>

<script lang="ts">
	import { ElementGrandParents, ElementParents, ElementTypes } from '~/enums/element'
	import { IElement } from '~/interfaces/elements'
	import { shallowMerge } from '~/plugins/general-utilities'
	import { defineComponent } from 'vue'
	import { ICell } from '@/interfaces/datasets'
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

					var rowsHeight = typeof (this.element.configs.rowsHeight) === 'number' ? this.element.configs.rowsHeight + 'px' : 'auto'
					this.element.styles.height = rowsHeight

					this.$emit('styles-target-changed', val.configs.stylesTarget)

					this.element = shallowMerge(val, this.element)
					this.element.configs.rows = this.prepareCells(this.element.configs.cells)
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
			prepareCells(cells: any): ICell[] {

				if (Object.keys(cells).includes('empty'))
					return cells

				var filtered: any
				var cells = this.element.configs.cells
				var objectKeys = Object.keys(cells)

				objectKeys.filter(x => {
					filtered.push(cells[x])

				})
				return filtered
			},
		},
		data() {
			return {
				element: {
					configs: {
						cells: {},
						stylesTarget: 'all',
						rowsHeight: 'auto',
					},
					styles: {
						display: 'flex',
					},
				} as IElement,
			}
		},
	})
</script>

<style>
</style>