<template>
	<div id="printPage">
		<!-- Preparing body to create canvas -->
		<div class="vcp-slot-wrapper">
			<div :style="{width: settings.page.size[1] + 'in'}">
				<div id="toBeConverted">
					<div id="componentsParent">

						<div class="body-render-section" :style="[{height: settings.beforeBody.height + 'in'}, settings.beforeBody.styles]">
							<component v-for="(element, index) in settings.beforeBody.elements" :key="element.id" :is="element.type" :instance="prepareElementInstance(element, index)" />
						</div>

						<div id="bodyComponents" v-if="settings.body && settings.body.elements && settings.body.elements.length" class="body-render-section"
							:style="[{height: settings.body.height + 'in'}, settings.body.styles]">
							<component v-for="(element, index) in settings.body.elements" :key="element.id" :is="element.type" :instance="prepareElementInstance(element, index)" />
						</div>

						<slot v-else class="printData" name="printDataChild"></slot>

						<div class="body-render-section" :style="[{height: settings.afterBody.height + 'in'}, settings.afterBody.styles]">
							<component v-for="(element, index) in settings.afterBody.elements" :key="element.id" :is="element.type" :instance="prepareElementInstance(element, index)" />
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Print Preview Modal-->
		<div id="printModal" class="vcp-modal">
			<div class="vcp-modal-content" :style="{ width: settings.page.size[1] + 0.5 + 'in' }">
				<div :dir="settings.page.direction" class="vcp-modal-header">
					<div style="display: flex">
						<a href="#" @click="printForm()" :title="_$t('print.name')" class="vcp-modal-icon">
							<img src="@/assets/images/printer.png" />
						</a>
					</div>
					<div>
						<h3 class="vcp-modal-title">{{_$t('print.print-preview')}}</h3>
					</div>
					<div>
						<span id="printModalCloseBtn" @click="closeModal('printModal')" class="vcp-modal-close-btn">&times;</span>
					</div>
				</div>
				<div style="position: relative; min-height: 200px">
					<div style="padding-top: 10px; text-align: center">{{ _$t('template-builder.page-count') }}: {{ locals.totalPages }}</div>

					<!-- Loading popup modal -->

					<div id="loadingModal" class="vcp-modal-loading">
						<div class="vcp-modal-loading-content">
							<div class="vcp-modal-loading-inner">
								<!-- Spinner -->

								<div class="vcp-chaser">
									<div class="vcp-chaser-dot"></div>
									<div class="vcp-chaser-dot"></div>
									<div class="vcp-chaser-dot"></div>
									<div class="vcp-chaser-dot"></div>
								</div>
								<p style="margin-top: 20px">{{ _$t('print.proccessing') }}</p>
							</div>
						</div>
					</div>
					<div id="vcp-printForm">
						<div v-for="index in locals.totalPages" :key="index" class="vcp-main-loop" :style="{height: settings.page.size[0] + 'in',width: settings.page.size[1] + 'in'}">
							<div :style="{width: 'auto', border: settings.page.border}">
								<div v-if="settings.header.repeatable || index === 1" :style="[{height: locals.pageHeadersSizes[index - 1] + 'in'}, settings.header.styles]" class="vcp-main-header">
									<component v-for="element in settings.header.elements" :key="element.id" :is="element.type" :instance="prepareElementInstance(element, index -1 )" />
								</div>
							</div>
							<div class="vcp-converted" :style="{ height: locals.pageBodiesSizes[index - 1] + 'in' }"></div>
							<div v-if="settings.footer.repeatable ||index === locals.totalPages" :style="[{height: locals.pageFootersSizes[index - 1] + 'in'}, settings.footer.styles]" class="vcp-main-footer">
								<component v-for="element in settings.footer.elements" :key="element.id" :is="element.type" :instance="prepareElementInstance(element, index -1 )" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { IElement } from '~/interfaces/elements'
	import { findElementsParentInstance, prepareElementInstance, createDataSetDetails } from '~/plugins/element-utilities'
	import printJS from "print-js"
	import domtoimage from 'dom-to-image'
	import { convert2Pixels, convert2Inches, prepareSettings, getDefaultSettings } from '~/plugins/general-utilities'
	import { useGeneralStore } from '~/stores/general'

	const generalStore = useGeneralStore()

	export default {
		name: "Print",
		props: {
			options: { type: Object },
		},
		emits: ['print-success', 'print-error', 'preview-success', 'preview-failed'],
		data() {
			return {
				locals: {
					totalPages: 0,
					pageBodiesSizes: [] as number[],
					pageFootersSizes: [] as number[],
					pageHeadersSizes: [] as number[],
				},
				settings: getDefaultSettings(),
			}
		},
		watch: {
			options: {
				immediate: true,
				handler(val) {
					this.settings = prepareSettings(val)
				},
			}
		},
		methods: {
			prepareElementInstance(element: IElement, index: number): IElement {
				var extra = {
					index: index,
					totalPages: this.locals.totalPages,
					dataSetDetails: createDataSetDetails(findElementsParentInstance(this.settings, element)),
				}
				return prepareElementInstance(element, extra)
			},
			/**
			 * Temp method to close modal before refactoring modal
			 */
			closeModal(id: string): void {
				document.getElementById(id)!.style.display = 'none'
			},

			/**
			 * set body elements parent components height.
			 * @return {void} - void
			 */
			setTotalHieghtBasedOnElementsHeight(): void {
				const parent = document.getElementById('componentsParent')
				const body = document.getElementById('bodyComponents')
				var maxBottom = 0
				var elementWithMaxBottom: any
				// @ts-ignore
				for (let child of body.children) {
					if (child.getBoundingClientRect().bottom > maxBottom) {
						maxBottom = child.getBoundingClientRect().bottom
						elementWithMaxBottom = child
					}
				}
				var bodyHeight = elementWithMaxBottom!.offsetTop + elementWithMaxBottom.getBoundingClientRect().height // body height in pixels
				this.settings.body.height = convert2Inches(bodyHeight) // body height in inches
				parent!.style.height = this.settings.beforeBody.height + this.settings.body.height + this.settings.afterBody.height + 'in'
			},

			/**
			 * print calculated output to pdf
			 * @return {void} - void
			 */
			printForm(): void {
				var configs = generalStore.getByKey('configurations')
				// @ts-ignore
				printJS({
					printable: 'vcp-printForm',
					type: 'html',
					header: configs.header.context || '',
					headerStyle: configs.header.styles || '',
					scanStyles: false, // If true inline styles will be removed
					style: [
						".element {text-align: center;position: absolute;width: 100px;overflow: hidden;min-height: 20px;min-width: 20px;color: black;}.vcp-converted {text-align: center;flex-grow: 2;overflow: hidden;}.vcp-converted img {width: 8.26in;margin-top: 24px;margin-bottom: 24px;}.vcp-main-header {position: relative;overflow: hidden;}.vcp-main-footer {position: relative;overflow: hidden;}.vcp-converted canvas {width: 100%;}",
					], // some custom styles needed for print
					onLoadingEnd: (res: any) => this.$emit('print-success', res),
					onError: (err) => this.$emit('print-error', err)
				})
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

				let pageHeadersSize = [],
					pageFootersSize = [],
					pageBodiesSize = [],
					remainingHeight = totalPagesHeight,
					currentTotalPages = 0,
					totalBodySize,
					headerHeight,
					footerHeight,
					defaultHeightOfPaper

				while (remainingHeight > 0) {

					defaultHeightOfPaper = this.settings.page.size[0]

					// if the header is repeatable or its the first page
					headerHeight = this.settings.header.repeatable || pageHeadersSize.length === 0 ? this.settings.header.height : 0

					let footerHeightLastPage = this.settings.footer.height
					let headerHeightLastPage = this.settings.header.repeatable ? headerHeight : 0
					let pageBodySize = defaultHeightOfPaper - footerHeightLastPage - headerHeightLastPage
					let isLastPage = remainingHeight - pageBodySize <= 0

					// if the header is repeatable or its the last page
					footerHeight = this.settings.footer.repeatable || isLastPage ? this.settings.footer.height : 0

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
				canvas.height = convert2Pixels(this.locals.pageBodiesSizes[index]) * scale
				canvas.width = convert2Pixels(this.settings.page.size[1]) * scale
				let context = canvas.getContext("2d")
				img.src = imgBase64
				img.onload = () => {
					context!.drawImage(
						img, // img
						0, // sx
						sy * scale, // sy
						convert2Pixels(this.settings.page.size[1]) * scale, // sWidth
						convert2Pixels(this.locals.pageBodiesSizes[index]) * scale, // sHeight
						0, // dx
						0, // dy
						convert2Pixels(this.settings.page.size[1]) * scale, // dWidth
						convert2Pixels(this.locals.pageBodiesSizes[index] * scale) // dHeight
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

					if (this.settings.body && this.settings.body.elements && this.settings.body.elements.length)
						this.setTotalHieghtBasedOnElementsHeight()

					domtoimage
						.toBlob(domNode, { // Converting the body from slot to blob and raising the scale to get better quality
							width: domNode!.clientWidth * scale,
							height: domNode!.clientHeight * scale,
							style: { transform: "scale(" + scale + ")", transformOrigin: transformOrigin },
						})
						.then((res: any) => {
							var reader = new FileReader()
							reader.readAsDataURL(res)
							reader.onloadend = () => {
								var result = reader.result
								let compStyles = window.getComputedStyle(document.getElementById("toBeConverted") as Element)
								let imgHeight = compStyles.getPropertyValue("height")
								let totalPagesHeight = convert2Inches(parseInt(imgHeight)) // The total size of the given div to be printed in inches

								this.calculateSizes(totalPagesHeight) // Calculating sizes in inches

								this.$nextTick(() => {  // Waits till the base template is generated and then appends the children

									let convertedElement = document.getElementsByClassName("vcp-converted") // Element where children will be appended to

									for (let index = 0; index < convertedElement.length; index++) { // Removing the existing canvas and Appening the results to parents

										this.removeAllChildNodes(convertedElement[index] as HTMLElement)

										let computedSy = index * convert2Pixels(this.locals.pageBodiesSizes[index])
										let finalResult = this.canvasMaker(result as any, computedSy, index)
										convertedElement[index].appendChild(finalResult as any)
									}
									document.getElementById('loadingModal')!.style.display = 'none'
								})
							}
							resolve(res)
						})
						.catch((err: any) => reject(err))
				})
			},

			showModal() {
				document.getElementById("printModal")!.style.display = "block"
				document.getElementById('loadingModal')!.style.display = 'block'

				this.printPreview()
			},

			/**
			 * By Triggering this func Print Preview modal will be displayed.
			 * @return {void} - void
			 */
			printPreview(): void {
				setTimeout(() => {
					this.convert2Image()
						.then((res: any) => this.$emit('preview-success', res))
						.then((err: any) => this.$emit('preview-failed', err))
				}, 100)
			},
		},
	};
</script>