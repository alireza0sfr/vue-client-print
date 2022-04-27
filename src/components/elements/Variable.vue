<template>
	<div v-if="variable">

		<!-- If the variable is text -->
		<div v-show="variable.type === 'text' ? true : false" :id="settings.id" @click="$emit('clickedOnElement')" @finishededitingelement="$emit('finishedEditingElement')" :class="locals.classType + ' element'" :style="settings.styles" ref="textVariable">
			{{ variable.context }}
			<Resizers classType="variable" />
		</div>

		<!-- If the variable is image -->
		<div v-show="variable.type === 'image' ? true : false" :id="settings.id" @click="$emit('clickedOnElement')" @finishededitingelement="$emit('finishedEditingElement')" :class="locals.classType + ' element'" :style="settings.styles" ref="imageVariable">
			<img class="image" draggable="false" :src="variable.context" alt="Image" />
			<Resizers classType="variable" />
		</div>

	</div>
</template>

<script>
	import ElementClass from '~/plugins/element-utilities.js'
	import Resizers from './Resizers.vue'
	export default {
		components: {
			Resizers,
		},
		name: "Variable",
		props: {
			options: Object,
			variable: Object,
		},
		mounted() {
			if (this.$parent.$options.name === "TemplateBuilder" && (this.$refs.textVariable || this.$refs.imageVariable)) { // Initialize on moutned if its the template builder mode
				this.Initialize(this.$refs.textVariable)
				this.Initialize(this.$refs.imageVariable)
			}
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
		data() {
			return {
				locals: {
					classType: "variable",
				},
				settings: {
					id: 0,
					configs: {
						uniqueId: '',
					},
					styles: {},
				},
			}
		},
		methods: {

			/**
			 * Initializing the element utilities for the created element
			 */
			Initialize(element) {
				let elem = new ElementClass(element, 'variable')
				elem.clickable()
				elem.resizable()
				elem.dragable()

			},

		},
	};
</script>

<style>
</style>
