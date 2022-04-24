<template>
	<div :id="settings.id" ref="element" @size-changed="dataSetResized" @click="$emit('clickedOnElement')" @finishededitingelement="$emit('finishedEditingElement')" :class="locals.classType + ' element'" :style="settings.styles">
		<div v-if="$parent.$options.name === 'TemplateBuilder'" class="name">
			<span>{{displaySet.options.configs.title}} <img src="@/assets/images/data-set.png" :alt="$t('template-builder.elements.dataset')" width="20" height="20" /></span>
		</div>
		<div class="columns">
			<Column v-for="column in filteredCols" :key="column.id" @width-changed="columnWidthChanged" :options="prepareColOptions(column)" />
		</div>
		<div v-if="$parent.$options.name === 'Print'"  class="rows">
			<Row v-for="row in filteredRows" :key="row.id" :options="prepareRowOptions(row)" />
		</div>
		<Resizers :query=" `dataset-${settings.id}`" :resizers="['br']" />
	</div>
</template>

<script>
	import ElementClass from '~/plugins/element-utilities.js'
	import Resizers from '~/components/elements/Resizers.vue'
	import Column from '~/components/elements/DataSet/Column.vue'
	import Row from '~/components/elements/DataSet/Row.vue'
	export default {
		components: {
			Resizers,
			Column,
			Row
		},
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
				console.log(this.displaySet.options.configs.rows)
				return this.displaySet.options.configs.rows
			}
		},
		mounted() {
			if (this.$parent.$options.name === 'TemplateBuilder') { // Initialize on moutned if its the template builder mode
				this.Initialize()
			}
		},
		watch: {
			options: {
				immediate: true,
				deep: true,
				handler(val) {
					let tmp = this.options.styles
					Object.assign(this.settings, val)
					this.settings.styles = tmp
					Object.assign(this.settings.styles, val.styles)
				},
			},
		},
		data() {
			return {
				locals: {
					classType: 'dataset',
				},
				settings: {
					id: 0,
					configs: {
						selectedSet: '',
						dataSets: {}
					},
					styles: {
						height: '80px',
					},
				},
			}
		},
		methods: {
			/**
			 * Calculate column height based on view.
			 * @return {Number} column height
			 */
			calculateColumnHeight() {
				if (this.$parent.$options.name === 'TemplateBuilder')
					return this.toFloatWidth(this.settings.styles.height) - 20 + 'px'

				return this.settings.styles.height
			},
			/**
			 * Convert string wdith to float width 2 decimals.
			 * @param {String} width - width.
			 * @return {Number} parsed Width
			 */
			toFloatWidth(width) {
				return parseFloat(width.split('p')[0])
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
					col.styles.width = this.toFloatWidth(col.styles.width)
					col.styles.width += ratio * col.styles.width
					col.styles.width = col.styles.width + 'px'
				}
			},
			/**
			* Initializing the element utilities for the created element
			*/
			Initialize(element = this.$refs.element) {
				let elem = new ElementClass(element, `dataset-${this.settings.id}`)
				elem.click()
				elem.resizable()
				elem.dragable()
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
				var columns = this.displaySet.options.configs.columns

				var index = columns.findIndex(x => x.id === id)
				if (index < 0 && isNaN(newWidth)) // either column is not found or column has no neighbor
					return

				if (newWidth < 20)
					return

				const secondIndex = index === columns.length ? index - 1 : index + 1
				var thisColumn = columns[index]
				var seconColumn = columns[secondIndex]
				const startWidth = this.toFloatWidth(thisColumn.styles.width) || 0
				const diffrence = newWidth - startWidth
				const minWidth = 20
				const maxWidth = this.toFloatWidth(this.settings.styles.width) - (columns.length * minWidth)

				if (diffrence < 0) {

					if (this.toFloatWidth(thisColumn.styles.width) < minWidth)
						return

					if (maxWidth < this.toFloatWidth(seconColumn.styles.width))
						return
				}

				if (diffrence > 0) {

					if (maxWidth < this.toFloatWidth(thisColumn.styles.width))
						return

					if (this.toFloatWidth(seconColumn.styles.width) < minWidth)
						return

				}

				thisColumn.styles.width = newWidth + 'px'
				seconColumn.styles.width = this.toFloatWidth(seconColumn.styles.width) - diffrence
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
				var computedStyles = Object.assign(defaultColStyles, column.styles)
				let tmp = {
					grandParent: this.$parent.$options.name,
					hasResizer: column.hasResizer,
					id: column.id,
					configs: {
						name: column.name
					},
					styles: computedStyles,
				}
				Object.assign(tmp.styles, column.styles)
				return tmp
			},
			/**
			 * Preparing Row options
			 @param {Object} row - Row data.
			 @return {Object} - prepared options 
			 */
			prepareRowOptions(row) {
				let defaultColStyles = {
					display: 'flex'
				}
				var computedStyles = Object.assign(defaultColStyles, row.styles)
				let tmp = {
					grandParent: this.$parent.$options.name,
					id: row.id,
					configs: {
						rows: row.data
					},
					styles: computedStyles,
				}
				Object.assign(tmp.styles, row.styles)
				return tmp
			}
		}
	}
</script>

<style>
</style>