<template>
	<div :id="element.id" :data-testid="element.id" ref="element" @click="$emit('clickedOnElement', element)" @finished-editing-element="$emit('finished-editing-element')"
		:class="element.type + ' element content-wrapper'" :style="element.styles" tabindex="-1">
		<span class="content">
			{{ computedValue }}
		</span>
		<Resizers :query="`${element.type}-${element.id}`" />
	</div>
</template>

<script lang="ts">
	import { toPersianDigits } from '~/plugins/general-utilities'
	import { IElement } from '~/interfaces/elements'
	import { ElementGrandParents, ElementTypes } from '~/enums/element'
	import { defineComponent } from 'vue'
	export default defineComponent({
		name: ElementTypes.DATETIME,
		props: {
			instance: Object as () => IElement,
		},
		emits: ['clickedOnElement', 'finished-editing-element'],
		mounted() {
			if (this.element.grandParent === ElementGrandParents.TEMPLATEBUILDER)
				this.element.init(this.$refs.element as HTMLElement, `${this.element.type}-${this.element.id}`)
		},
		computed: {
			computedValue() {

				if (this.element.configs.persianDate)
					this.persianDate()
				else
					this.gregorianDate()

				if (this.element.configs.hasDate && this.element.configs.hasTime)
					return this.locals.dateToday + ' ' + this.locals.timeToday

				else if (this.element.configs.hasDate && !this.element.configs.hasTime)
					return this.locals.dateToday

				else if (this.element.configs.hasTime && !this.element.configs.hasDate)
					return this.locals.timeToday

				else
					return ''
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
				locals: {
					dateToday: "",
					timeToday: "",
				},
				element: {
					configs: {
						hasDate: true,
						hasTime: true,
						persianDate: true,
					},
					styles: {
						width: '150px'
					}
				} as IElement,
			}
		},
		methods: {
			/** 
			 * Returns the date in solar date 
			 */

			persianDate() {
				let today = new Date().toLocaleDateString("fa-IR")
				this.locals.dateToday = today
				this.locals.timeToday = toPersianDigits(this.timeNow())
			},

			/**
			 * Returns the date in gregorian format.
			 * @return {Date} - gregorian Date
			 */
			gregorianDate() {
				var today = new Date()
				var dd = String(today.getDate()).padStart(2, "0")
				var mm = String(today.getMonth() + 1).padStart(2, "0") //January is 0!
				var yyyy = today.getFullYear()

				this.locals.dateToday = yyyy + "/" + dd + "/" + mm
				this.locals.timeToday = this.timeNow()
			},

			/** 
			 * Returns the current time .
			 * @return {Date} - gregorian Date
			 */
			timeNow() {
				return (
					new Date().getHours() +
					":" +
					new Date().getMinutes() +
					":" +
					new Date().getSeconds()
				)
			},
		},
	})
</script>

<style>
</style>