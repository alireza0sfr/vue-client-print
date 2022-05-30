<template>
	<div :id="settings.id" :data-testid="settings.id" ref="element" @click="$emit('clickedOnElement')" @finished-editing-element="$emit('finished-editing-element')" :class="locals.classType + ' element content-wrapper'" :style="settings.styles">
		<span class="content">
			{{ computedValue }}
		</span>
		<Resizers :query="`datetime-${settings.id}`" />
	</div>
</template>

<script>
	export default {
		name: "DateTime",
		props: {
			options: {
				type: Object,
			},
		},
		mounted() {
			if (this.settings.grandParent === "TemplateBuilder") // Initialize on moutned if its the template builder mode
				this.Initialize(this.$refs.element, `${this.locals.classType}-${this.settings.id}`, this.settings)
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