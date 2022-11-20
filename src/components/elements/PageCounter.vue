<template>
	<div :id="element.id" :data-testid="element.id" ref="element" @click="$emit('clickedOnElement', element)" @finished-editing-element="$emit('finished-editing-element')"
		:class="element.type + ' element content-wrapper'" :style="element.styles" tabindex="-1">
		<span class="content">
			{{ computedCounter }}
		</span>
		<Resizers :query="`${element.type}-${element.id}`" />
	</div>
</template>

<script lang="ts">
	import { ElementGrandParents, ElementTypes } from '~/enums/element'
	import { IElement } from '~/interfaces/elements'
	import { defineComponent } from 'vue'
	import { toPersianDigits } from '~/plugins/general-utilities'
	export default defineComponent({
		name: ElementTypes.PAGECOUNTER,
		props: {
			instance: Object as () => IElement,
		},
		emits: ['clickedOnElement', 'finished-editing-element'],
		mounted() {
			if (this.element.grandParent === ElementGrandParents.TEMPLATEBUILDER)
				this.element.init(this.$refs.element as HTMLElement, `${this.element.type}-${this.element.id}`)
		},
		computed: {
			computedCounter() {

				var currentPage = this.element.configs.currentPage
				var totalPages = this.element.configs.totalPages
				var result = currentPage

				if (this.element.configs.completeForm)
					result = this._$t('template-builder.pagecounter', { currentPage, totalPages })

				if (this.element.configs.persianNumbers)
					result = toPersianDigits(result)

				return result
			}
		},
		watch: {
			instance: {
				immediate: true,
				handler(val) {
					this.element = val.merge(this.element)
				},
			},
		},
		data() {
			return {
				element: {
					configs: {
						currentPage: 1,
						totalPages: 1,
						persianNumbers: false,
						completeForm: true,
					},
					styles: {},
				} as IElement,
			}
		},
	})
</script>

<style>
</style>