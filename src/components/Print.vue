<template>
	<div id="printPage">
		<TemplateBuilder ref="TemplateBuilder" :options="locals.templateBuilderData" :configurations="configs" />
		
		<!-- Preparing body to create canvas -->
		<div class="slotWrapper">
			<div :style="{width: settings.defaultWidthOfPaper + 'in',padding: '5px'}">
				<div id="toBeConverted">
					<div id="componentsParent">

						<div class="body-render-section" :style="{height: settings.beforeBody.height + 'in'}">
							<component v-for="(element, index) in settings.beforeBody.beforeBodyElements" :key="element.options.id" :is="element.type" :options="prepareComponentsOptions(element.options, element.type, index)" :variable="element.type === 'variable'? settings.variables.find(x => x.uniqueId === element.options.configs.uniqueId): {}" />
						</div>

						<div id="bodyComponents" v-if="settings.body && settings.body.bodyElements && settings.body.bodyElements.length" class="body-render-section" :style="{height: settings.body.height + 'in'}">
							<component v-for="(element, index) in settings.body.bodyElements" :key="element.options.id" :is="element.type" :options="prepareComponentsOptions(element.options, element.type, index)" :variable="element.type === 'variable'? settings.variables.find(x => x.uniqueId === element.options.configs.uniqueId): {}" />
						</div>

						<slot v-else class="printData" name="printData"></slot>

						<div class="body-render-section" :style="{height: settings.afterBody.height + 'in'}">
							<component v-for="(element, index) in settings.afterBody.afterBodyElements" :key="element.options.id" :is="element.type" :options="prepareComponentsOptions(element.options, element.type, index)" :variable="element.type === 'variable'? settings.variables.find(x => x.uniqueId === element.options.configs.uniqueId): {}" />
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Print Preview Modal-->
		<div id="printModal" class="print-modal">
			<div class="print-modal-content" :style="{ width: settings.defaultWidthOfPaper + 0.5 + 'in' }">
				<div :dir="settings.pageDirections" class=" print-modal-header">
					<div style="display: flex">
						<a @click="editWhileInPreview()" :title="$t('print.edit')" class="modal-icon" href="#">
							<img src="@/assets/images/edit.png" />
						</a>
						<a href="#" @click="printForm()" :title="$t('print.name')" class="modal-icon">
							<img src="@/assets/images/printer.png" />
						</a>
					</div>
					<div>
						<h3 class="title">{{$t('print.print-preview')}}</h3>
					</div>
					<div>
						<span id="printModalCloseBtn" class="close-btn">&times;</span>
					</div>
				</div>
				<div style="position: relative; min-height: 200px">
					<div style="padding-top: 10px; text-align: center">{{ $t('template-builder.page-count') }}: {{ locals.totalPages }}</div>

					<!-- Loading popup modal -->

					<div id="loadingModal" class="loading-modal animate-opacity">
						<div class="loading-modal-content">
							<div class="loading-modal-inner">
								<!-- Spinner -->

								<div class="sk-chase">
									<div class="sk-chase-dot"></div>
									<div class="sk-chase-dot"></div>
									<div class="sk-chase-dot"></div>
									<div class="sk-chase-dot"></div>
								</div>
								<p style="margin-top: 20px">{{ $t('print.proccessing') }}</p>
							</div>
						</div>
					</div>
					<div id="printForm">
						<div v-for="index in locals.totalPages" :key="index" class="mainLoop" :style="{height: settings.defaultHeightOfPaper + 'in',width: settings.defaultWidthOfPaper + 'in'}">
							<div :style="{width: 'auto', border: settings.pageBorder, margin: '5px'}">
								<div v-if="settings.header.isHeaderRepeatable || index === 1" :style="{height: locals.pageHeadersSizes[index - 1] + 'in'}" class="mainHeader">
									<component v-for="element in settings.header.headerElements" :key="element.options.id" :is="element.type" :options="prepareComponentsOptions(element.options, element.type, index)" :variable="element.type === 'variable'? settings.variables.find(x =>x.uniqueId === element.options.configs.uniqueId): {}" />
								</div>
							</div>
							<div class="converted" :style="{ height: locals.pageBodiesSizes[index - 1] + 'in' }"></div>
							<div v-if="settings.footer.isFooterRepeatable ||index === locals.totalPages" :style="{height: locals.pageFootersSizes[index - 1] + 'in'}" class="mainFooter">
								<component v-for="element in settings.footer.footerElements" :key="element.options.id" :is="element.type" :options="prepareComponentsOptions(element.options, element.type, index)" :variable="element.type === 'variable'? settings.variables.find(x => x.uniqueId === element.options.configs.uniqueId): {}" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	// @ts-ignore
	import { IVariable } from '~/interfaces/elements.ts'
	// @ts-ignore
	import { ISettings, IConfigs } from '~/interfaces/general.ts'
	import printJS from "print-js"
	import domtoimage from 'dom-to-image'
	import DefaultLogo from '@/assets/images/logo.png'
	export default {
		name: "Print",
		props: {
			options: { type: Object },
			bindingObject: { type: Object },
			dataSets: { type: Object },
			variables: { type: Array },
			configurations: { type: Object },
		},
		emits:['print-success', 'print-error', 'preview-success', 'preview-failed'],
		data() {
			return {
				locals: {
					totalPages: 0,
					templateBuilderData: {},
					pageBodiesSizes: [],
					pageFootersSizes: [],
					pageHeadersSizes: [],
				},
				settings: {
					header: {
						isHeaderRepeatable: true,
						height: 1,
						headerElements: [],
					},
					beforeBody: {
						height: 1,
						beforeBodyElements: [],
					},
					body: {
						bodyElements: []
					},
					afterBody: {
						height: 1,
						afterBodyElements: [],
					},
					footer: {
						isFooterRepeatable: true,
						height: 1,
						footerElements: [],
					},
					defaultHeightOfPaper: 11.7, // Standard Height of the chosen paper in inch
					defaultWidthOfPaper: 8.26, // Standard Width of the chosen paper in inch
					designName: '',
					orientation: 'portrait',
					pageSize: 'a4',
					pageDirections: 'rtl',
					dataSets: {},
					bindingObject: {},
					pageBorder: '0px',
				},
				configs: {
					maximumFileSize: 1000, // Maximum file size in KB
					language: 'en',
					imageSrc: DefaultLogo
				}
			}
		},
		mounted() {
			this.syncConfigs()
			this.syncLanguage()
			this.modalManager('printModal', 'printModalCloseBtn')
		},
		methods: {
			/**
			 * set body elements parent components height.
			 * @return {void} - void
			 */
			setTotalHieghtBasedOnElementsHeight(): void {
				const parent = document.getElementById('componentsParent')
				const body = document.getElementById('bodyComponents')
				var maxBottom = 0
				var elementWithMaxBottom
				// @ts-ignore
				for (let child of body.children) {
					if (child.getBoundingClientRect().bottom > maxBottom) {
						maxBottom = child.getBoundingClientRect().bottom
						elementWithMaxBottom = child
					}
				}
				var bodyHeight = elementWithMaxBottom.offsetTop + elementWithMaxBottom.getBoundingClientRect().height // body height in pixels
				this.settings.body.height = this.convert2Inches(bodyHeight) // body height in inches
				parent.style.height = this.settings.beforeBody.height + parseFloat(this.settings.body.height) + this.settings.afterBody.height + 'in'
			},

			/**
			 * print calculated output to pdf
			 * @return {void} - void
			 */
			printForm(): void {
				// @ts-ignore
				printJS({
					printable: 'printForm',
					type: 'html',
					scanStyles: false, // If true inline styles will be removed
					style: [
						".element {text-align: center;position: absolute;width: 100px;overflow: hidden;min-height: 20px;min-width: 20px;color: black;}.converted {text-align: center;flex-grow: 2;overflow: hidden;}.converted img {width: 8.26in;margin-top: 24px;margin-bottom: 24px;}.mainHeader {position: relative;overflow: hidden;}.mainFooter {position: relative;overflow: hidden;}.converted canvas {width: 100%;}",
					], // some custom styles needed for print
					onLoadingEnd: (res) => this.$emit('print-success', res),
					onError: (err) => this.$emit('print-error', err)
				})
			},

			/**
			 * sync the given configs with the defaults.
			 */
			syncConfigs(): void {
				this.merge(this.configs, this.configurations)
			},

			/**
			 * sync system language with given configs.
			 */
			syncLanguage(): void {
				this.$i18n.locale = this.configs.language
			},

			/**
			 * Removes all the previous children from the parent.
			 * @param {HTMLElement} parent - parent
			 * @return {void} - void
			 */
			removeAllChildNodes(parent: HTMLElement): void {
				while (parent.firstChild) {
					parent.removeChild(parent.firstChild)
				}
			},

			/**
			 * Calculate Dynamic sizes from template builder before print.
			 * @param {Number} totalPagesHeight - totalPagesHeight in inches
			 * @return {void} - void
			 */
			calculateSizes(totalPagesHeight: number): void {

				const errorValue = 0.01 // Subtractable value to make the pages height more accurate

				let pageHeadersSize = []
				let pageFootersSize = []
				let pageBodiesSize = []
				let remainingHeight = totalPagesHeight
				let currentTotalPages = 0
				let totalBodySize
				let headerHeight
				let footerHeight
				let defaultHeightOfPaper

				while (remainingHeight > 0) {

					defaultHeightOfPaper = this.settings.defaultHeightOfPaper

					if (this.settings.header.isHeaderRepeatable || pageHeadersSize.length === 0) // if the header is reapeatable or its the first page
						headerHeight = this.settings.header.height
					else
						headerHeight = 0

					let footerHeightLastPage = this.settings.footer.height
					let headerHeightLastPage = this.settings.header.isHeaderRepeatable ? headerHeight : 0
					let pageBodySize = defaultHeightOfPaper - footerHeightLastPage - headerHeightLastPage
					let isLastPage = remainingHeight - pageBodySize <= 0


					if (this.settings.footer.isFooterRepeatable || isLastPage) // if the header is reapeatable or its the last page
						footerHeight = this.settings.footer.height
					else
						footerHeight = 0

					totalBodySize = defaultHeightOfPaper - headerHeight - footerHeight - errorValue

					remainingHeight -= totalBodySize
					currentTotalPages += 1

					pageBodiesSize.push(totalBodySize)
					pageHeadersSize.push(headerHeight)
					pageFootersSize.push(footerHeight)

				}
				this.locals.pageHeadersSizes = pageHeadersSize
				this.locals.pageBodiesSizes = pageBodiesSize
				this.locals.pageFootersSizes = pageFootersSize
				this.locals.totalPages = currentTotalPages
			},

			/**
			 * Converts given base64 to canvas.
			 * @param {String} imgBase64 - image base64
			 * @param {Number} sy - The y-axis coordinate of the top left corner of the sub-rectangle of the source image.
			 * @param {Number} totalPagesHeight - totalPagesHeight in inches
			 * @return {HTMLElement} - canvas
			 */
			canvasMaker(imgBase64: string, sy: number, index: number): CanvasImageSource {
				let scale = 2
				let img = new Image()
				let canvas = document.createElement("canvas")
				canvas.height = this.convert2Pixels(this.locals.pageBodiesSizes[index]) * scale
				canvas.width = this.convert2Pixels(this.settings.defaultWidthOfPaper) * scale
				let context = canvas.getContext("2d")
				img.src = imgBase64
				img.onload = () => {
					context.drawImage(
						img, // img
						0, // sx
						sy * scale, // sy
						this.convert2Pixels(this.settings.defaultWidthOfPaper) * scale, // sWidth
						this.convert2Pixels(this.locals.pageBodiesSizes[index]) * scale, // sHeight
						0, // dx
						0, // dy
						this.convert2Pixels(this.settings.defaultWidthOfPaper) * scale, // dWidth
						this.convert2Pixels(this.locals.pageBodiesSizes[index] * scale) // dHeight
					)
				}
				return canvas
			},

			/**
			 * Converts the given html to Image and append it to the body tag.
			 * @return {Promise} - Promise void
			 */
			convert2Image(): Promise<ImageData> {
				return new Promise((resolve, reject) => {
					let transformOrigin = 'top left'
					var scale = 2
					let domNode = document.getElementById("toBeConverted")

					if (this.settings.body && this.settings.body.bodyElements && this.settings.body.bodyElements.length)
						this.setTotalHieghtBasedOnElementsHeight()

					domtoimage
						.toBlob(domNode, { // Converting the body from slot to blob and raising the scale to get better quality
							width: domNode.clientWidth * scale,
							height: domNode.clientHeight * scale,
							style: { transform: "scale(" + scale + ")", transformOrigin: transformOrigin },
						})
						.then((res) => {
							var reader = new FileReader()
							reader.readAsDataURL(res)
							reader.onloadend = () => {
								var result = reader.result
								let compStyles = window.getComputedStyle(document.getElementById("toBeConverted"))
								let imgHeight = compStyles.getPropertyValue("height")
								let totalPagesHeight = this.convert2Inches(parseInt(imgHeight)) // The total size of the given div to be printed in inches

								this.calculateSizes(totalPagesHeight) // Calculating sizes in inches

								this.$nextTick(() => {  // Waits till the base template is generated and then appends the children

									let convertedElement = document.getElementsByClassName("converted") // Element where children will be appended to

									for (let index = 0; index < convertedElement.length; index++) { // Removing the existing canvas and Appening the results to parents

										this.removeAllChildNodes(convertedElement[index])

										let computedSy = index * this.convert2Pixels(this.locals.pageBodiesSizes[index])
										let finalResult = this.canvasMaker(result, computedSy, index)
										convertedElement[index].appendChild(finalResult)
									}
									document.getElementById('loadingModal').style.display = 'none'
								})
							}
							resolve(res)
						})
						.catch(err => reject(err))
				})
			},

			/**
			 * By Triggering this func template builder modal will be displayed.
			 * @param {object} json - settings json
			 * @param {Function} callback - callback function
			 * @return {void} - void
			 */
			templateBuilder(json: ISettings, callback: Function): void {
				json.callback = callback
				this.locals.templateBuilderData = json
				this.locals.templateBuilderData.dataSets = this.dataSets
				this.locals.templateBuilderData.bindingObject = this.bindingObject
				this.$refs.TemplateBuilder.settingsInitFunc()

				let variables: IVariable[] = this.variables && this.variables.length ? this.variables : json.variables
				if (variables)
					this.$refs.TemplateBuilder.setVariables([...variables])

				this.$refs.TemplateBuilder.showModal()
			},

			/**
			 * By Triggering this func Print Preview modal will be displayed.
			 * @param {object} json - settings json
			 * @return {void} - void
			 */
			printPreview(json: ISettings): void {
				this.settings = this.merge(this.settings, json)
				document.getElementById("printModal").style.display = "block"
				document.getElementById('loadingModal').style.display = 'block'

				setTimeout(() => {
					this.convert2Image()
						.then(res => this.$emit('preview-success', res))
						.then(err => this.$emit('preview-failed', err))
				}, 100)
			},

			/**
			 * Shows template builder in print preview.
			 * @return {void} - void
			 */
			editWhileInPreview(): void {
				let printModal = document.getElementById("printModal")
				printModal.style.display = "none"
				this.templateBuilder(this.settings, (val) => {
				this.settings = this.merge(this.settings, val)
					this.printPreview()
				})
			},
		},
	};
</script>

<style lang="less">
	@import "~/assets/styles/print";
	@import "~/assets/styles/modal";
</style>
