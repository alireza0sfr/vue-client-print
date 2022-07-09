<template>
	<span class="section-tag">{{_$t(`template-builder.sections.${tag}`)}}</span>
</template>

<script>
	export default {
		name: 'SectionTag',
		props: {
			tag: {
				type: String,
				required: true
			},
		},
	}
</script>

<style>
</style>