<template>
	<div>
		<!-- Template Builder -->
		<div v-if="settings.grandParent === 'TemplateBuilder'" :id="settings.id" ref="element" @click="$emit('clickedOnElement')" @finishededitingelement="$emit('finishededitingelement')" :class="locals.classType + ' element'" :style="settings.styles">
			<div class="name">
				<span>{{displaySet.title}} <img src="@/assets/images/repeat.png" :alt="$t('template-builder.elements.repeator')" width="20" height="20" /></span>
			</div>
			<div style="display: flex">
				<component v-for="element in settings.configs.appendedElements[settings.configs.selectedDataSet]" @finishededitingelement="$emit('finishededitingelement')" :key="element.options.id" :is="element.type" :options="prepareElementsOptions(element.options, element.type, null)" @click.stop="$emit('clickedOnElement', element)" />
			</div>
			<Resizers :query="`repeator-${settings.id}`" />
		</div>

		<!-- Print Preview -->
		<div v-else :id="settings.id" ref="element" @click="$emit('clickedOnElement')" @finishededitingelement="$emit('finishededitingelement')" :class="locals.classType + ' element'" :style="computedStyles">
			<div v-for="(row, index) in displaySet.rows" :key="row" :style="settings.styles">
				<div class="name">
					<span>{{displaySet.title}} <img src="@/assets/images/repeat.png" :alt="$t('template-builder.elements.repeator')" width="20" height="20" /></span>
				</div>
				<div style="display: flex">
					<component v-for="element in settings.configs.appendedElements[settings.configs.selectedDataSet]" @finishededitingelement="$emit('finishededitingelement')" :key="element.options.id" :is="element.type" :options="prepareElementsOptions(element.options, element.type, index)" @click.stop="$emit('clickedOnElement', element)" />
				</div>
				<Resizers :query="`repeator-${settings.id}`" />
			</div>
		</div>
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
			bindingobject: BindingObject,
			textpattern: TextPattern,
			variable: Variable,
			dataset: DataSet,
		},
		name: "Repeator",
		props: {
			options: Object,
		},
		computed: {
			computedStyles() {
				var height = this.displaySet.rows.length * this.toFloatVal(this.settings.styles.height)
				var width = this.displaySet.rows.length * this.toFloatVal(this.settings.styles.width)
				return {
					height: height + 'px',
					width: width + 'px',
					top: this.settings.styles.top,
					left: this.settings.styles.left
				}
			},
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
					this.settings = this.merge(this.settings, val)
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
						appenedElements: {},
					},
					styles: {},
				},
			}
		},
		methods: {
			/**
			 * Convert string val to float.
			 * @param {String} val - val.
			 * @return {Number} parsed val
			 */
			toFloatVal(val) {
				if (!val)
					return 0
				return parseFloat(val.split('p')[0])
			},
			/**
			 * Prepare elements options.
			 * @param {Object} options - preview settings
			 * @return {Object} - computed options
			 */
			prepareElementsOptions(options, type, index) {
				let opt = JSON.parse(JSON.stringify(options)) // Storing the options in opt
				opt.grandParent = this.settings.grandParent

				switch (type) {

					case 'bindingobject':
						let key = opt.configs.field
						var bindingObject = opt.configs.bindingObject

						if (bindingObject[key]) {

							if (Array.isArray(bindingObject[key]))
								opt.configs.value = bindingObject[key][index]

							else
								opt.configs.value = bindingObject[key]

						}
						else
							opt.configs.value = ''

						break

					default:
						break
				}

				return opt
			},
			/**
			* Initializing the element utilities for the created element
			*/
			Initialize(element = this.$refs.element) {
				let elem = new ElementClass(element, `repeator-${this.settings.id}`, this.settings)
				elem.clickable()
				elem.resizable()
				elem.dragable()
			},
		},
	}
</script>

<style>
</style>