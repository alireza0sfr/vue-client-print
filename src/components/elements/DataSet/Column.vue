<template>
	<div :id="settings.id" ref="element" :class="locals.classType + settings.class + ' element label'" :style="settings.styles">
		<span>{{settings.configs.title}}</span>
		<Resizers v-if="settings.hasResizer" :query="`column-${settings.id}`" :resizers="['right']"/>
	</div>
</template>

<script>
	import ElementClass from '~/plugins/element-utilities.ts'
	export default {
		name: "Column",
		props: {
			options: Object,
		},
		mounted() {
			if (this.settings.grandParent === "TemplateBuilder") { // Initialize on moutned if its the template builder mode
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
					classType: "column",
				},
				settings: {
					grandParent: 'TemplateBuilder',
					class: '',
					hasResizer: true,
					isActive: true,
					id: 0,
					configs: {
						title: 'Column'
					},
					styles: {},
				},
			}
		},
		methods: {
			/**
			* Initializing the element utilities for the created element
			*/
			Initialize() {
				let elem = new ElementClass(this.$refs.element, `column-${this.settings.id}`, this.settings)
				elem.clickable()
				this.resizable()
			},

			/**
			 * Column Private resiable
			 * @emits {width-changed} call width-changed event and passes startWidth, newWidth, colId.
			 */
			resizable() {
				var element = this.$refs.element
				const resizers = document.querySelectorAll(`.elem-resizer.column-${this.settings.id}`)

				for (let resizer of resizers) {
					resizer.onmousedown = (e) => initDrag(e, resizer)
				}

				var startX, startWidth, that = this
				function initDrag(e, resizer) {
					if (e.target.className.includes('elem-resizer')) { // If Clicking on the resizer
						startX = e.clientX
						startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10)
						document.onmousemove = (e) => doDrag(e, resizer)
						document.onmouseup = stopDrag
					}
				}
				function doDrag(e, resizer) {
					if (resizer.className.includes('right')) {
						var newWidth = startWidth + e.clientX - startX
						that.$emit('width-changed', newWidth, that.settings.id)
					}
				}

				function stopDrag(e) {
					document.onmousemove = null
					document.onmouseup = null
				}
			}
		},
	}
</script>

<style>
</style>