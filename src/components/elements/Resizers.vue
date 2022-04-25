<template>
	<div v-for="area in cleanedResizeables" :key="area" :class="`elem-resizer ${area} ${query} resizer-${size}`"></div>
</template>

<script>
	export default {
		props: {
			resizers: { type: Array, default: ['br'] },
			query: { type: String, required: true },
			size: { type: String, default: 'sm'}
		},
		watch: {
			resizers: {
				immediate: true,
				deep: true,
				handler(val) {
					if (val && val.length)
						this.resizer = val
				},
			},
		},
		computed: {
			cleanedResizeables() {
				return this.resizers.filter(x => x && x.length > 1)
			},
		},
	}
</script>

<style>
</style>