<template>
	<div :id="settings.id" ref="element" @click="$emit('clickedOnElement')" @finished-editing-element="$emit('finished-editing-element')" :class="locals.classType + ' element'" :style="settings.styles">

		<!-- Template Builder -->
		<div v-if="settings.grandParent === 'TemplateBuilder'">
			<div class="repeator-name">
				<span>{{displaySet.configs.title}} <img src="@/assets/images/repeat.png" :alt="_$t('template-builder.elements.repeator')" width="20" height="20" /></span>
			</div>
			<div style="display: flex; position: absolute;">
				<component v-for="element in settings.configs.appendedElements[settings.configs.selectedDataSet]" @finished-editing-element="$emit('finished-editing-element')" :key="element.id" :is="element.type" :options="element" @clickedOnElement="(child) => $emit('clickedOnElement', child ? child : element)" @click.stop="$emit('clickedOnElement', element)" :variable="element.type === 'variable'? settings.configs.variables.find(x =>x.uniqueId === element.configs.uniqueId): {}" />
				<!-- <component v-for="element in settings.configs.appendedElements[settings.configs.selectedDataSet]" @finished-editing-element="$emit('finished-editing-element')" :key="element.id" :is="element.type" :options="prepareComponentsOptions(element, element.type, null)" @clickedOnElement="(child) => $emit('clickedOnElement', child ? child : element)" @click.stop="$emit('clickedOnElement', element)" :variable="element.type === 'variable'? settings.configs.variables.find(x =>x.uniqueId === element.configs.uniqueId): {}" /> -->
			</div>
			<Resizers :query="`repeator-${settings.id}`" />
		</div>

		<!-- Print Preview -->
		<div v-else>
			<div v-for="(row, index) in displaySet.configs.rows" :key="row" :style="computedStyles">
				<div style="display: flex; position: absolute;">
					<component v-for="element in settings.configs.appendedElements[settings.configs.selectedDataSet]" :key="element.id" :is="element.type" :options="prepareComponentsOptions(element, element.type, index, bindingObjectCallback)" :variable="element.type === 'variable'? settings.configs.variables.find(x =>x.uniqueId === element.configs.uniqueId): {}" />
				</div>
				<Resizers :query="`repeator-${settings.id}`" />
			</div>
		</div>

	</div>
</template>

<script>
import { initElementStyles, initializeGeneralElement } from '~/plugins/element-utilities'
	import { merge } from '~/plugins/general-utilities'
	export default {
		name: "Repeator",
		props: {
			options: Object,
		},
		emits:['clickedOnElement', 'finished-editing-element'],
		computed: {
			computedStyles() {
				return { height: this.settings.configs.originalHeight }
			},
			displaySet() {
				return this.settings.configs.dataSets[this.settings.configs.selectedDataSet]
			},
		},
		mounted() {
			if (this.settings.grandParent === 'TemplateBuilder') { // Initialize on moutned if its the template builder mode
				initializeGeneralElement(this.$refs.element, `${this.locals.classType}-${this.settings.id}`, this.settings)
			}
		},
		watch: {
			options: {
				immediate: true,
				deep: true,
				handler(val) {
					this.settings = merge(this.settings, val)
					this.settings.styles = initElementStyles(this.settings.styles)
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
						dataSets: {},
						selectedDataSet: '',
						appendedElements: {},
						originalHeight: '0'
					},
					styles: {
						width: '600px',
						height: '60px'
					}
				},
			}
		},
		methods: {

			/**
			 * Callback function for bindingobject case on preapreComponentsElements in mixins.
			 * @param {Object} options - Preview settings
			 * @param {Object} bindingObject - BindingObject
			 * @param {String} key - Selected field from bindingObject
			 * @param {Number} index - Component rendring loop index
			 * @return {void} - void
			 */
			bindingObjectCallback(opt, bindingObject, key, index) {
				if (bindingObject[key]) {

					if (Array.isArray(bindingObject[key]))
						opt.configs.value = bindingObject[key][index]

					else
						opt.configs.value = bindingObject[key]

				}
				else
					opt.configs.value = ''
			},
		},
	}
</script>

<style>
</style>