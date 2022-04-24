<template>
	<div :id="settings.id" ref="element" :class="locals.classType" :style="settings.styles">
		<span v-for="row in settings.configs.rows" :key="row" class="label" :style="row.styles">{{row.name}}</span>
	</div>
</template>

<script>
	export default {
		name: "Row",
		props: {
			options: Object,
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
						rows: {
							name: 'Row1'
						}
					},
					styles: {},
				},
			}
		},
	}
</script>

<style>
</style>