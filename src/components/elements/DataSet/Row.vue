<template>
	<div :id="settings.id" ref="element" :class="locals.classType" :style="settings.styles">
		<span v-for="row in filteredcells" :key="row" class="label" :style="row.options.styles">{{row.options.configs.value}}</span>
	</div>
</template>

<script>
	export default {
		name: "Row",
		props: {
			options: Object,
		},
		computed: {
			filteredcells() {
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
					let tmp = this.options.styles
					Object.assign(this.settings, val)
					this.settings.styles = tmp
					Object.assign(this.settings.styles, val.styles)
				},
			},
		},
		mounted() {
		},
		data() {
			return {
				locals: {
					classType: "row",
				},
				settings: {
					grandParent: 'Print',
					id: 0,
					configs: {
						cells: {}
					},
					styles: {},
				},
			}
		},
	}
</script>

<style>
</style>