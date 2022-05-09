<template>
	<div :id="settings.id" ref="element" @click="$emit('clickedOnElement')" @finishededitingelement="$emit('finishededitingelement')" :class="locals.classType + ' element'" :style="settings.styles">
		{{ computedValue }}
		<Resizers :query="`datetime-${settings.id}`" />
	</div>
</template>

<script>
	import ElementClass from '~/plugins/element-utilities.js'
	import Resizers from '~/components/elements/Resizers.vue'
	export default {
		components: {
			Resizers,
		},
		name: "DateTime",
		props: {
			options: {
				type: Object,
			},
		},
		mounted() {
			if (this.settings.grandParent === "TemplateBuilder") // Initialize on moutned if its the template builder mode
				this.Initialize()
		},
		computed: {
			computedValue() {

				if (this.settings.configs.hasDate && this.settings.configs.hasTime)
					return this.dateToday + ' ' + this.timeToday

				else if (this.settings.configs.hasDate && !this.settings.configs.hasTime)
					return this.dateToday

				else if (this.settings.configs.hasTime && !this.settings.configs.hasDate)
					return this.timeToday

				else
					return ''
			}
		},
		watch: {
			options: {
				immediate: true,
				deep: true,
				handler(val) {
					this.settings = this.merge(this.settings, val)
					
					if (this.settings.configs.persianDate)
						this.persianDate()
					else
						this.gregorianDate()
				},
			},
		},
		data() {
			return {
				dateToday: "",
				timeToday: "",
				locals: {
					classType: "datetime",
				},
				settings: {
					grandParent: 'TemplateBuilder',
					id: 0,
					configs: {
						hasDate: true,
						hasTime: true,
						persianDate: true,
					},
					styles: {}
				},
			}
		},
		methods: {

			/**
			 * Initializing the element utilities for the created element
			 */

			Initialize(element = this.$refs.element) {
				let elem = new ElementClass(element, `datetime-${this.settings.id}`, this.settings)
				elem.clickable()
				elem.resizable()
				elem.dragable()
			},

			/** 
			 * Returns the date in solar date 
			 */

			persianDate() {
				let today = new Date().toLocaleDateString("fa-IR")
				this.dateToday = today
				this.timeToday = this.toPersianDigits(this.timeNow())
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

				this.dateToday = yyyy + "/" + dd + "/" + mm
				this.timeToday = this.timeNow()
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
	};
</script>

<style>
</style>