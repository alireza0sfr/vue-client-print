<template>
	<div :id="settings.id" ref="element" @size-changed="dataSetResized" @click="$emit('clickedOnElement')" @finished-editing-element="$emit('finished-editing-element')" :class="locals.classType + settings.class + ' element'" :style="settings.styles">
		<div v-if="settings.grandParent === 'TemplateBuilder'" class="dataset-name">
			<span>{{displaySet.configs.title}} <img src="@/assets/images/data-set.png" :alt="_$t('template-builder.elements.dataset')" width="20" height="20" /></span>
		</div>
		<div class="columns">
			<Column v-for="column in filteredCols" :key="column.id" @width-changed="columnWidthChanged" :options="prepareColOptions(column)" @click.stop="$emit('clickedOnElement', column)" />
		</div>
		<div class="rows">
			<Row v-for="row in filteredRows" :key="row.id" :options="prepareRowOptions(row)" @click.stop="$emit('clickedOnElement', row)" @styles-target-changed="stylesTargetChanged" /> <!-- Row is only clickable on TB and the default is added -->
		</div>
		<Resizers :query=" `dataset-${settings.id}`" />
	</div>
</template>

<script>
import { initElementStyles, initializeGeneralElement } from '~/plugins/element-utilities'
import { toFloatVal, merge } from '~/plugins/general-utilities'
	export default {
		name: "DataSet",
		props: {
			options: Object,
		},
		emits:['clickedOnElement', 'finished-editing-element'],
		computed: {
			displaySet() {
				return this.settings.configs.dataSets[this.settings.configs.selectedDataSet]
			},
			filteredCols() {
				return this.setTotalWidth(this.displaySet.configs.columns.filter(x => x.isActive))
			},
			filteredRows() {
				if (this.settings.grandParent === 'TemplateBuilder')
					return this.locals.defaultRow

				var index = 1
				var stylesTarget = this.settings.configs.stylesTarget
				for (let row of this.displaySet.configs.rows) {

					if (
						stylesTarget === 'even' && index % 2 === 0 || // index is even
						stylesTarget === 'odd' && index % 2 === 1 || // index is odd
						stylesTarget === 'all'
					)
						row.styles = merge(row.styles, this.locals.defaultRow[0].styles)

					index += 1
				}
				return this.displaySet.configs.rows
			}
		},
		mounted() {
			if (this.settings.grandParent === 'TemplateBuilder') { // Initialize on moutned if its the template builder mode
				initializeGeneralElement(this.$refs.element, `${this.locals.classType}-${this.settings.id}`, this.settings)
			}
		},
		watch: {
			options: {
				immediate: true,
				deep: true,
				handler(val) {
					this.settings = merge(this.settings, val)
					this.settings.styles = initElementStyles(this.settings.styles)
				},
			},
		},
		data() {
			return {
				locals: {
					classType: 'dataset',
					defaultRow: this.options.configs.defaultRow
				},
				settings: {
					grandParent: 'TemplateBuilder',
					id: 0,
					class: '',
					configs: {
						stylesTarget: 'all',
						selectedSet: '',
						dataSets: {},
					},
					styles: {
						height: "100px",
						width: '300px',
						minWidth: '70px'
					},
				},
			}
		},
		methods: {
			/**
			 * event triggered style target dropdown changes
			 * @return {void} void
			 */
			stylesTargetChanged(target) {
				this.settings.configs.stylesTarget = target
			},
			/**
			 * Calculate column height based on view.
			 * @return {Number} column height
			 */
			calculateColumnHeight() {
				var height

				if (this.settings.styles.height === 'auto')
					height = this.settings.configs.originalColumnHeight

				else
					height = this.settings.styles.height

				if (this.settings.grandParent === 'TemplateBuilder')
					return toFloatVal(height) - 45 + 'px'

				return height
			},
			/**
			 * event triggered when dataset width changes
			 * @param {Event} e - dataset event.
			 * @return {void} void
			 */
			dataSetResized(e) {
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
			setTotalWidth(cols) {
				let width = 0
				for (let col of cols) {

					if (!col.styles.width)
						continue

					if (typeof col.styles.width === 'string')
						width += parseFloat(col.styles.width.split('p')[0])

					else
						width += col.styles.width

				}
				this.settings.styles.width = width + 'px'
				return cols
			},

			/**
			 * event triggered when column width changes
			 * @param {Number} startWidth - column's old width.
			 * @param {Number} newWidth - column's new width.
			 * @param {Number} id - column's id.
			 * @return {void} void
			 */
			columnWidthChanged(newWidth, id) {
				var columns = this.displaySet.configs.columns

				var index = columns.findIndex(x => x.id === id)
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
				const maxWidth = toFloatVal(this.settings.styles.width) - (columns.length * minWidth)

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
			prepareColOptions(column) {
				let defaultColStyles = {
					position: 'relative',
					resize: 'none',
					height: this.calculateColumnHeight()
				}
				var computedStyles = merge(defaultColStyles, column.styles)
				let tmp = {
					grandParent: this.settings.grandParent,
					hasResizer: column.hasResizer,
					id: column.id,
					configs: {
						title: column.title
					},
					styles: computedStyles,
				}
				merge(tmp.styles, column.styles)
				return tmp
			},
			/**
			 * Preparing Row options
			 @param {Object} row - Row data.
			 @return {Object} - prepared options 
			 */

			prepareRowOptions(row) {
				row.grandParent = this.settings.grandParent
				row.configs.stylesTarget = this.settings.configs.stylesTarget
				let defaultColStyles = {
					display: 'flex',
				}
				row.styles = merge(row.styles, defaultColStyles)
				return row
			}
		}
	}
</script>

<style>
</style>