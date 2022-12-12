<template>
	<div @vcp-error="vcpError" class="__VCP__" id="VCP">
		<TemplateBuilder v-if="locals.appState === locals.AppStates.TEMPLATEBUILDER" ref="TemplateBuilder" :options="settings" />
		<PrintPreview v-else-if="locals.appState === locals.AppStates.PRINTPREVIEW" ref="printPreview" :options="settings" @print-success="$emit('print-success')" @print-error="$emit('print-error')" @preview-success="$emit('preview-success')" @preview-failed="$emit('preview-failed')">
			<template #printDataChild>
				<slot name="printData" class="printData"></slot>
			</template>
		</PrintPreview>
	</div>
</template>

<script lang="ts">
	import { getDefaultSettings, isEmpty, merge, prepareSettings, validateDesign } from '~/plugins/general-utilities'
	import { IConfigs, ISettings } from '~/interfaces/general'
	import { defineComponent } from 'vue'
	import { IBindingObject, IVariable } from '~/interfaces/elements'
	import { prepareDataSets, createElementInstanceFromObject } from '~/plugins/element-utilities'
	import { AppStates, TemplateBuilderSections } from '~/enums/general'
	import Logger from '~/plugins/logger'
	import DefaultLogo from '@/assets/images/logo.png'

	import { useVariablesStore } from '~/stores/variables'
	import { useGeneralStore } from '~/stores/general'
	import { useBindingObjectStore } from '~/stores/binding-object'
	import { useDataSetStore } from '~/stores/dataset'
	import { cloneDeep } from 'lodash'

	const variablesStore = useVariablesStore()
	const generalStore = useGeneralStore()
	const bindingObjectStore = useBindingObjectStore()
	const dataSetStore = useDataSetStore()

	export default defineComponent({
		emits: ['vcp-error', 'print-success', 'print-error', 'preview-success', 'preview-failed'],
		name: 'VueClientPrint',
		props: {
			bindingObject: Object as () => IBindingObject,
			dataSets: { type: Object, default: () => ({}) },
			variables: { type: Array },
			configurations: { type: Object },
		},
		watch: {
			bindingObject: {
				immediate: true,
				handler(val) {
					var cloned = cloneDeep(val)
					bindingObjectStore.update(cloned)
				}
			},
			configurations: {
				immediate: true,
				handler(val) {
					this.configs = merge(this.configs, val)

					this.configs.header.styles = 'position:absolute;' + this.configs.header.styles

					generalStore.updateByKey('configurations', this.configs)

					// @ts-ignore
					this._$i18n.locale = this.configs.language
				}
			},
			dataSets: {
				immediate: true,
				handler(val) {
					var cloned = cloneDeep(val)
					dataSetStore.update(prepareDataSets(cloned))
				},
			},
			variables: {
				immediate: true,
				handler(val) {
					var cloned = cloneDeep(val)
					variablesStore.updateVariables(cloned)
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
					direction: 'rtl',
					useAlert: true,
					header: {
						context: '',
						styles: 'font-size: 12px',
					},
				} as IConfigs,
			}
		},
		methods: {
			vcpError(e: any): void {
				this.$emit('vcp-error', e.detail.error)
			},
			/**
			 * By Triggering this func template builder modal will be displayed.
			 * @param {Function} callback - callback function
			 * @return {void} - void
			 */
			displayTemplateBuilder(design: ISettings, callback: (val: ISettings) => void): void {
				this.prepareDesign(design)
				this.settings.callback = callback
				this.locals.appState = AppStates.TEMPLATEBUILDER

				this.$nextTick(() => {
					const TB: any = this.$refs.TemplateBuilder
					TB.settingsInitFunc()
					TB.showModal()
				})
			},
			displayPrintPreview(design: ISettings): void {

				this.prepareDesign(design)

				if (!validateDesign(this.settings)) {
					var text = this._$t('validators.json-is-not-validated')
					Logger.alert(text, Logger.levels.ERROR)
					return
				}


				this.locals.appState = AppStates.PRINTPREVIEW
				this.$nextTick(() => {
					const PP: any = this.$refs.printPreview
					PP.showModal()
				})
			},
			fetchVariablesList(): IVariable[] {
				return variablesStore.all
			},
			prepareDesign(design: ISettings): void {
				// creating instance of Element class for stringified elements
				var cloned = cloneDeep(design)
				if (!isEmpty(cloned)) {

					for (var section of Object.values(TemplateBuilderSections)) {

						for (let index = 0; index < cloned[section].elements.length; index++) {
							var elem = cloned[section].elements[index]

							if (elem instanceof Element === false)
								cloned[section].elements[index] = createElementInstanceFromObject(elem)
						}
					}
				}


				this.settings = prepareSettings(cloned)
			},
		}
	})
</script>

<style lang="less">
	@import "~/styles/vcp";
</style>
