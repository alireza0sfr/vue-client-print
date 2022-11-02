<template>
	<div :id="element.id" ref="element" @size-changed="dataSetResized" @click="$emit('clickedOnElement')" @finished-editing-element="$emit('finished-editing-element')" :class="element.type + ' element'" :style="element.styles">
		<div v-if="element.grandParent === locals.ElementGrandParents.TEMPLATEBUILDER" class="dataset-name">
			<span>{{displaySet.configs.title}} <img src="@/assets/images/data-set.png" :alt="_$t('template-builder.elements.dataset')" width="20" height="20" /></span>
		</div>
		<div class="columns">
			<Column v-for="column in filteredCols" :key="column.id" @width-changed="columnWidthChanged" :options="prepareColOptions(column)" @click.stop="$emit('clickedOnElement', column)" />
		</div>
		<div class="rows">
			<Row v-for="row in filteredRows" :key="row.id" :options="prepareRowOptions(row)" @click.stop="$emit('clickedOnElement', row)" @styles-target-changed="stylesTargetChanged" /> <!-- Row is only clickable on TB and the default is added -->
		</div>
		<Resizers :query=" `${element.type}-${element.id}`" />
	</div>
</template>

<script lang="ts">
	import { ElementGrandParents, ElementTypes, StylesTargets } from '~/enums/element'
	import { IElement } from '~/interfaces/elements'
	import { defineComponent } from 'vue'
	import { toFloatVal, shallowMerge } from '~/plugins/general-utilities'
	import { IColumn, IRow } from '@/interfaces/datasets'
	export default defineComponent({
		name: ElementTypes.DATASET,
		props: {
			instance: Object as () => IElement,
		},
		emits: ['clickedOnElement', 'finished-editing-element'],
		computed: {
			displaySet() {
				return this.element.configs.dataSets[this.element.configs.selectedDataSet]
			},
			filteredCols() {
				return this.setTotalWidth(this.displaySet.configs.columns.filter((x: IColumn) => x.configs.isActive))
			},
			filteredRows() {
				if (this.element.grandParent === ElementGrandParents.TEMPLATEBUILDER)
					return this.element.configs.defaultRow

				var index = 1
				var stylesTarget = this.element.configs.stylesTarget
				for (let row of this.displaySet.configs.rows) {

					if (
						stylesTarget === StylesTargets.EVEN && index % 2 === 0 || // index is even
						stylesTarget === StylesTargets.ODD && index % 2 === 1 || // index is odd
						stylesTarget === StylesTargets.ALL
					)
						row.styles = merge(row.styles, this.element.configs.defaultRow.styles)

					index += 1
				}
				return this.displaySet.configs.rows
			}
		},
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
					ElementGrandParents: ElementGrandParents
				},
				element: {
					styles: {
						height: "100px",
						width: '300px',
						minWidth: '70px'
					},
				} as IElement,
			}
		},
		methods: {
			/**
			 * event triggered style target dropdown changes
			 * @return {void} void
			 */
			stylesTargetChanged(target: StylesTargets): void {
				this.element.configs.stylesTarget = target
			},
			/**
			 * Calculate column height based on view.
			 * @return {Number} column height
			 */
			calculateColumnHeight(): string {
				var height

				if (this.element.styles.height === 'auto')
					height = this.element.configs.originalColumnHeight

				else
					height = this.element.styles.height

				if (this.element.grandParent === ElementGrandParents.TEMPLATEBUILDER)
					return toFloatVal(height) - 45 + 'px'

				return height
			},
			/**
			 * event triggered when dataset width changes
			 * @param {Event} e - dataset event.
			 * @return {void} void
			 */
			dataSetResized(e: any): void {
				const diffrence = e.detail.newValue.width - e.detail.oldValue.width
				const ratio = diffrence / e.detail.oldValue.width

				for (let col of this.displaySet.configs.columns) {
					col.styles.width = toFloatVal(col.styles.width)
					col.styles.width += ratio * col.styles.width
					col.styles.width = col.styles.width + 'px'
				}
			},

			/**
			 * calculate totalWidth based on columns width and set it to DataSet width.
			 */
			setTotalWidth(cols: IColumn[]): IColumn[] {
				let width = 0
				for (let col of cols) {

					if (!col.styles.width)
						continue

					if (typeof col.styles.width === 'string')
						width += parseFloat(col.styles.width.split('p')[0])

					else
						width += col.styles.width

				}
				this.element.styles.width = width + 'px'
				return cols
			},

			/**
			 * event triggered when column width changes
			 * @param {Number} startWidth - column's old width.
			 * @param {Number} newWidth - column's new width.
			 * @param {Number} id - column's id.
			 * @return {void} void
			 */
			columnWidthChanged(newWidth: number, id: string): void {
				var columns = this.displaySet.configs.columns

				var index = columns.findIndex((x: IColumn) => x.id === id)
				if (index < 0 && isNaN(newWidth)) // either column is not found or column has no neighbor
					return

				if (newWidth < 20)
					return

				const secondIndex = index === columns.length ? index - 1 : index + 1
				var thisColumn = columns[index]
				var seconColumn = columns[secondIndex]
				const startWidth = toFloatVal(thisColumn.styles.width) || 0
				const diffrence = newWidth - startWidth
				const minWidth = 20
				const maxWidth = toFloatVal(this.element.styles.width) - (columns.length * minWidth)

				if (diffrence < 0) {

					if (toFloatVal(thisColumn.styles.width) < minWidth)
						return

					if (maxWidth < toFloatVal(seconColumn.styles.width))
						return
				}

				if (diffrence > 0) {

					if (maxWidth < toFloatVal(thisColumn.styles.width))
						return

					if (toFloatVal(seconColumn.styles.width) < minWidth)
						return

				}

				thisColumn.styles.width = newWidth + 'px'
				seconColumn.styles.width = toFloatVal(seconColumn.styles.width) - diffrence
				seconColumn.styles.width = seconColumn.styles.width + 'px'
			},

			/**
			 * Preparing Col options
			 @param {Object} Column - Column data.
			 @return {Object} - prepared options 
			 */
			prepareColOptions(column: IColumn): IColumn {
				let defaultColStyles = {
					position: 'relative',
					resize: 'none',
					height: this.calculateColumnHeight()
				}
				column.styles = merge(defaultColStyles, column.styles)
				return column
			},
			/**
			 * Preparing Row options
			 @param {Object} row - Row data.
			 @return {Object} - prepared options 
			 */

			prepareRowOptions(row: IRow): IRow {

				row.grandParent = this.element.grandParent
				row.configs.stylesTarget = this.element.configs.stylesTarget
				row.configs.cells = {}
				row.configs.rowsHeight = 'auto'

				let defaultColStyles = {
					display: 'flex',
				}

				row.styles = merge(row.styles, defaultColStyles)
				return row
			}
		}
	})
</script>

<style>
</style>