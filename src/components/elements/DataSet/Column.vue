<template>
	<div :id="element.id" ref="element" :class="element.type + ' element label'" :style="element.styles" tabindex="-1">
		<span>{{element.configs.title}}</span>
		<Resizers v-if="element.configs.hasResizer" :query="`${element.type}-${element.id}`" :resizers="['right']" />
	</div>
</template>

<script lang="ts">
	import { ElementGrandParents, ElementTypes } from '~/enums/element'
	import { IElement } from '~/interfaces/elements'
	import { defineComponent } from 'vue'
	export default defineComponent({
		name: ElementTypes.COLUMN,
		props: {
			instance: Object as () => IElement,
		},
		emits: ['width-changed'],
		mounted() {
			if (this.element.grandParent === ElementGrandParents.TEMPLATEBUILDER)
				this.initialize()
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
					styles: {
						position: 'relative',
						resize: 'none'
					},
				} as IElement,
			}
		},
		methods: {
			/**
			* Initializing the element utilities for the created element
			*/
			initialize() {
				var $el: HTMLElement = this.$refs.element as HTMLElement
				var resizerQuery: string = `${this.element.type}-${this.element.id}`
				this.element.makeClickable($el)
				this.resizable($el, resizerQuery)
			},

			/**
			 * Column Private resiable
			 * @emits {width-changed} call width-changed event and passes startWidth, newWidth, colId.
			 */
			resizable(element: HTMLElement, resizerQuery: string): void {

				const resizers: any = document.querySelectorAll(`.elem-resizer.${resizerQuery}`)

				for (let resizer of resizers) {
					resizer.onmousedown = (e: any) => initDrag(e, resizer)
				}

				var startX: number, startWidth: number
				const initDrag = (e: any, resizer: HTMLElement) => {
					if (e.target.className.includes('elem-resizer')) { // If Clicking on the resizer
						startX = e.clientX
						startWidth = parseInt(document.defaultView!.getComputedStyle(element).width, 10)
						document.onmousemove = (e) => doDrag(e, resizer)
						document.onmouseup = stopDrag
					}
				}
				const doDrag = (e: any, resizer: HTMLElement) => {
					if (resizer.className.includes('right')) {
						var newWidth = startWidth + e.clientX - startX
						this.$emit('width-changed', newWidth, this.element.id)
					}
				}

				const stopDrag = (e: any) => {
					document.onmousemove = null
					document.onmouseup = null
				}
			}
		},
	})
</script>

<style>
</style>