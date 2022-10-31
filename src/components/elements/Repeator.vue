<template>
	<div :id="element.id" ref="element" @click="$emit('clickedOnElement')" @finished-editing-element="$emit('finished-editing-element')" :class="element.type + ' element'" :style="element.styles">

		<!-- Template Builder -->
		<div v-if="element.grandParent === ElementGrandParents.TEMPLATEBUILDER">
			<div class="repeator-name">
				<span>{{displaySet.configs.title}} <img src="@/assets/images/repeat.png" :alt="_$t('template-builder.elements.repeator')" width="20" height="20" /></span>
			</div>
			<div style="display: flex; position: absolute;">
				<component v-for="element in element.configs.appendedElements[element.configs.selectedDataSet]" @finished-editing-element="$emit('finished-editing-element')" :key="element.id" :is="element.type" :options="element" @clickedOnElement="(child) => $emit('clickedOnElement', child ? child : element)" @click.stop="$emit('clickedOnElement', element)" :variable="element.type === 'variable'? element.configs.variables.find(x =>x.uniqueId === element.configs.uniqueId): {}" />
				<!-- <component v-for="element in element.configs.appendedElements[element.configs.selectedDataSet]" @finished-editing-element="$emit('finished-editing-element')" :key="element.id" :is="element.type" :options="prepareComponentsOptions(element, element.type, null)" @clickedOnElement="(child) => $emit('clickedOnElement', child ? child : element)" @click.stop="$emit('clickedOnElement', element)" :variable="element.type === 'variable'? element.configs.variables.find(x =>x.uniqueId === element.configs.uniqueId): {}" /> -->
			</div>
			<Resizers :query="`${element.type}-${element.id}`" />
		</div>

		<!-- Print Preview -->
		<div v-else>
			<div v-for="(row, index) in displaySet.configs.rows" :key="row" :style="computedStyles">
				<div style="display: flex; position: absolute;">
					<component v-for="element in element.configs.appendedElements[element.configs.selectedDataSet]" :key="element.id" :is="element.type" :options="prepareComponentsOptions(element, element.type, index, bindingObjectCallback)" :variable="element.type === 'variable'? element.configs.variables.find(x =>x.uniqueId === element.configs.uniqueId): {}" />
				</div>
				<Resizers :query="`${element.type}-${element.id}`" />
			</div>
		</div>

	</div>
</template>

<script lang="ts">
	import { ElementGrandParents, ElementTypes } from '~/enums/element'
	import { IBindingObject, IElement } from '~/interfaces/elements'
	import { merge } from '~/plugins/general-utilities'
	import { defineComponent } from 'vue'
	export default defineComponent({
		name: ElementTypes.REPEATOR,
		props: {
			instance: Object as () => IElement,
		},
		emits: ['clickedOnElement', 'finished-editing-element'],
		computed: {
			computedStyles() {
				return { height: this.element.configs.originalHeight }
			},
			displaySet() {
				return this.element.configs.dataSets[this.element.configs.selectedDataSet]
			},
		},
		mounted() {
			if (this.element.grandParent === ElementGrandParents.TEMPLATEBUILDER)
				this.element.init(this.$refs.element as HTMLElement, `${this.element.type}-${this.element.id}`)
		},
		watch: {
			instance: {
				immediate: true,
				handler(val) {
					this.element = merge(val, this.element)
				},
			},
		},
		data() {
			return {
				locals: {
					ElementGrandParents: ElementGrandParents
				},
				element: {
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
				} as IElement,
			}
		},
		methods: {

			/**
			 * Callback function for bindingobject case on preapreComponentsElements in mixins.
			 * @param {IElement} element - element instance
			 * @param {Object} bindingObject - BindingObject
			 * @param {String} key - Selected field from bindingObject
			 * @param {Number} index - Component rendring loop index
			 * @return {void} - void
			 */
			bindingObjectCallback(element: IElement, bindingObject: IBindingObject, key: string, index: number): void {
				if (bindingObject[key]) {

					if (Array.isArray(bindingObject[key]))
						element.configs.value = bindingObject[key][index]

					else
						element.configs.value = bindingObject[key]

				}
				else
					element.configs.value = ''
			},
		},
	})
</script>