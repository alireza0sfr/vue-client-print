<template>
	<div :id="settings.id" ref="element" :class="locals.classType + settings.class" :style="settings.styles">
		<span v-for="row in filteredCells" :key="row" class="label" :style="row.options.styles">{{row.options.configs.value}}</span>
	</div>
</template>

<script>
	import ElementClass from '~/plugins/element-utilities.js'
	export default {
		name: "Row",
		props: {
			options: Object,
		},
		computed: {
			filteredCells() {
				var filtered = []
				var cells = this.settings.configs.cells
				var objectKeys = Object.keys(cells)
				objectKeys.filter(x => {
					if (cells[x].isActive)
						filtered.push(cells[x])
				})
				return filtered
			},
		},
		watch: {
			options: {
				immediate: true,
				deep: true,
				handler(val) {

					var rowsHeight = typeof (this.settings.configs.rowsHeight) === 'number' ? this.settings.configs.rowsHeight + 'px' : 'auto'
					this.settings.styles.height = rowsHeight

					this.$emit('styles-target-changed', val.configs.stylesTarget)

					this.settings = this.merge(this.settings, val)
				},
			},
		},
		mounted() {
			if (this.settings.grandParent === "TemplateBuilder") { // Initialize on moutned if its the template builder mode
				this.Initialize()
			}
		},
		methods: {
			/**
			 * Initializing the element utilities for the created element
			 */
			Initialize() {
				let elem = new ElementClass(this.$refs.element, `column-${this.settings.id}`, this.settings)
				elem.clickable()
			},
		},
		data() {
			return {
				locals: {
					classType: "row",
				},
				settings: {
					grandParent: 'Print',
					class: '',
					id: 0,
					configs: {
						cells: {},
						stylesTarget: 'all',
						rowsHeight: 'auto',
					},
					styles: {},
				},
			}
		},
	}
</script>

<style>
</style>