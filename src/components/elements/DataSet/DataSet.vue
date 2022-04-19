<template>
	<div :id="settings.id" ref="element" @size-changed="dataSetResized" @click="$emit('clickedOnElement')" @finishededitingelement="$emit('finishedEditingElement')" :class="locals.classType + ' element'" :style="settings.styles">
		<div class="columns">
			<Column v-for="(column, index) in settings.configs.columns" :key="column.id" @width-changed="columnWidthChanged" :options="prepareComponentOptions('column', index !== settings.configs.columns.length -1, column)" />
		</div>
		<Resizers :query="`dataset-${this.settings.id}`" :resizers="['left', 'right']" />
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
		mounted() {
			if (this.$parent.$options.name === "TemplateBuilder") { // Initialize on moutned if its the template builder mode
				this.Initialize()
			}
			this.setTotalWidth()
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
						columns: [],
						rows: []
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

				for (let col of this.settings.configs.columns) {
					col.width = toFloatWidth(col.width)
					col.width += ratio * col.width
					col.width = col.width + 'px'
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
				for (let col of this.settings.configs.columns) {

					if (!col.width)
						continue

					if (typeof col.width === 'string')
						width += parseFloat(col.width.split('p')[0])

					else
						width += col.width

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

				var columns = this.settings.configs.columns

				var index = columns.findIndex(x => x.id === id)
				if (index < 0 && isNaN(newWidth)) // either column is not found or column has no neighbor
					return

				if (newWidth < 20)
					return

				const startWidth = toFloatWidth(this.settings.configs.columns[index].width) || 0
				const diffrence = newWidth - startWidth
				const minWidth = 20
				const maxWidth = toFloatWidth(this.settings.styles.width) - (this.settings.configs.columns.length * minWidth)
				const secondIndex = index === this.settings.configs.columns.length ? index - 1 : index + 1

				if (diffrence < 0) {

					if (toFloatWidth(this.settings.configs.columns[index].width) < minWidth)
						return

					if (maxWidth < toFloatWidth(this.settings.configs.columns[secondIndex].width))
						return
				}

				if (diffrence > 0) {

					if (maxWidth < toFloatWidth(this.settings.configs.columns[index].width))
						return

					if (toFloatWidth(this.settings.configs.columns[secondIndex].width) < minWidth)
						return

				}

				this.settings.configs.columns[index].width = newWidth + 'px'
				this.settings.configs.columns[secondIndex].width = toFloatWidth(this.settings.configs.columns[secondIndex].width) - diffrence
				this.settings.configs.columns[secondIndex].width = this.settings.configs.columns[secondIndex].width + 'px'
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
							width: column.width
						},
					},
				}
				return tmp[optionsName]
			}
		}
	}
</script>

<style>
</style>