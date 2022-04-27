<template>
	<div id="printPage">
		<TemplateBuilder ref="TemplateBuilder" :options="locals.templateBuilderData" :configurations="configs" />
		<!-- Data Slots -->
		<div class="slotWrapper">
			<div :style="{width: settings.defaultWidthOfPaper + 'in',padding: '5px'}">
				<div id="toBeConverted">
					<div id="componentsParent" v-if="settings.body && settings.body.bodyElements && settings.body.bodyElements.length">
						<component v-for="(element, index) in settings.body.bodyElements" :key="element.options.id" :is="element.type" :options="prepareComponentsOptions(element.options, element.type, index)" :variable="element.type === 'variable'? settings.variables.find(x => x.uniqueId === element.options.configs.uniqueId): {}" />
					</div>
					<slot v-else class="printData" name="printData"></slot>
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
						<div v-for="index in locals.totalPages" :key="index" class="mainLoop" :style="{height: settings.defaultheightofpaper + 'in',width: settings.defaultWidthOfPaper + 'in'}">
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

<script>
	import printJS from "print-js"
	import TemplateBuilder from '~/components/TemplateBuilder.vue'
	import TextPattern from '~/components/elements/TextPattern.vue'
	import TextElement from '~/components/elements/TextElement.vue'
	import DateTime from '~/components/elements/DateTime.vue'
	import BindingObject from '~/components/elements/BindingObject.vue'
	import PageCounter from '~/components/elements/PageCounter.vue'
	import ImageElement from '~/components/elements/ImageElement.vue'
	import Variable from '~/components/elements/Variable.vue'
	import DataSet from '~/components/elements/DataSet/DataSet.vue'
	import domtoimage from 'dom-to-image'
	export default {
		name: "Print",
		props: {
			options: { type: Object },
			bindingObject: { type: Object },
			variables: { type: Array },
			configurations: { type: Object },
		},
		components: {
			variable: Variable,
			textelement: TextElement,
			dataset: DataSet,
			datetime: DateTime,
			pagecounter: PageCounter,
			imageelement: ImageElement,
			bindingObject: BindingObject,
			textpattern: TextPattern,
			TemplateBuilder,
		},
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
					bindingObject: {},
					pageBorder: '0px',
				},
				configs: this.getDefaultConfigs()
			}
		},
		mounted() {
			this.modalManager('printModal', 'printModalCloseBtn')
		},
		methods: {

			/**
			 * set body elements parent components height.
			 * @return {void} - void
			 */
			setBodyWithElementsHeight() {
				const parent = document.getElementById('componentsParent')
				var maxBottom = 0
				var elementWithMaxBottom

				for (let child of parent.children) {
					if (child.getBoundingClientRect().bottom > maxBottom) {
						maxBottom = child.getBoundingClientRect().bottom
						elementWithMaxBottom = child
					}
				}
				parent.style.height = elementWithMaxBottom.offsetTop + elementWithMaxBottom.getBoundingClientRect().height + 'px'
			},

			/**
			 * print calculated output to pdf
			 * @return {void} - void
			 */
			printForm() {
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
			 * @return {Object} - returns configs objects
			 */
			getDefaultConfigs() {
				return Object.assign(
					{
						maximumFileSize: 1000 // Maximum file size in KB
					}
					, this.configurations)
			},

			/**
			 * Removes all the previous children from the parent.
			 * @param {HTMLElement} parent - parent
			 * @return {void} - void
			 */
			removeAllChildNodes(parent) {
				while (parent.firstChild) {
					parent.removeChild(parent.firstChild)
				}
			},

			/**
			 * converts given pixel to inch.
			 * @param {Number} pixels - pixels
			 * @return {Number} - given pixel to intches
			 */
			convert2Inches(pixels) {
				return (pixels / 96).toFixed(2)
			},

			/**
			 * converts given inch to pixel.
			 * @param {Number} inches - inches
			 * @return {Number} - given inches to pixels
			 */
			convert2Pixels(inches) {
				return (inches * 96).toFixed(2)
			},

			/**
			 * Calculate Dynamic sizes from template builder before print.
			 * @param {Number} totalPagesHeight - totalPagesHeight in inches
			 * @return {void} - void
			 */
			calculateSizes(totalPagesHeight) {

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
			canvasMaker(imgBase64, sy, index) {
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
			convert2Image() {
				return new Promise((resolve, reject) => {
					let transformOrigin = 'top left'
					var scale = 2
					let domNode = document.getElementById("toBeConverted")

					if (this.settings.body && this.settings.body.bodyElements && this.settings.body.bodyElements.length)
						this.setBodyWithElementsHeight()

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
			 * Converts the given html to Image and append it to the body tag.
			 * @param {Number} modalId - modal element id
			 * @param {Number} closeBtnId - close button element id
			 * @return {void} - void
			 */
			modalManager(modalId, closeBtnId) {
				var modal = document.getElementById(modalId)

				// Get the <span> element that closes the modal
				var span = document.getElementById(closeBtnId)

				// When the user clicks on <span> (x), close the modal
				span.onclick = function () {
					modal.style.display = "none"
				}

				// When the user clicks anywhere outside of the modal, close it
				window.onclick = function (event) {
					if (event.target === modal) {
						modal.style.display = "none"
					}
				}
			},

			/**
			 * By Triggering this func template builder modal will be displayed.
			 * @param {object} json - settings json
			 * @param {Function} callback - callback function
			 * @return {void} - void
			 */
			templateBuilder(json, callback) {
				json.callback = callback
				this.locals.templateBuilderData = json
				let tmp = JSON.parse(JSON.stringify(this.bindingObject))
				for (let key in tmp) {
					tmp[key] = null
				}
				this.locals.templateBuilderData.bindingObject = tmp
				this.$refs.TemplateBuilder.settingsInitFunc()

				let variables = this.variables && this.variables.length ? this.variables : json.variables
				if (variables)
					this.$refs.TemplateBuilder.setVariables([...variables])

				this.$refs.TemplateBuilder.showModal()
			},

			/**
			 * By Triggering this func Print Preview modal will be displayed.
			 * @param {object} json - settings json
			 * @return {void} - void
			 */
			printPreview(json) {
				Object.assign(this.settings, json)
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
			editWhileInPreview() {
				let printModal = document.getElementById("printModal")
				printModal.style.display = "none"
				this.templateBuilder(this.settings, (val) => {
					Object.assign(this.settings, val)
					this.printPreview()
				})
			},

			/**
			 * Covertes the given number to persian fotmat.
			 * @param {Number} n - given number
			 * @return {Number} - converted number
			 */
			toPersianNumbers(n) {
				const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]

				return n.toString().replace(/\d/g, (x) => farsiDigits[x])
			},

			/**
			 * Prepare elements options before previewing in print preview.
			 * @param {Object} options - preview settings
			 * @param {String} type - element type
			 * @param {Number} index - loop index
			 * @return {Number} - converted number
			 */
			prepareComponentsOptions(options, type, index) {

				let opt = JSON.parse(JSON.stringify(options)) // Storing the options in opt

				switch (type) {

					case 'dataset':
						opt.configs.originalColumnHeight = opt.styles.height // storing dataset height in originalColumnHeight to use it for column height
						opt.configs.rowsHeight = 'auto' // setting default rows height
						opt.styles.height = 'auto'
						var displaySet = opt.configs.dataSets[opt.configs.selectedDataSet]
						var columns = displaySet.options.configs.columns
						var rows = displaySet.options.configs.rows
						for (let row of rows) {
							var objectKeys = Object.keys(row)
							for (let index = 0; index < objectKeys.length; index++) {
								let data = row[objectKeys[index]]
								data.options.styles.width = columns[index].options.styles.width
								data.options.styles.textAlign = columns[index].options.styles.textAlign
								data.options.styles.fontWeight = columns[index].options.styles.fontWeight
								data.options.styles.fontFamily = columns[index].options.styles.fontFamily
								data.options.styles.fontSize = columns[index].options.styles.fontSize
								data.options.styles.border = columns[index].options.styles.border
								data.options.styles.borderTop = columns[index].options.styles.borderTop
								data.options.styles.borderBottom = columns[index].options.styles.borderBottom
								data.options.styles.borderLeft = columns[index].options.styles.borderLeft
								data.options.styles.borderRight = columns[index].options.styles.borderRight

								data.isActive = columns[index].isActive
							}
						}
						break

					case 'pagecounter':
						if (opt.configs.completeForm) {
							if (opt.configs.persianNumbers) {
								index = this.toPersianNumbers(index)
								let totalPages = this.toPersianNumbers(this.locals.totalPages)
								opt.configs.counter = opt.configs.counter.replace('1', this.$t('template-builder.page-counter', { index, totalPages }))
							} else {
								opt.configs.counter = opt.configs.counter.replace('1', `page ${index} / ${this.locals.totalPages}`)
							}
						} else {
							opt.configs.counter = index
						}
						break

					case 'bindingObject':
						let key = opt.configs.field

						if (this.bindingObject[key])
							opt.configs.value = this.bindingObject[key]
						else
							opt.configs.value = ''

						break

					case 'textpattern':
						let matches = [], // an array to collect the strings that are matches
							types = [],
							regex = /{([^{]*?\w)(?=\})}/gim,
							text = opt.configs.text,
							curMatch

						while ((curMatch = regex.exec(text))) {
							types.push(curMatch[1])
							matches.push(curMatch[0])
						}

						for (let index = 0; index < types.length; index++) {
							text = text.replace(
								"{" + types[index] + "}",
								this.bindingObject[types[index]]
							)
						}
						opt.configs.value = text

						break

					case 'variable':

						opt.styles.backgroundColor = 'white'

					default:
						break
				}

				return opt
			},
		},
	};
</script>

<style>
	@import "~/assets/styles/print.css";
	@import "~/assets/styles/modal.css";
</style>
