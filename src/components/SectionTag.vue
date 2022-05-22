<template>
	<span class="section-tag" :style="{backgroundColor: color}">{{$t(`template-builder.sections.${tag}`)}}</span>
</template>

<script>
	export default {
		name: 'SectionTag',
		props: {
			tag: {
				type: String,
				required: true
			},
			color: {
				type: String,
				default: '#98ceff'
			},
		},
	}
</script>

<style>
</style>