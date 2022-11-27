<template>
	<div :id="element.id" ref="element" @size-changed="dataSetResized" @click="$emit('clickedOnElement', element)" @finished-editing-element="$emit('finished-editing-element')"
		:class="element.type + ' element'" :style="element.styles" tabindex="-1">
		<div v-if="element.grandParent === locals.ElementGrandParents.TEMPLATEBUILDER" class="dataset-name">
			<span>{{displaySet.configs.title}} <img src="@/assets/images/data-set.png" :alt="_$t('template-builder.elements.dataset')" width="20" height="20" /></span>
		</div>
		<div class="columns">
			<column v-for="column in filteredCols" :key="column.id" @width-changed="columnWidthChanged" :instance="column" @click.stop="$emit('clickedOnElement', column)" />
		</div>
		<div v-if="element.configs.selectedDataSet" class="rows">
			<row v-for="row in filteredRows" :key="row.id" :instance="row" @click.stop="$emit('clickedOnElement', row)" />
			<!-- Row is only clickable on TB and the default is added -->
		</div>
		<Resizers :query=" `${element.type}-${element.id}`" />
	</div>
</template>

<script lang="ts">
	import { ElementGrandParents, ElementParents, ElementTypes, StylesTargets } from '~/enums/element'
	import { IDataSetLikeElement } from '~/interfaces/elements'
	import { defineComponent } from 'vue'
	import { toFloatVal, merge, idGenerator, isEmpty } from '~/plugins/general-utilities'
	import { IColumn, IRow, IDatasets } from '@/interfaces/datasets'
	import { emptyDataSet, Element, DEFAULTELEMENTSTATES } from '@/plugins/element-utilities'
	export default defineComponent({
		name: ElementTypes.DATASET,
		props: {
			instance: Object as () => IDataSetLikeElement,
		},
		emits: ['clickedOnElement', 'finished-editing-element'],
		computed: {
			displaySet() {
				let dataSets: IDatasets = this.element.configs.dataSets

				if (!dataSets)
					return emptyDataSet

				var displaySet = dataSets![this.element.configs.selectedDataSet]

				if (isEmpty(displaySet))
					return emptyDataSet

				return displaySet
			},
			filteredCols() {

				var columns: IColumn[]

				if (isEmpty(this.displaySet))
					columns = []
				else
					columns = this.displaySet.configs.columns

				var sorted: IColumn[] = columns.sort((a: IColumn, b: IColumn) => a.configs.order - b.configs.order)

				return this.prepareColumns(sorted)
			},
			filteredRows() {
				if (this.element.grandParent === ElementGrandParents.TEMPLATEBUILDER)
					return this.element.configs.dataSetDefaultRow

				return this.prepareRows(this.displaySet.configs.rows)
			}
		},
		created() {
			if (isEmpty(this.element.configs.dataSets)) {
				var dataSets = this.element.computeDatasets(this.element.configs.dataSetDetails) || {}

				for (var key of Object.keys(dataSets))
					dataSets[key].configs.columns = []

				this.element.configs.dataSets = dataSets
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
					this.element = val.merge(this.element)
				},
			},
			'element.configs.selectedDataSet': {
				immediate: true,
				handler(val) {
					if (val && this.element.grandParent === ElementGrandParents.TEMPLATEBUILDER && this.element.states.isNew)
						this.element.configs.dataSets[val].configs.columns = []
				}
			},
		},
		data() {
			return {
				locals: {
					ElementGrandParents: ElementGrandParents,
				},
				element: {
					configs: {
						stylesTarget: StylesTargets.ALL,
						selectedDataSet: '',
						dataSets: {},
						dataSetDefaultRow: [new Element(ElementTypes.ROW, ElementParents.EMPTY, ElementGrandParents.TEMPLATEBUILDER, DEFAULTELEMENTSTATES, {}, {
							cells: {
								empty: {
									type: ElementTypes.CELL,
									id: idGenerator(),
									styles: {},
									parent: ElementParents.EMPTY,
									configs: {
										value: ''
									},
								}
							}
						})]
					},
					styles: {
						height: "100px",
						width: '300px',
					},
				} as IDataSetLikeElement,
			}
		},
		methods: {
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

					col.styles.height = this.calculateColumnHeight()
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

				if (width !== 0)
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
			 @param {IColumn[]} Columns - Column data.
			 @return {Object} - prepared options 
			 */
			prepareColumns(columns: IColumn[]): IColumn[] {

				if (!columns.length)
					return []

				this.setTotalWidth(columns)

				for (var col of columns) {
					col.styles.height = this.calculateColumnHeight()
				}

				return columns
			},
			/**
			 * Preparing Row options
			 @param {IRow[]} rows - Row data.
			 @return {Object} - prepared options 
			 */

			prepareRows(rows: IRow[]): IRow[] {

				var stylesTarget = this.element.configs.stylesTarget
				for (let index = 0; index < this.displaySet.configs.rows.length; index++) {
					var row = this.displaySet.configs.rows[index]
					if (
						stylesTarget === StylesTargets.EVEN && (index + 1) % 2 === 0 || // index is even
						stylesTarget === StylesTargets.ODD && (index + 1) % 2 === 1 || // index is odd
						stylesTarget === StylesTargets.ALL
					)
						row.styles = merge(row.styles, this.element.configs.dataSetDefaultRow[0].styles)

					row.styles.minHeight = this.element.configs.dataSetDefaultRow[0].styles.minHeight.toString() + 'px'
				}


				return rows
			}
		}
	})
</script>

<style>
</style>