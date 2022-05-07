<template>
	<div :id="settings.id" ref="element" @click="$emit('clickedOnElement')" @finishededitingelement="$emit('finishedEditingElement')" :class="locals.classType + ' element'" :style="settings.styles">
		<div v-if="settings.grandParent === 'TemplateBuilder'" class="name">
			<span>{{displaySet.title}} <img src="@/assets/images/repeat.png" :alt="$t('template-builder.elements.repeator')" width="20" height="20" /></span>
		</div>
		<div style="display: flex">
			<component v-for="element in settings.configs.appendedElements" :key="element.options.id" :is="element.type" :options="element.options" @click.stop="$emit('clickedOnElement', element)" />
		</div>
		<Resizers :query="`repeator-${settings.id}`" />
	</div>
</template>

<script>
	import ElementClass from '~/plugins/element-utilities.js'
	import Resizers from '~/components/elements/Resizers.vue'
	import Variable from '~/components/elements/Variable.vue'
	import TextElement from '~/components/elements/TextElement.vue'
	import DateTime from '~/components/elements/DateTime.vue'
	import BindingObject from '~/components/elements/BindingObject.vue'
	import PageCounter from '~/components/elements/PageCounter.vue'
	import ImageElement from '~/components/elements/ImageElement.vue'
	import TextPattern from '~/components/elements/TextPattern.vue'
	import DataSet from '~/components/elements/DataSet/DataSet.vue'
	export default {
		components: {
			Resizers,
			textelement: TextElement,
			datetime: DateTime,
			pagecounter: PageCounter,
			imageelement: ImageElement,
			bindingObject: BindingObject,
			textpattern: TextPattern,
			variable: Variable,
			dataset: DataSet,
		},
		name: "Repeator",
		props: {
			options: Object,
		},
		computed: {
			displaySet() {
				return this.settings.configs.dataSets[this.settings.configs.selectedDataSet]
			},
		},
		mounted() {
			if (this.settings.grandParent === 'TemplateBuilder') { // Initialize on moutned if its the template builder mode
				this.Initialize()
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
					classType: "repeator",
				},
				settings: {
					grandParent: 'TemplateBuilder',
					id: 0,
					configs: {
						datasets: [],
						selectedDataSet: '',
						appenedElements: []
					},
					styles: {},
				},
			}
		},
		methods: {
			/**
			* Initializing the element utilities for the created element
			*/
			Initialize(element = this.$refs.element) {
				let elem = new ElementClass(element, `repeator-${this.settings.id}`)
				elem.clickable()
				elem.resizable()
				elem.dragable()
			},
		},
	}
</script>

<style>
</style>