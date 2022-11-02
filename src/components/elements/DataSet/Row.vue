<template>
	<div :id="element.id" ref="element" :class="element.type" :style="element.styles">
		<span v-for="row in filteredCells" :key="row" class="label" :style="row.styles">{{row.configs.value}}</span>
	</div>
</template>

<script lang="ts">
	import { ElementGrandParents, ElementTypes } from '~/enums/element'
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
		computed: {

			filteredCells(): ICell[] {
				var filtered: any
				var cells = this.element.configs.cells
				var objectKeys = Object.keys(cells)
				objectKeys.filter(x => {
					if (cells[x].configs.isActive)
						filtered.push(cells[x])
				})
				return filtered
			},
		},
		watch: {
			instance: {
				immediate: true,
				handler(val) {

					var rowsHeight = typeof (this.element.configs.rowsHeight) === 'number' ? this.element.configs.rowsHeight + 'px' : 'auto'
					this.element.styles.height = rowsHeight

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
						cells: {},
						stylesTarget: 'all',
						rowsHeight: 'auto',
					},
					styles: {},
				} as IElement,
			}
		},
	})
</script>

<style>
</style>