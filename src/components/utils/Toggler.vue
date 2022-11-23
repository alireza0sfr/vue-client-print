<template>
	<span @click="clicked" :style="settings.styles" :class="['nk-toggler', isActive ? 'active' : '', settings.class]">
		<label>{{ settings.title }}</label>
	</span>
</template>

<script>
	import { merge } from '~/plugins/general-utilities'

	export default {
		emits: ['update:modelValue'],
		props: {
			options: { type: Object, required: true },
			modelValue: { type: [Boolean, String] },
			startup: { type: Boolean, default: false },
			disabled: { type: Boolean, default: false },
		},
		data() {
			return {
				isActive: false,
				settings: {
					isActive: false,
					title: 'Toggler',
					class: '',
					value: '',
				}
			}
		},
		watch: {
			options: {
				deep: true,
				immediate: true,
				handler(val) {
					this.settings = merge(this.settings, val)
					this.isActive = this.refreshIsActive()
				}
			}
		},
		methods: {
			clicked() {
				this.isActive = !this.isActive
				this.$emit('update:modelValue', this.isActive)
			},
			refreshIsActive() {
				if (this.modelValue === true)
					return true

				if (this.settings.isActive === true)
					return true

				return this.modelValue === this.settings.value
			},
		}
	}
</script>

<style lang="less">
	@import "~/styles/toggler.less";
</style>