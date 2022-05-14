<template>
	<div :id="settings.id" @click="$emit('clickedOnElement')" @finishededitingelement="$emit('finishededitingelement')" :class="locals.classType + ' element'" :style="settings.styles" ref="element">
		<img class="image" draggable="false" :src="settings.configs.imageSrc" alt="Image" />
		<Resizers :query="`imageelement-${settings.id}`" />
	</div>
</template>

<script>
	import DefaultLogo from '@/assets/images/logo.png'
	import Resizers from '~/components/elements/Resizers.vue'
	export default {
		components: {
			Resizers,
		},
		name: "ImageElement",
		props: {
			options: Object,
		},
		mounted() {
			if (this.settings.grandParent === "TemplateBuilder") { // Initialize on moutned if its the template builder mode
				this.Initialize(this.$refs.element, `${this.locals.classType}-${this.settings.id}`, this.settings)
			}
		},
		watch: {
			options: {
				immediate: true,
				deep: true,
				handler(val) {
					this.settings = this.merge(this.settings, val)
				},
			},
		},
		data() {
			return {
				locals: {
					classType: "imageelement",
				},
				settings: {
					grandParent: 'TemplateBuilder',
					id: 0,
					configs: {
						imageSrc: DefaultLogo,
					},
					styles: {},
				},
			}
		},
	};
</script>

<style>
</style>