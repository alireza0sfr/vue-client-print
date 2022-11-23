<template>
	<div class="__VCP__" id="VCP">
		<TemplateBuilder v-if="locals.appState === locals.AppStates.TEMPLATEBUILDER" ref="TemplateBuilder" :options="settings" />
		<PrintPreview v-else-if="locals.appState === locals.AppStates.PRINTPREVIEW" ref="printPreview" :options="settings">
			<template #printDataChild>
				<slot name="printData" class="printData"></slot>
			</template>
		</PrintPreview>
	</div>
</template>

<script lang="ts">
	import { getDefaultSettings, merge, prepareSettings } from '~/plugins/general-utilities'
	import { IConfigs, ISettings } from '~/interfaces/general'
	import { defineComponent } from 'vue'
	import { IBindingObject } from '~/interfaces/elements'
	import { prepareDataSets } from '~/plugins/element-utilities'
	import { AppStates } from '~/enums/general'
	import DefaultLogo from '@/assets/images/logo.png'

	import { useVariablesStore } from '~/stores/variables'
	import { useGeneralStore } from '~/stores/general'
	import { useBindingObjectStore } from '~/stores/binding-object'
	import { useDataSetStore } from '~/stores/dataset'

	const variablesStore = useVariablesStore()
	const generalStore = useGeneralStore()
	const bindingObjectStore = useBindingObjectStore()
	const dataSetStore = useDataSetStore()

	export default defineComponent({
		name: 'VueClientPrint',
		props: {
			bindingObject: Object as () => IBindingObject,
			dataSets: { type: Object, default: () => ({}) },
			variables: { type: Array },
			configurations: { type: Object },
			options: Object as () => ISettings
		},
		watch: {
			bindingObject: {
				immediate: true,
				handler(val) {
					bindingObjectStore.update(val)
				}
			},
			configurations: {
				immediate: true,
				handler(val) {
					this.configs = merge(this.configs, val)
					generalStore.updateByKey('configurations', this.configs)

					// @ts-ignore
					this._$i18n.locale = this.configs.language
				}
			},
			options: {
				immediate: true,
				handler(val) {
					// should be after configurations watch
					this.settings = prepareSettings(this.settings, val)
				},
			},
			dataSets: {
				immediate: true,
				handler(val) {
					dataSetStore.update(prepareDataSets(val))
				},
			},
			variables: {
				immediate: true,
				handler(val) {
					variablesStore.updateVariables(val)
				},
			},
		},
		data() {
			return {
				locals: {
					appState: AppStates.EMPTY,
					AppStates: AppStates,
				},
				settings: getDefaultSettings(),
				configs: {
					maximumFileSize: 1000, // Maximum file size in KB
					language: 'en',
					imageSrc: DefaultLogo,
					direction: 'rtl'
				} as IConfigs,
			}
		},
		methods: {
			/**
			 * By Triggering this func template builder modal will be displayed.
			 * @param {object} json - settings json
			 * @param {Function} callback - callback function
			 * @return {void} - void
			 */
			displayTemplateBuilder(json: ISettings, callback: (val: ISettings) => void): void {
				this.locals.appState = AppStates.TEMPLATEBUILDER

				this.$nextTick(() => {
					json.callback = callback
					const TB: any = this.$refs.TemplateBuilder
					this.settings = json
					TB.settingsInitFunc()
					TB.showModal()
				})
			},
			displayPrintPreview(json: ISettings): void {
				this.locals.appState = AppStates.PRINTPREVIEW

				this.$nextTick(() => {
					this.settings = prepareSettings(this.settings, json)
					const PP: any = this.$refs.printPreview
					PP.showModal()
				})
			},
		}
	})
</script>

<style lang="less">
	@import "~/styles/vcp";
</style>
