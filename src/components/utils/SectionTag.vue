<template>
	<span :class="['section-tag', {'active': active}]">{{_$t(`template-builder.sections.${tag}`)}}</span>
</template>

<script lang="ts">
	export default {
		name: 'SectionTag',
		props: {
			tag: {
				type: String,
				required: true
			},
			active: {
				type: Boolean,
				required: true
			}
		},
	}
</script>

<style>
</style>