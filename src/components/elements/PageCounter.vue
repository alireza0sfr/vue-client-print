<template>
	<div :id="element.id" :data-testid="element.id" ref="element" @click="$emit('clickedOnElement')" @finished-editing-element="$emit('finished-editing-element')" :class="element.type + ' element content-wrapper'" :style="element.styles">
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
	import { toPersianDigits, shallowMerge } from '~/plugins/general-utilities'
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
				if (this.element.grandParent === ElementGrandParents.TEMPLATEBUILDER) {
					if (this.element.configs.completeForm) {
						if (this.element.configs.persianNumbers) {
							return toPersianDigits('صفحه ۱ از ۱')
						}
						return 'page 1 / 1'
					}
					if (this.element.configs.persianNumbers) {
						return toPersianDigits(this.element.configs.counter)
					}
				}
				return this.element.configs.counter
			}
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
				element: {
					configs: {
						counter: '1',
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