<template>
	<span :class="['section-tag', {'active': current === tag}]">{{_$t(`template-builder.sections.${tag}`)}}</span>
</template>

<script>
	export default {
		name: 'SectionTag',
		props: {
			tag: {
				type: String,
				required: true
			},
			current: {
				type: [String, null],
				required: true
			}
		},
	}
</script>

<style>
</style>