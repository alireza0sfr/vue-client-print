<template>
	<!-- Template Builder -->
	<div v-if="element.grandParent === locals.ElementGrandParents.TEMPLATEBUILDER" :id="element.id" ref="element" @click="$emit('clickedOnElement', element)"
		@finished-editing-element="$emit('finished-editing-element')" :class="element.type + ' element'" :style="element.styles" tabindex="-1">
		<div class="repeator-name">
			<span>{{displaySet.configs.title}} <img src="@/assets/images/repeat.png" :alt="_$t('template-builder.elements.repeator')" width="20" height="20" /></span>
		</div>
		<div style="display: flex; position: relative;">
			<component v-for="appendedElement in element.configs.appendedElements" tabindex="-1" @finished-editing-element="$emit('finished-editing-element')" :key="appendedElement.id"
				:is="appendedElement.type" :instance="appendedElement" @clickedOnElement="(element) => $emit('clickedOnElement', element)" @click.stop="$emit('clickedOnElement', appendedElement)" />
		</div>
		<Resizers :query="`${element.type}-${element.id}`" />
	</div>

	<!-- Print Preview -->
	<div v-else :style="{height: computedContainerHeight + 'px'}">
		<div v-for="(row, index) in displaySet.configs.rows" :id="element.id" :style="element.styles" :key="row">
			<component v-for="appendedElement in element.configs.appendedElements" :key="appendedElement.id" :is="appendedElement.type" :instance="prepareElementInstance(appendedElement, index)" />
		</div>
	</div>
</template>

<script lang="ts">
	import { ElementGrandParents, ElementTypes } from '~/enums/element'
	import { IDataSetLikeElement, IElement } from '~/interfaces/elements'
	import { isEmpty, toFloatVal } from '~/plugins/general-utilities'
	import { defineComponent } from 'vue'
	import { DataSetLikeElement, emptyDataSet, prepareElementInstance } from '@/plugins/element-utilities'
	import { IDatasets } from '@/interfaces/datasets'
	export default defineComponent({
		name: ElementTypes.REPEATOR,
		props: {
			instance: Object as () => IDataSetLikeElement,
		},
		emits: ['clickedOnElement', 'finished-editing-element'],
		computed: {
			computedContainerHeight() {
				var result
				result = toFloatVal(this.element.styles.height)
				result -= 24
				result *= this.displaySet.configs.rows.length
				return result
			},
			displaySet() {

				let dataSets = this.element.configs.dataSets

				if (!dataSets)
					return emptyDataSet

				this.element.configs.dataSets = dataSets
				var displaySet = dataSets![this.element.configs.selectedDataSet]

				if (isEmpty(displaySet))
					return emptyDataSet

				return displaySet
			},
		},
		created() {
			if (isEmpty(this.element.configs.dataSets))
				this.element.configs.dataSets = this.element.computeDatasets(this.element.configs.printSettings) || {}
		},
		mounted() {
			if (this.element.grandParent === ElementGrandParents.TEMPLATEBUILDER)
				this.element.init(this.$refs.element as HTMLElement, `${this.element.type}-${this.element.id}`)
		},
		watch: {
			instance: {
				immediate: true,
				handler(val) {
					this.element = val.merge(this.element)
				},
			},
			'element.configs.selectedDataSet': {
				immediate: true,
				handler(val) {
					if (val && this.element.grandParent === ElementGrandParents.TEMPLATEBUILDER) {

						var dataSetElements = this.element.configs.appendedElements.filter((x: IElement) => x instanceof DataSetLikeElement && x.type === ElementTypes.DATASET)

						for (var element of dataSetElements)
							if (element.configs.selectedDataSet.includes('-')) // if has refrence to parent selected dataset
								element.configs.selectedDataSet = ''
					}
				}
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
			prepareElementInstance(appendedElement: IElement, index: number): IElement {
				var extra = {
					index: index,
					settings: this.element.configs.printSettings, // print settings stored in repeator
					repeatorInstance: this.element
				}

				return prepareElementInstance(appendedElement, extra)
			}
		},
	})
</script>