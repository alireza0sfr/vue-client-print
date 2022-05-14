<template>
	<div :id="settings.id" ref="element" @size-changed="dataSetResized" @click="$emit('clickedOnElement')" @finishededitingelement="$emit('finishededitingelement')" :class="locals.classType + settings.class + ' element'" :style="settings.styles">
		<div v-if="settings.grandParent === 'TemplateBuilder'" class="name">
			<span>{{displaySet.options.configs.title}} <img src="@/assets/images/data-set.png" :alt="$t('template-builder.elements.dataset')" width="20" height="20" /></span>
		</div>
		<div class="columns">
			<Column v-for="column in filteredCols" :key="column.options.id" @width-changed="columnWidthChanged" :options="prepareColOptions(column)" @click.stop="$emit('clickedOnElement', column)" />
		</div>
		<div class="rows">
			<Row v-for="row in filteredRows" :key="row.id" :options="prepareRowOptions(row)" @click.stop="$emit('clickedOnElement', row)" @styles-target-changed="stylesTargetChanged" /> <!-- Row is only clickable on TB and row['center'] is the default row on TB -->
		</div>
		<Resizers :query=" `dataset-${settings.id}`" :resizers="['br']" />
	</div>
</template>

<script>
	import ElementClass from '~/plugins/element-utilities.ts'
	export default {
		name: "DataSet",
		props: {
			options: Object,
		},
		computed: {
			displaySet() {
				return this.settings.configs.dataSets[this.settings.configs.selectedDataSet]
			},
			filteredCols() {
				return this.setTotalWidth(this.displaySet.options.configs.columns.filter(x => x.isActive))
			},
			filteredRows() {
				if (this.settings.grandParent === 'TemplateBuilder')
					return this.locals.defaultRow

				var index = 1
				var stylesTarget = this.settings.configs.stylesTarget
				for (let row of this.displaySet.options.configs.rows) {

					if (
						stylesTarget === 'even' && index % 2 === 0 || // index is even
						stylesTarget === 'odd' && index % 2 === 1 || // index is odd
						stylesTarget === 'all'
					)
						row.options.styles = Object.assign(row.options.styles, this.locals.defaultRow[0].options.styles)

					index += 1
				}
				return this.displaySet.options.configs.rows
			}
		},
		mounted() {
			if (this.settings.grandParent === 'TemplateBuilder') { // Initialize on moutned if its the template builder mode
				this.Initialize()
			}
		},
		watch: {
			options: {
				immediate: true,
				deep: true,
				handler(val) {
					this.settings = this.merge(this.settings, val)
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
						height: '80px',
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
					return this.toFloatVal(height) - 45 + 'px'

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

				for (let col of this.displaySet.options.configs.columns) {
					col.options.styles.width = this.toFloatVal(col.options.styles.width)
					col.options.styles.width += ratio * col.options.styles.width
					col.options.styles.width = col.options.styles.width + 'px'
				}
			},
			/**
			* Initializing the element utilities for the created element
			*/
			Initialize(element = this.$refs.element) {
				let elem = new ElementClass(element, `dataset-${this.settings.id}`, this.settings)
				elem.clickable()
				elem.resizable()
				elem.dragable()
			},

			/**
			 * calculate totalWidth based on columns width and set it to DataSet width.
			 */
			setTotalWidth(cols) {
				let width = 0
				for (let col of cols) {

					if (!col.options.styles.width)
						continue

					if (typeof col.options.styles.width === 'string')
						width += parseFloat(col.options.styles.width.split('p')[0])

					else
						width += col.options.styles.width

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
				var columns = this.displaySet.options.configs.columns

				var index = columns.findIndex(x => x.options.id === id)
				if (index < 0 && isNaN(newWidth)) // either column is not found or column has no neighbor
					return

				if (newWidth < 20)
					return

				const secondIndex = index === columns.length ? index - 1 : index + 1
				var thisColumn = columns[index]
				var seconColumn = columns[secondIndex]
				const startWidth = this.toFloatVal(thisColumn.options.styles.width) || 0
				const diffrence = newWidth - startWidth
				const minWidth = 20
				const maxWidth = this.toFloatVal(this.settings.styles.width) - (columns.length * minWidth)

				if (diffrence < 0) {

					if (this.toFloatVal(thisColumn.options.styles.width) < minWidth)
						return

					if (maxWidth < this.toFloatVal(seconColumn.options.styles.width))
						return
				}

				if (diffrence > 0) {

					if (maxWidth < this.toFloatVal(thisColumn.options.styles.width))
						return

					if (this.toFloatVal(seconColumn.options.styles.width) < minWidth)
						return

				}

				thisColumn.options.styles.width = newWidth + 'px'
				seconColumn.options.styles.width = this.toFloatVal(seconColumn.options.styles.width) - diffrence
				seconColumn.options.styles.width = seconColumn.options.styles.width + 'px'
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
				var computedStyles = Object.assign(defaultColStyles, column.options.styles)
				let tmp = {
					grandParent: this.settings.grandParent,
					hasResizer: column.hasResizer,
					id: column.options.id,
					configs: {
						title: column.title
					},
					styles: computedStyles,
				}
				Object.assign(tmp.styles, column.options.styles)
				return tmp
			},
			/**
			 * Preparing Row options
			 @param {Object} row - Row data.
			 @return {Object} - prepared options 
			 */

			prepareRowOptions(row) {
				row.options.grandParent = this.settings.grandParent
				row.options.configs.stylesTarget = this.settings.configs.stylesTarget
				let defaultColStyles = {
					display: 'flex',
				}
				row.options.styles = Object.assign(row.options.styles, defaultColStyles)
				return row.options
			}
		}
	}
</script>

<style>
</style>