<template>
	<div id="printPage">
		<TemplateBuilder
			ref="TemplateBuilder"
			:options="locals.templateBuilderData"
			:variables="variables"
			:configuration="configs"
		/>

		<!-- Data Slots -->
		<div class="slotWrapper">
			<div
				:style="{
          width: settings.defaultWidthOfPaper + 'in',
          padding: '5px',
        }"
			>
				<div id="toBeConverted">
					<slot class="printData" name="printData"></slot>
				</div>
			</div>
		</div>

		<!-- Print Preview Modal-->

		<div id="printModal" class="print-modal">
			<div class="print-modal-content" :style="{ width: settings.defaultWidthOfPaper + 0.5 + 'in' }">
				<div class="print-modal-header">
					<div>
						<span id="printModalCloseBtn" class="close-btn">&times;</span>
					</div>
					<div>
						<h3 class="title">پیش نمایش چاپ</h3>
					</div>
					<div style="display: flex">
						<a @click="editWhileInPreview()" title="ویرایش" class="modal-icon" href="#">
							<img src="./elements/images/edit.png" />
						</a>
						<a href="#" @click="printForm()" title="چاپ" class="modal-icon">
							<img src="./elements/images/printer.png" />
						</a>
					</div>
				</div>
				<div style="position: relative; min-height: 200px">
					<div style="padding-top: 10px; text-align: center">تعداد صفحه: {{ locals.totalPages }}</div>

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
								<p style="margin-top: 20px">درحال پردازش...</p>
							</div>
						</div>
					</div>
					<div id="printForm">
						<div
							class="mainLoop"
							:style="{
                height: settings.defaultheightofpaper + 'in',
                width: settings.defaultWidthOfPaper + 'in',
              }"
							v-for="index in locals.totalPages"
							:key="index"
						>
							<div
								:style="{
                  width: 'auto',
                  border: settings.pageBorder,
                  margin: '5px',
                }"
								class="pages"
							>
								<div
									v-if="settings.header.isHeaderRepeatable || index == 1"
									:style="{
                    height: locals.pageHeadersSizes[index - 1] + 'in',
                  }"
									class="mainHeader"
								>
									<component
										v-for="element in settings.header.headerElements"
										:key="element.options.id"
										:is="element.type"
										:options="
                      prepareComponentsOptions(
                        element.options,
                        element.type,
                        index
                      )
                    "
										:variable="
                      element.type == 'variable'
                        ? settings.variables.find(
                            (x) =>
                              x.uniqueId == element.options.configs.uniqueId
                          )
                        : ''
                    "
									/>
								</div>
							</div>
							<div class="converted" :style="{ height: locals.pageBodiesSizes[index - 1] + 'in' }"></div>
							<div
								v-if="
                  settings.footer.isFooterRepeatable ||
                  index == locals.totalPages
                "
								:style="{
                  height: locals.pageFootersSizes[index - 1] + 'in',
                }"
								class="mainFooter"
							>
								<component
									v-for="element in settings.footer.footerElements"
									:key="element.options.id"
									:is="element.type"
									:options="
                    prepareComponentsOptions(
                      element.options,
                      element.type,
                      index
                    )
                  "
									:variable="
                    element.type == 'variable'
                      ? settings.variables.find(
                          (x) => x.uniqueId == element.options.configs.uniqueId
                        )
                      : {}
                  "
								/>
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
	import TemplateBuilder from "./TemplateBuilder.vue"
	import TextPattern from "./elements/TextPattern.vue"
	import TextElement from "./elements/TextElement.vue"
	import DateTime from "./elements/DateTime.vue"
	import BindingObject from "./elements/BindingObject.vue"
	import PageCounter from "./elements/PageCounter.vue"
	import ImageElement from "./elements/ImageElement.vue"
	import Variable from './elements/Variable.vue'
	import domtoimage from "dom-to-image"
	export default {
		name: "Print",
		props: {
			options: Object,
			bindingObject: Object,
			variables: Array,
			configuration: Object,
		},
		components: {
			variable: Variable,
			textelement: TextElement,
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
						height: 0.5,
						headerElements: [],
					},
					footer: {
						isFooterRepeatable: true,
						height: 0.5,
						footerElements: [],
					},
					defaultHeightOfPaper: 11.7, // Standard Height of the chosen paper in inch
					defaultWidthOfPaper: 8.26, // Standard Width of the chosen paper in inch
					designName: "",
					orientation: "portrait",
					pageSize: "a4",
					pageDirections: "rtl",
					bindingObject: {},
					pageBorder: "0px",
				},
				configs: this.getDefault()
			}
		},
		mounted() {
			this.modalFunc("printModal", "printModalCloseBtn")
		},
		methods: {
			printForm() {

				/**
				 * Prints the form
				 */

				printJS({
					printable: "printForm",
					type: "html",
					scanStyles: false, // If true inline styles will be removed
					style: [
						".element {text-align: center;position: absolute;width: 100px;overflow: hidden;min-height: 20px;min-width: 20px;color: black;}.converted {text-align: center;flex-grow: 2;overflow: hidden;}.converted img {width: 8.26in;margin-top: 24px;margin-bottom: 24px;}.mainHeader {position: relative;overflow: hidden;}.mainFooter {position: relative;overflow: hidden;}.converted canvas {width: 100%;}",
					],
				}) // some custom styles needed for print
			},

			/**
			 * sync the given configs with the default
			 */

			getDefault() {
				let tmp = {
					maximumFileSize: 1000 // Maximum file size in KB
				}
				Object.assign(tmp, this.configuration)
				return tmp
			},

			/**
			 * Removes all the previous children from the parent
			 */

			removeAllChildNodes(parent) {
				while (parent.firstChild) {
					parent.removeChild(parent.firstChild)
				}
			},

			/**
			 * converts given pixel to inch
			 */

			convert2Inches(pixels) {
				return (pixels / 96).toFixed(2)
			},

			/**
			 * converts given inch to pixel
			 */

			convert2Pixels(inches) {
				return (inches * 96).toFixed(2)
			},

			/**
			 * Calculate Dynamic sizes from template builder before print
			 */

			calculateSizes(totalPagesHeight) {

				let errorValue // Subtractable value to make the pages height more accurate

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

					errorValue = 0.01 // Dividing the whole body from this value to make it more accurate

					defaultHeightOfPaper = this.settings.defaultHeightOfPaper

					if (this.settings.header.isHeaderRepeatable || pageHeadersSize.length == 0) { // if the header is reapeatable or its the first page
						headerHeight = this.settings.header.height
					} else {
						headerHeight = 0
					}

					let footerHeightLastPage = this.settings.footer.height
					let headerHeightLastPage = this.settings.header.isHeaderRepeatable ? headerHeight : 0
					let pageBodySize = defaultHeightOfPaper - footerHeightLastPage - headerHeightLastPage
					let isLastPage = remainingHeight - pageBodySize <= 0


					if (this.settings.footer.isFooterRepeatable || isLastPage) { // if the header is reapeatable or its the last page
						footerHeight = this.settings.footer.height
					} else {
						footerHeight = 0
					}

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
			 * Converts given base64 to canvas
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
						img,
						0,
						sy * scale,
						this.convert2Pixels(this.settings.defaultWidthOfPaper) * scale,
						this.convert2Pixels(this.locals.pageBodiesSizes[index]) * scale,
						0,
						0,
						this.convert2Pixels(this.settings.defaultWidthOfPaper) * scale,
						this.convert2Pixels(this.locals.pageBodiesSizes[index] * scale)
					)
				}
				return canvas
			},

			/**
			 * Converts the given html to Image and append it to the body tag
			 */

			convert2Image() {
				let transformOrigin = this.settings.pageDirections == 'rtl' ? 'top right' : 'top left'
				var scale = 2
				let domNode = document.getElementById("toBeConverted")
				domtoimage
					.toBlob(domNode, { // Converting the body from slot to blob and raising the scale to get better quality
						width: domNode.clientWidth * scale,
						height: domNode.clientHeight * scale,
						style: {
							transform: "scale(" + scale + ")",
							transformOrigin: transformOrigin,
						},
					})
					.then((res) => {
						var reader = new FileReader()
						reader.readAsDataURL(res)
						reader.onloadend = () => {
							var result = reader.result
							let compStyles = window.getComputedStyle(
								document.getElementById("toBeConverted")
							)
							let imgHeight = compStyles.getPropertyValue("height")
							let totalPagesHeight = this.convert2Inches(parseInt(imgHeight)) // The total size of the given div to be printed in inches

							this.calculateSizes(totalPagesHeight) // Calculating sizes in inches

							this.$nextTick(() => {  // Waits till the base template is generated and then appends the children

								let convertedElement = document.getElementsByClassName("converted") // Element that children will be appended to

								// Removing the existing canvas and Appening the results to parents
								for (let index = 0; index < convertedElement.length; index++) {

									this.removeAllChildNodes(convertedElement[index])

									let computedSy =
										index * this.convert2Pixels(this.locals.pageBodiesSizes[index])
									let finalResult = this.canvasMaker(result, computedSy, index)
									convertedElement[index].appendChild(finalResult)
								}
								document.getElementById('loadingModal').style.display = 'none'
							})
						}
					})
			},

			/**
			 * function for the modal
			 */

			modalFunc(modalId, closeBtnId) {
				var modal = document.getElementById(modalId)

				// Get the <span> element that closes the modal
				var span = document.getElementById(closeBtnId)

				// When the user clicks on <span> (x), close the modal
				span.onclick = function () {
					modal.style.display = "none"
				}

				// When the user clicks anywhere outside of the modal, close it
				window.onclick = function (event) {
					if (event.target == modal) {
						modal.style.display = "none"
					}
				}
			},

			/**
			 * By Triggering this func template builder modal will be displayed
			 */

			templateBuilder(json, callback) {
				json.callback = callback
				this.locals.templateBuilderData = json
				let tmp = JSON.parse(JSON.stringify(this.bindingObject))
				for (let item in tmp) {
					tmp[item] = null
				}
				this.locals.templateBuilderData.bindingObject = tmp
				this.$refs.TemplateBuilder.settingsInitFunc()
				this.$refs.TemplateBuilder.setVariables([...this.variables])				
				this.$refs.TemplateBuilder.showModal()
			},

			/**
			 * By Triggering this func Print Preview modal will be displayed
			 */

			printPreview(json) {
				Object.assign(this.settings, json)
				document.getElementById("printModal").style.display = "block"
				document.getElementById('loadingModal').style.display = 'block'

				setTimeout(() => {
					this.convert2Image()
				}, 100)
			},

			/**
			 *  Triggering editWhileInPreview
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
			 * Covertes the given number to persian fotmat
			 */

			toPersianNumbers(n) {
				const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]

				return n.toString().replace(/\d/g, (x) => farsiDigits[x])
			},

			/**
			 * Prepare elements options before previewing in print preview
			 */

			prepareComponentsOptions(options, type, index) {

				let opt = JSON.parse(JSON.stringify(options)) // Storing the options in opt

				switch (type) {

					case 'pagecounter':
						if (opt.configs.completeForm) {
							if (opt.configs.persianNumbers) {
								index = this.toPersianNumbers(index)
								let totalPages = this.toPersianNumbers(this.locals.totalPages)
								opt.configs.counter = opt.configs.counter.replace('1', `صفحه ${index} از ${totalPages}`)
							} else {
								opt.configs.counter = opt.configs.counter.replace('1', `page ${index} / ${this.locals.totalPages}`)
							}
						} else {
							opt.configs.counter = index
						}
						break

					case 'bindingObject':
						let key = opt.configs.field
						if (this.bindingObject[key]) {
							opt.configs.value = this.bindingObject[key]
						} else {
							opt.configs.value = ''
						}
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
	@import "./css/print.css";
	@import "./css/modal.css";
</style>
