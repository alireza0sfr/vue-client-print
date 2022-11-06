<template>
	<div :id="element.id" ref="element" @click="$emit('clickedOnElement')" @finished-editing-element="$emit('finished-editing-element')" :class="element.type + ' element'" :style="element.styles">

		<!-- Template Builder -->
		<div v-if="element.grandParent === locals.ElementGrandParents.TEMPLATEBUILDER">
			<div class="repeator-name">
				<span>{{displaySet.configs.title}} <img src="@/assets/images/repeat.png" :alt="_$t('template-builder.elements.repeator')" width="20" height="20" /></span>
			</div>
			<div style="display: flex; position: relative;">
				<component v-for="element in element.configs.appendedElements" @finished-editing-element="$emit('finished-editing-element')" :key="element.id" :is="element.type" :instance="element"
					@clickedOnElement="(child) => $emit('clickedOnElement', child ? child : element)" @click.stop="$emit('clickedOnElement', element)" />
			</div>
			<Resizers :query="`${element.type}-${element.id}`" />
		</div>

		<!-- Print Preview -->
		<div v-else>
			<div v-for="(row, index) in displaySet.configs.rows" :key="row" :style="computedStyles">
				<div style="display: flex; position: absolute;">
					<component v-for="element in element.configs.appendedElements" :key="element.id" :is="element.type"
						:options="prepareComponentsOptions(element, element.type, index, bindingObjectCallback)" />
				</div>
				<Resizers :query="`${element.type}-${element.id}`" />
			</div>
		</div>

	</div>
</template>

<script lang="ts">
	import { ElementGrandParents, ElementTypes } from '~/enums/element'
	import { IBindingObject, IDataSetLikeElement, IElement } from '~/interfaces/elements'
	import { isEmpty, shallowMerge } from '~/plugins/general-utilities'
	import { defineComponent } from 'vue'
	import { emptyDataSet } from '@/plugins/element-utilities'
	import { IDatasets } from '@/interfaces/datasets'
	export default defineComponent({
		name: ElementTypes.REPEATOR,
		props: {
			instance: Object as () => IDataSetLikeElement,
		},
		emits: ['clickedOnElement', 'finished-editing-element'],
		computed: {
			computedStyles() {
				return { height: this.element.configs.originalHeight }
			},
			displaySet() {

				let dataSets: IDatasets | null = this.element.computeDatasets()

				if (!dataSets)
					return emptyDataSet

				this.element.configs.dataSets = dataSets
				var displaySet = dataSets![this.element.configs.selectedDataSet]

				if (isEmpty(displaySet))
					return emptyDataSet

				return displaySet
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
					this.element = shallowMerge(val, this.element)
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
						appendedElements: [],
						originalHeight: '0'
					},
					styles: {
						width: '600px',
						height: '60px'
					}
				} as IDataSetLikeElement,
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