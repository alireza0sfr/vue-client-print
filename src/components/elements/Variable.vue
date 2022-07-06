<template>
	<div v-if="variable">

		<!-- If the variable is text -->
		<div v-show="variable.type === 'text' ? true : false" :id="settings.id" @click="$emit('clickedOnElement')" @finished-editing-element="$emit('finished-editing-element')" :class="locals.classType + ' element content-wrapper'" :style="settings.styles" ref="textVariable">
			<span class="content">
				{{ variable.context }}
			</span>
			<Resizers :query="`variable-${this.settings.id}`" />
		</div>

		<!-- If the variable is image -->
		<div v-show="variable.type === 'image' ? true : false" :id="settings.id" @click="$emit('clickedOnElement')" @finished-editing-element="$emit('finished-editing-element')" :class="locals.classType + ' element'" :style="settings.styles" ref="imageVariable">
			<img class="image" draggable="false" :src="variable.context" alt="Image" />
			<Resizers :query="`variable-${this.settings.id}`" />
		</div>

	</div>
</template>

<script>
	export default {
		name: "Variable",
		props: {
			options: Object,
			variable: Object,
		},
		emits:['clickedOnElement', 'finished-editing-element'],
		mounted() {
			if (this.settings.grandParent === "TemplateBuilder" && (this.$refs.textVariable || this.$refs.imageVariable)) { // Initialize on moutned if its the template builder mode
				this.Initialize(this.$refs.imageVariable, `${this.locals.classType}-${this.settings.id}`, this.settings)
				this.Initialize(this.$refs.textVariable, `${this.locals.classType}-${this.settings.id}`, this.settings)
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
					classType: "variable",
				},
				settings: {
					grandParent: 'TemplateBuilder',
					id: 0,
					configs: {
						uniqueId: '',
					},
					styles: {},
				},
			}
		},
	};
</script>

<style>
</style>
