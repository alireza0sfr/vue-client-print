<template>
	<div :id="settings.id" ref="element" @size-changed="dataSetResized" @click="$emit('clickedOnElement')" @finishededitingelement="$emit('finishedEditingElement')" :class="locals.classType + ' element'" :style="settings.styles">
		<span class="dataset-name"></span>
		<div class="columns">
			<Column v-for="(column, index) in filteredCols" :key="column.id" @width-changed="columnWidthChanged" :options="prepareComponentOptions('column', index !== displaySet.options.configs.columns.length -1, column)" />
		</div>
		<Resizers :query="`dataset-${settings.id}`" :resizers="['left', 'right']" />
	</div>
</template>

<script>
	import ElementClass from '~/plugins/element-utilities.js'
	import Resizers from '~/components/elements/Resizers.vue'
	import Column from '~/components/elements/DataSet/Column.vue'
	export default {
		components: {
			Resizers,
			Column
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
				this.setTotalWidth()
				return this.displaySet.options.configs.columns
				return this.settings.configs.columns.filter(x => !x.isDisabled)
			},
		},
		mounted() {
			if (this.$parent.$options.name === "TemplateBuilder") { // Initialize on moutned if its the template builder mode
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
						height: '30px',
					},
				},
			}
		},
		methods: {
			/**
			 * event triggered when dataset width changes
			 * @param {Event} e - dataset event.
			 * @return {void} void
			 */
			dataSetResized(e) {
				const toFloatWidth = (width) => parseFloat(width.split('p')[0])

				const diffrence = e.detail.newValue.width - e.detail.oldValue.width
				const ratio = diffrence / e.detail.oldValue.width

				for (let col of this.displaySet.options.configs.columns) {
					col.styles.width = toFloatWidth(col.styles.width)
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
			setTotalWidth() {
				let width = 0
				for (let col of this.displaySet.options.configs.columns) {

					if (!col.styles.width)
						continue

					if (typeof col.styles.width === 'string')
						width += parseFloat(col.styles.width.split('p')[0])

					else
						width += col.styles.width

				}
				this.settings.styles.width = width + 'px'
			},

			/**
			 * event triggered when column width changes
			 * @param {Number} startWidth - column's old width.
			 * @param {Number} newWidth - column's new width.
			 * @param {Number} id - column's id.
			 * @return {void} void
			 */
			columnWidthChanged(newWidth, id) {
				const toFloatWidth = (width) => parseFloat(parseFloat(width.split('p')[0]).toFixed(2))

				var columns = this.displaySet.options.configs.columns

				var index = columns.findIndex(x => x.id === id)
				if (index < 0 && isNaN(newWidth)) // either column is not found or column has no neighbor
					return

				if (newWidth < 20)
					return

				const secondIndex = index === columns.length ? index - 1 : index + 1
				var thisColumn = columns[index]
				var seconColumn = columns[secondIndex]
				const startWidth = toFloatWidth(thisColumn.styles.width) || 0
				const diffrence = newWidth - startWidth
				const minWidth = 20
				const maxWidth = toFloatWidth(this.settings.styles.width) - (columns.length * minWidth)

				if (diffrence < 0) {

					if (toFloatWidth(thisColumn.styles.width) < minWidth)
						return

					if (maxWidth < toFloatWidth(seconColumn.styles.width))
						return
				}

				if (diffrence > 0) {

					if (maxWidth < toFloatWidth(thisColumn.styles.width))
						return

					if (toFloatWidth(seconColumn.styles.width) < minWidth)
						return

				}

				thisColumn.styles.width = newWidth + 'px'
				seconColumn.styles.width = toFloatWidth(seconColumn.styles.width) - diffrence
				seconColumn.styles.width = seconColumn.styles.width + 'px'
			},

			/**
			 * Preparing component options
			 @param {String} optionsName - determine which option is needed.
			 @param {Boolean} hasResizer - determine that the column hasResizer or not.
			 @return {Object} - prepared options 
			 */
			prepareComponentOptions(optionsName, hasResizer, column) {
				let tmp = {
					column: {
						grandParent: this.$parent.$options.name,
						hasResizer: hasResizer,
						id: column.id,
						configs: {
							name: column.name
						},
						styles: {
							position: 'relative',
							height: this.settings.styles.height,
							// display: 'table-cell',
							resize: 'none',
						},
					},
				}
				Object.assign(tmp[optionsName].styles, column.styles)
				return tmp[optionsName]
			}
		}
	}
</script>

<style>
</style>