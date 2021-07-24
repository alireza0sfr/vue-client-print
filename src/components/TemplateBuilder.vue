<template>
	<div id="templateBuilderPage" :dir="settings.pageDirections">
		<!-- Preview Modal-->
		<div id="templateBuilderModal" class="print-modal">
			<div class="print-modal-content">
				<div class="print-modal-header">
					<div>
						<span id="TemplateBuilderModalCloseBtn" class="close-btn">&times;</span>
					</div>
					<div>
						<h3 class="title">طراح چاپ</h3>
					</div>
					<div>
						<a @click="export2Json()" title="ذخیره" class="modal-icon" href="#">
							<img src="./elements/images/floppy-disk.png" />
						</a>
					</div>
				</div>

				<!-- Section 1 (Template Builder) -->
				<div class="template-builder-container">
					<div :style="{ height: settings.defaultHeightOfPaper + 'in' }" class="toolbar-container">
						<div class="toolbar-content">
							<!-- Tabs -->
							<div class="tabs">
								<a
									class="tab selected"
									@click="switchTabs('settings', $refs.settings)"
									ref="settings"
								>تنظیمات</a>
								<a class="tab" @click="switchTabs('variables', $refs.variables)" ref="variables">متغیر ها</a>
								<a class="tab" @click="switchTabs('others', $refs.others)" ref="others">سایر</a>
							</div>

							<!-- Variables Tab -->

							<div v-show="locals.tabName == 'variables'" class="variables-tab">
								<div class="toolbar-header variables-header" style="border-right: 1px solid #81c3ff">
									<span>لیست متغیر ها</span>
								</div>
								<div class="variables-content-wrapper">
									<div @click="createVariable()" style="text-align: center; margin-top: 10px">
										<a class="a-btn">افزودن متغیر</a>
									</div>
									<div class="variables">
										<div
											:class="[
                        'variable',
                        {
                          selected:
                            locals.selectedElement.options.configs.uniqueId ==
                            variable.uniqueId,
                        },
                      ]"
											v-for="variable in locals.variables"
											:key="variable.uniqueId"
										>
											<div class="variables-row">
												<div class="variables-row large">
													<div class="variables-content-field" style="width: 60%">
														<input
															type="text"
															v-model="variable.name"
															class="input-form-control"
															aria-label="Small"
															placeholder="نام متغیر"
															aria-describedby="inputGroup-sizing-sm"
														/>
													</div>
													<div class="variables-content-field" style="width: 40%">
														<select
															class="input-form-control"
															v-model="variable.type"
															@change="onVariableTypeChange(variable)"
														>
															<option value="text">متن</option>
															<option value="image">عکس</option>
														</select>
													</div>
												</div>
												<div
													draggable="true"
													class="variables-content-field small"
													@dragstart="
                            startDraggingElement('variable', variable.uniqueId)
                          "
													@dragend="finishedDraggingElement()"
												>
													<img style="height: 20px; width: 15px; cursor: move;" src="./elements/images/drag.png" />
												</div>
											</div>
											<div class="variables-row">
												<div v-if="variable.type == 'text'" class="variables-content-field large">
													<input
														type="text"
														v-model="variable.context"
														class="input-form-control"
														aria-label="Small"
														placeholder="متن"
														aria-describedby="inputGroup-sizing-sm"
													/>
												</div>
												<div class="variables-content-field large" v-if="variable.type == 'image'">
													<input
														type="file"
														accept="image/*"
														@change="onFileChange(variable.uniqueId)"
														aria-label="Small"
														aria-describedby="inputGroup-sizing-sm"
														id="variableImageFileControl"
													/>
												</div>
												<div class="variables-content-field small">
													<img
														@click="deleteVariable(variable.uniqueId)"
														style="width: 15px; height: 15px"
														src="./elements/images/cancel.png"
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							<!-- Others Tab  -->

							<div v-show="locals.tabName == 'others'" class="others-tab">
								<div class="toolbar-header variables-header" style="border-right: 1px solid #81c3ff">
									<span>ذخیره</span>
								</div>
								<div class="toolbar-content-row">
									<div style="width: 100%;" class="toolbar-content-field">
										<a class="a-btn" @click="export2SrcFile()">Export</a>
									</div>
								</div>
								<div class="toolbar-content-row">
									<div style="width: 100%;" class="toolbar-content-field">
										<a class="a-btn" @click="clickedOnInput('fileSrcControl')">Import</a>
									</div>
								</div>
								<div style="display:none" class="toolbar-content-row">
									<div class="variables-content-field">
										<input
											type="file"
											@change="onFileChange()"
											aria-label="Small"
											aria-describedby="inputGroup-sizing-sm"
											id="fileSrcControl"
										/>
									</div>
								</div>
							</div>
							<!-- Settings Tab -->

							<div v-show="locals.tabName == 'settings'" class="settings-tab">
								<!-- Settings -->
								<div class="toolbar-header" style="border-right: 1px solid #81c3ff">
									<span>تنظیمات پرینت</span>
								</div>
								<div class="toolbar-content-wrapper" id="printConfigsMenu">
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<span>نام طرح</span>
										</div>
										<div class="toolbar-content-field">
											<input
												type="text"
												v-model="settings.designName"
												class="input-form-control"
												aria-label="Small"
												aria-describedby="inputGroup-sizing-sm"
											/>
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<label for="pageSizeControl">اندازه صفحه</label>
										</div>
										<div class="toolbar-content-field">
											<select
												class="input-form-control"
												v-model="settings.pageSize"
												@change="syncSizes()"
												id="pageSizeControl"
											>
												<option value="a3">A3</option>
												<option value="a4">A4</option>
												<option value="a5">A5</option>
											</select>
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<label for="pageOrientiationsControl">حالت صفحه</label>
										</div>
										<div class="toolbar-content-field">
											<select
												class="input-form-control"
												@change="syncSizes()"
												v-model="settings.orientation"
												id="pageOrientiationsControl"
											>
												<option value="portrait">عمودی</option>
												<option value="landscape">افقی</option>
											</select>
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<span>کادر</span>
										</div>
										<div class="toolbar-content-field">
											<input
												type="text"
												class="input-form-control"
												v-model="settings.pageBorder"
												aria-label="Small"
												aria-describedby="inputGroup-sizing-sm"
											/>
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<label for="repeatableHeaderControl">تکرار هدر</label>
										</div>
										<div class="toolbar-content-field">
											<input
												class="input-form-control"
												type="checkbox"
												v-model="settings.header.isHeaderRepeatable"
												id="repeatableHeaderControl"
											/>
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<label for="repeatableFooterControl">تکرار فوتر</label>
										</div>
										<div class="toolbar-content-field">
											<input
												class="input-form-control"
												type="checkbox"
												v-model="settings.footer.isFooterRepeatable"
												id="repeatableFooterControl"
											/>
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<span>جهت صفحه</span>
										</div>
										<div class="toolbar-content-field" style="text-align: right">
											<div>
												<label for="pageDirections">
													<input
														type="radio"
														name="pageDirections"
														id="pageDirections"
														value="rtl"
														v-model="settings.pageDirections"
													/>
													راست به چپ
												</label>
											</div>
											<div>
												<label for="pageDirections">
													<input
														type="radio"
														name="pageDirections"
														id="pageDirections"
														value="ltr"
														v-model="settings.pageDirections"
													/>
													چپ به راست
												</label>
											</div>
										</div>
									</div>
								</div>

								<!-- Elements -->

								<div class="toolbar-header">
									<span>المنت ها</span>
								</div>
								<div class="toolbar-content-wrapper" style="flex-direction: row" id="elementsMenu">
									<div class="toolbar-content-row-elements">
										<div class="toolbar-content-row-element">
											<span
												draggable="true"
												@dragstart="startDraggingElement('textelement')"
												@dragend="finishedDraggingElement()"
											>
												<img src="./elements/images/text.png" alt="متن" />
												<div class="element-title">متن</div>
											</span>
										</div>
									</div>
									<div class="toolbar-content-row-elements">
										<div class="toolbar-content-row-element">
											<span
												draggable="true"
												@dragstart="startDraggingElement('datetime')"
												@dragend="finishedDraggingElement()"
											>
												<img src="./elements/images/timetable.png" alt="تاریخ و ساعت" />
												<div class="element-title">تاریخ و ساعت</div>
											</span>
										</div>
									</div>
									<div class="toolbar-content-row-elements">
										<div class="toolbar-content-row-element">
											<span
												draggable="true"
												@dragstart="startDraggingElement('pagecounter')"
												@dragend="finishedDraggingElement()"
											>
												<img src="./elements/images/pages.png" alt="شماره صفحه" />
												<div class="element-title">شماره صفحه</div>
											</span>
										</div>
									</div>
									<div class="toolbar-content-row-elements">
										<div class="toolbar-content-row-element">
											<span
												draggable="true"
												@dragstart="startDraggingElement('imageelement')"
												@dragend="finishedDraggingElement()"
											>
												<img src="./elements/images/image.png" alt="عکس" />
												<div class="element-title">عکس</div>
											</span>
										</div>
									</div>
									<div class="toolbar-content-row-elements">
										<div class="toolbar-content-row-element">
											<span
												draggable="true"
												@dragstart="startDraggingElement('bindingObject')"
												@dragend="finishedDraggingElement()"
											>
												<img src="./elements/images/binding.png" alt="اتصال داده" />
												<div class="element-title">اتصال داده</div>
											</span>
										</div>
									</div>
									<div class="toolbar-content-row-elements">
										<div class="toolbar-content-row-element">
											<span
												draggable="true"
												@dragstart="startDraggingElement('textpattern')"
												@dragend="finishedDraggingElement()"
											>
												<img src="./elements/images/textpattern.png" alt="متن الگویی" />
												<div class="element-title">متن الگویی</div>
											</span>
										</div>
									</div>
								</div>
								<div class="toolbar-header">
									<!-- Element's Settings -->

									<span>تنظیمات المنت</span>
								</div>
								<div class="toolbar-content-wrapper">
									<div class="toolbar-content-row" v-if="locals.selectedElement.type == 'textelement'">
										<div style="text-align: center; width: 100%">
											<span>متن خود را وارد کنید</span>
										</div>
									</div>
									<div class="toolbar-content-row" v-if="locals.selectedElement.type == 'textelement'">
										<div class="toolbar-content-field">
											<textarea
												v-model="locals.selectedElement.options.configs.text"
												class="input-form-control"
												aria-label="Small"
												aria-describedby="inputGroup-sizing-sm"
											></textarea>
										</div>
									</div>
									<div class="toolbar-content-row" v-if="locals.selectedElement.type == 'datetime'">
										<div class="toolbar-content-label">
											<label for="hasDateControl">تاریخ</label>
										</div>
										<div class="toolbar-content-field">
											<input
												class="input-form-control"
												type="checkbox"
												v-model="locals.selectedElement.options.configs.hasDate"
												id="hasDateControl"
											/>
										</div>
									</div>
									<div class="toolbar-content-row" v-if="locals.selectedElement.type == 'datetime'">
										<div class="toolbar-content-label">
											<label for="hasTimeControl">ساعت</label>
										</div>
										<div class="toolbar-content-field">
											<input
												class="input-form-control"
												type="checkbox"
												v-model="locals.selectedElement.options.configs.hasTime"
												id="hasTimeControl"
											/>
										</div>
									</div>
									<div class="toolbar-content-row" v-if="locals.selectedElement.type == 'datetime'">
										<div class="toolbar-content-label">
											<label for="persiaDateControl">تاریخ شمسی</label>
										</div>
										<div class="toolbar-content-field">
											<input
												class="input-form-control"
												type="checkbox"
												v-model="
                          locals.selectedElement.options.configs.persianDate
                        "
												id="persiaDateControl"
											/>
										</div>
									</div>
									<div class="toolbar-content-row" v-if="locals.selectedElement.type == 'pagecounter'">
										<div class="toolbar-content-label">
											<label for="persianNumbersControl">اعداد فارسی</label>
										</div>
										<div class="toolbar-content-field">
											<input
												type="checkbox"
												class="input-form-control"
												v-model="
                          locals.selectedElement.options.configs.persianNumbers
                        "
												id="persianNumbersControl"
											/>
										</div>
									</div>
									<div class="toolbar-content-row" v-if="locals.selectedElement.type == 'pagecounter'">
										<div class="toolbar-content-label">
											<label for="completeFormControl">صفحه از کل</label>
										</div>
										<div class="toolbar-content-field">
											<input
												type="checkbox"
												class="input-form-control"
												v-model="
                          locals.selectedElement.options.configs.completeForm
                        "
												id="completeFormControl"
											/>
										</div>
									</div>
									<div
										class="toolbar-content-row"
										style="flex-direction: column"
										v-if="locals.selectedElement.type == 'imageelement'"
									>
										<label for="elementImageFileControl">فایل تصویر خود را انتخاب کنید.</label>
										<div class="imageelement-text">*حداکثر سایز مجاز ۱ مگابایت</div>
										<div class="imageelement-text">فرمت فایل های قابل قبول:</div>
										<div class="imageelement-text" style="direction: ltr; margin-top: 0px;">*.png و *. jpeg</div>
									</div>
									<div class="toolbar-content-row" v-if="locals.selectedElement.type == 'imageelement'">
										<div style="width: 100%;" class="toolbar-content-field">
											<a class="a-btn" @click="clickedOnInput('elementImageFileControl')">افزودن عکس</a>
										</div>
									</div>
									<div
										style="display: none;"
										class="toolbar-content-row"
										v-if="locals.selectedElement.type == 'imageelement'"
									>
										<input
											style="margin-right: 21px;"
											type="file"
											accept="image/*"
											@change="onFileChange()"
											aria-label="Small"
											aria-describedby="inputGroup-sizing-sm"
											id="elementImageFileControl"
										/>
									</div>
									<div class="toolbar-content-row" v-if="locals.selectedElement.type == 'bindingObject'">
										<div class="toolbar-content-label">
											<label for="bindingObjectPersianNumbersControl">اعداد فارسی</label>
										</div>
										<div class="toolbar-content-field">
											<input
												type="checkbox"
												class="input-form-control"
												v-model="
                          locals.selectedElement.options.configs.persianNumbers
                        "
												id="bindingObjectPersianNumbersControl"
											/>
										</div>
									</div>
									<div class="toolbar-content-row" v-if="locals.selectedElement.type == 'bindingObject'">
										<div class="toolbar-content-label">
											<label for="bindingObjectControl">نوع داده</label>
										</div>
										<div class="toolbar-content-field">
											<select
												class="input-form-control"
												v-model="locals.selectedElement.options.configs.field"
												id="bindingObjectControl"
											>
												<option v-for="option in Object.keys(settings.bindingObject)" :key="option">{{ option }}</option>
											</select>
										</div>
									</div>
									<div class="toolbar-content-row" v-if="locals.selectedElement.type == 'textpattern'">
										<div style="text-align: center; width: 100%">
											<span>متن خود را وارد کنید</span>
											<p>مثال: سلام {name} خوش آمدید</p>
										</div>
									</div>
									<div v-if="locals.selectedElement.type == 'textpattern'">
										<div class="toolbar-content-field">
											<textarea
												v-model="locals.selectedElement.options.configs.text"
												class="input-form-control"
												aria-label="Small"
												aria-describedby="inputGroup-sizing-sm"
											></textarea>
										</div>
									</div>
									<div class="toolbar-content-row" v-if="locals.selectedElement.type == 'textpattern'">
										<div class="toolbar-content-label">
											<label for="textPatternPersianNumbersControl">اعداد فارسی</label>
										</div>
										<div class="toolbar-content-field">
											<input
												type="checkbox"
												class="input-form-control"
												v-model="
                          locals.selectedElement.options.configs.persianNumbers
                        "
												id="textPatternPersianNumbersControl"
											/>
										</div>
									</div>
								</div>
								<div class="toolbar-content-row" v-if="locals.selectedElement.type == 'textpattern'">
									<div class="toolbar-content-label">
										<label for="textpatternControl">فیلد ها</label>
									</div>
									<div class="toolbar-content-field">
										<select class="input-form-control" id="textpatternControl">
											<option v-for="option in Object.keys(settings.bindingObject)" :key="option">{{ option }}</option>
										</select>
									</div>
								</div>

								<!-- Element's Styles -->

								<div style="margin-top: 15px" class="toolbar-header">
									<span>استایل المنت</span>
								</div>
								<div class="toolbar-content-wrapper" id="elementStylesMenu">
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<label for="elementTextAlignControl">مکان نوشته</label>
										</div>
										<div class="toolbar-content-field">
											<select
												v-model="
                          locals.selectedElement.options.styles.textAlign
                        "
												class="input-form-control"
												id="elementTextAlignControl"
											>
												<option value="right">راست</option>
												<option value="center">وسط</option>
												<option value="left">چپ</option>
											</select>
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<span>رنگ نوشته</span>
										</div>
										<div class="toolbar-content-field">
											<input
												type="color"
												class="input-form-control"
												v-model="locals.selectedElement.options.styles.color"
												aria-label="Small"
												aria-describedby="inputGroup-sizing-sm"
											/>
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<span>رنگ پس زمینه</span>
										</div>
										<div class="toolbar-content-field">
											<input
												type="color"
												class="input-form-control"
												v-model="
                          locals.selectedElement.options.styles.backgroundColor
                        "
												aria-label="Small"
												aria-describedby="inputGroup-sizing-sm"
											/>
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<span>اندازه فونت</span>
										</div>
										<div class="toolbar-content-field">
											<select
												class="input-form-control"
												v-model="locals.selectedElement.options.styles.fontSize"
												id="pageSizeControl"
											>
												<option
													v-for="option in locals.fontSizes"
													:key="option"
													:value="option + 'px'"
												>{{ option }}</option>
											</select>
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<label for="fontWeightControl">نوع نوشته</label>
										</div>
										<div class="toolbar-content-field">
											<select
												v-model="
                          locals.selectedElement.options.styles.fontWeight
                        "
												class="input-form-control"
												id="elementTextAlignControl"
											>
												<option value="normal">عادی</option>
												<option value="bold">ضخیم</option>
											</select>
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<span>فونت</span>
										</div>
										<div class="toolbar-content-field">
											<input
												type="text"
												class="input-form-control"
												v-model="
                          locals.selectedElement.options.styles.fontFamily
                        "
												aria-label="Small"
												aria-describedby="inputGroup-sizing-sm"
											/>
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<span>کادر</span>
										</div>
										<div class="toolbar-content-field" style="text-align: right">
											<label for="bordersAlldirections">
												<input
													class="input-form-control"
													style="display: inline-block"
													type="checkbox"
													v-model="locals.bordersAllDirections"
													id="bordersAlldirections"
												/>
												همه جهات
											</label>
										</div>
									</div>
									<div class="toolbar-content-row" v-if="locals.bordersAllDirections">
										<div class="toolbar-content-label">
											<span>استایل کادر</span>
										</div>
										<div class="toolbar-content-field">
											<input
												type="text"
												class="input-form-control"
												v-model="locals.selectedElement.options.styles.border"
												aria-label="Small"
												aria-describedby="inputGroup-sizing-sm"
											/>
										</div>
									</div>
									<div v-if="locals.bordersAllDirections == false" style="width: 100%">
										<div class="toolbar-content-row">
											<div class="toolbar-content-label">
												<span>کادر بالا</span>
											</div>
											<div class="toolbar-content-field">
												<input
													type="text"
													class="input-form-control"
													v-model="
                            locals.selectedElement.options.styles.borderTop
                          "
													aria-label="Small"
													aria-describedby="inputGroup-sizing-sm"
												/>
											</div>
										</div>
										<div class="toolbar-content-row">
											<div class="toolbar-content-label">
												<span>کادر راست</span>
											</div>
											<div class="toolbar-content-field">
												<input
													type="text"
													class="input-form-control"
													v-model="
                            locals.selectedElement.options.styles.borderRight
                          "
													aria-label="Small"
													aria-describedby="inputGroup-sizing-sm"
												/>
											</div>
										</div>
										<div class="toolbar-content-row">
											<div class="toolbar-content-label">
												<span>کادر پایین</span>
											</div>
											<div class="toolbar-content-field">
												<input
													type="text"
													class="input-form-control"
													v-model="
                            locals.selectedElement.options.styles.borderBottom
                          "
													aria-label="Small"
													aria-describedby="inputGroup-sizing-sm"
												/>
											</div>
										</div>
										<div class="toolbar-content-row">
											<div class="toolbar-content-label">
												<span>کادر چپ</span>
											</div>
											<div class="toolbar-content-field">
												<input
													type="text"
													class="input-form-control"
													v-model="
                            locals.selectedElement.options.styles.borderLeft
                          "
													aria-label="Small"
													aria-describedby="inputGroup-sizing-sm"
												/>
											</div>
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<span>جهت نوشته</span>
										</div>
										<div class="toolbar-content-field" style="text-align: right">
											<label for="elementDirections">
												<div>
													<input
														type="radio"
														name="elementDirections"
														id="elementDirections"
														value="rtl"
														v-model="
                              locals.selectedElement.options.styles.direction
                            "
													/>
													راست به چپ
												</div>
											</label>
											<label for="elementDirections2">
												<div>
													<input
														type="radio"
														name="elementDirections"
														id="elementDirections2"
														value="ltr"
														v-model="
                              locals.selectedElement.options.styles.direction
                            "
													/>
													چپ به راست
												</div>
											</label>
										</div>
									</div>
								</div>
								<hr />
							</div>
						</div>
					</div>

					<!-- Section 2 (Template)-->
					<div style="overflow: auto; width: 100%; padding: 20px">
						<div
							class="template-container"
							:style="{
                height: settings.defaultHeightOfPaper + 'in',
                width: settings.defaultWidthOfPaper + 'in',
              }"
						>
							<div
								:style="{
                  width: '100%',
                  height: '100%',
                  border: settings.pageBorder,
                }"
								class="template"
								@click="deSelectAll"
							>
								<div
									:style="{
                    height: settings.header.height + 'in',
                    'min-height': '0.15in',
                  }"
									id="headerTemplate"
									class="section header"
									ref="headerTemplate"
									@drop="droppedElementOnHeader()"
									@dragenter.prevent
									@dragover.prevent
								>
									<component
										v-for="element in settings.header.headerElements"
										:key="element.options.id"
										:is="element.type"
										:options="element.options"
										:variable="
                      element.type == 'variable'
                        ? locals.variables.find(
                            (x) =>
                              x.uniqueId == element.options.configs.uniqueId
                          )
                        : ''
                    "
										@clickedOnElement="clickedOnElement(element)"
										@finishedEditingElement="finishedEditingElement(element)"
									/>
								</div>
								<div id="bodyTemplate">
									<div class="watermark">بدنه چاپ</div>
									<p>محتویات بدنه چاپ به صورت خودکار پر می شود.</p>
								</div>
								<div
									:style="{
                    height: settings.footer.height + 'in',
                    'min-height': '0.15in',
                  }"
									id="footerTemplate"
									class="section footer"
									ref="footerTemplate"
									@drop="droppedElementOnFooter()"
									@dragenter.prevent
									@dragover.prevent
								>
									<component
										v-for="element in settings.footer.footerElements"
										:key="element.options.id"
										:is="element.type"
										:options="element.options"
										:variable="
                      element.type == 'variable'
                        ? locals.variables.find(
                            (x) =>
                              x.uniqueId == element.options.configs.uniqueId
                          )
                        : {}
                    "
										@clickedOnElement="clickedOnElement(element)"
										@finishedEditingElement="finishedEditingElement(element)"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Variable from './elements/Variable.vue'
	import TextElement from "./elements/TextElement.vue"
	import DateTime from "./elements/DateTime.vue"
	import BindingObject from "./elements/BindingObject.vue"
	import PageCounter from "./elements/PageCounter.vue"
	import ImageElement from "./elements/ImageElement.vue"
	import TextPattern from "./elements/TextPattern.vue"
	import { saveAs } from 'file-saver'
	export default {
		name: "TemplateBuilder",
		props: {
			options: Object,
			variables: Array,
			configuration: Object,
		},
		components: {
			textelement: TextElement,
			datetime: DateTime,
			pagecounter: PageCounter,
			imageelement: ImageElement,
			bindingObject: BindingObject,
			textpattern: TextPattern,
			variable: Variable,
		},
		data() {
			return {
				locals: {
					pageSizeDictionary: {
						landscape: {
							a3: {
								width: 16.5,
								height: 11.7,
							},
							a4: {
								width: 11.7,
								height: 8.26,
							},
							a5: {
								width: 8.3,
								height: 5.8,
							},
						},
						portrait: {
							a3: {
								width: 11.7,
								height: 16.5,
							},
							a4: {
								width: 8.26,
								height: 11.7,
							},
							a5: {
								width: 5.8,
								height: 8.3,
							},
						},
					},
					variables: [],
					bordersAllDirections: true,
					tabName: 'settings',
					isClicked: false,
					clickedElementId: 0,
					classType: "",
					uniqueId: 0,
					selectedElement: {
						type: '',
						options: {
							id: 0,
							configs: {},
							styles: {},
						},
					},
					fontSizes: [
						8, 10, 12, 14, 16, 18, 20, 22, 24, 30, 36, 42, 50, 58, 66, 74,
					],
				},
				settings: this.getDefault(),
			}
		},
		watch: {
			options: {
				deep: true,
				immediate: true,
				handler(val) {
					let rawSettings = this.getDefault()
					Object.assign(rawSettings, val)
					this.settings = rawSettings
				},
			},
			variables: {
				deep: true,
				immediate: true,
				handler(val) {
					this.locals.variables = val
				},
			},
		},
		mounted() {
			this.modalFunc("templateBuilderModal", "TemplateBuilderModalCloseBtn")
		},
		methods: {

			getDefault() {
				return {
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
					totalHeightOfAPaper: 10.4, // Useable height for body tag
					designName: "",
					orientation: "portrait",
					pageSize: "a4",
					pageDirections: "rtl",
					bindingObject: {},
					pageBorder: "",
					maximumFileSize: 1000 // Maximum file size in KB
				}
			},

			/**
			 * Exports all the data to a single json
			 */

			export2Json() {
				// Syncing headerElements with the user chagnes
				let headerElements = this.settings.header.headerElements
				let footerElements = this.settings.footer.footerElements

				for (let index = 0; index < headerElements.length; index++) {
					let computedStyles = this.getCoordinates(
						headerElements[index].options.id
					)
					let elementStyles = headerElements[index].options.styles
					Object.assign(elementStyles, computedStyles)
				}

				for (let index = 0; index < footerElements.length; index++) {
					let computedStyles = this.getCoordinates(
						footerElements[index].options.id
					)
					let elementStyles = footerElements[index].options.styles
					Object.assign(elementStyles, computedStyles)
				}

				this.settings.totalHeightOfAPaper =
					this.settings.defaultHeightOfPaper -
					this.settings.header.height -
					this.settings.footer.height

				if (this.settings.totalHeightOfAPaper < 0) {
					this.settings.totalHeightOfAPaper = 1.77
				}

				let tmp = {
					header: {
						isHeaderRepeatable: this.settings.header.isHeaderRepeatable,
						height: this.settings.header.height,
						headerElements: this.settings.header.headerElements,
					},
					footer: {
						isFooterRepeatable: this.settings.footer.isFooterRepeatable,
						height: this.settings.footer.height,
						footerElements: this.settings.footer.footerElements,
					},
					variables: this.locals.variables,
					orientation: this.settings.orientation,
					pageSize: this.settings.pageSize,
					pageDirections: this.settings.pageDirections,
					totalHeightOfAPaper: this.settings.totalHeightOfAPaper,
					defaultHeightOfPaper: this.settings.defaultHeightOfPaper,
					defaultWidthOfPaper: this.settings.defaultWidthOfPaper,
					pageBorder: this.settings.pageBorder,
					designName: this.settings.designName,
				}

				// Closing the template builder modal after save
				document.getElementById("templateBuilderModal").style.display = "none"

				if (this.settings.callback != undefined) {
					this.settings.callback(tmp)
				}
			},

			/**
			 * Exports Data from given src file
			 */

			export2SrcFile() {
				// Syncing headerElements with the user chagnes
				let headerElements = this.settings.header.headerElements
				let footerElements = this.settings.footer.footerElements

				for (let index = 0; index < headerElements.length; index++) {
					let computedStyles = this.getCoordinates(
						headerElements[index].options.id
					)
					let elementStyles = headerElements[index].options.styles
					Object.assign(elementStyles, computedStyles)
				}

				for (let index = 0; index < footerElements.length; index++) {
					let computedStyles = this.getCoordinates(
						footerElements[index].options.id
					)
					let elementStyles = footerElements[index].options.styles
					Object.assign(elementStyles, computedStyles)
				}

				this.settings.totalHeightOfAPaper =
					this.settings.defaultHeightOfPaper -
					this.settings.header.height -
					this.settings.footer.height

				if (this.settings.totalHeightOfAPaper < 0) {
					this.settings.totalHeightOfAPaper = 1.77
				}

				let tmp = {
					header: {
						isHeaderRepeatable: this.settings.header.isHeaderRepeatable,
						height: this.settings.header.height,
						headerElements: this.settings.header.headerElements,
					},
					footer: {
						isFooterRepeatable: this.settings.footer.isFooterRepeatable,
						height: this.settings.footer.height,
						footerElements: this.settings.footer.footerElements,
					},
					variables: this.locals.variables,
					orientation: this.settings.orientation,
					pageSize: this.settings.pageSize,
					pageDirections: this.settings.pageDirections,
					totalHeightOfAPaper: this.settings.totalHeightOfAPaper,
					defaultHeightOfPaper: this.settings.defaultHeightOfPaper,
					defaultWidthOfPaper: this.settings.defaultWidthOfPaper,
					pageBorder: this.settings.pageBorder,
					designName: this.settings.designName,
				}

				tmp = this.encode2Base64(JSON.stringify(tmp)) // encoding the settings to export
				
				let designName = this.settings.designName == '' ? 'vue-print' : this.settings.designName
				var currentdate = new Date()
				var fileName = designName + "_"
					+ currentdate.getFullYear() + "_"
					+ (currentdate.getMonth() + 1) + "_"
					+ currentdate.getDate() + "_"
					+ currentdate.getHours() + "_"
					+ currentdate.getMinutes()

				var blob = new Blob([tmp],
					{ type: "text/plain;charset=utf-8" })
				saveAs(blob, `${fileName}.vp`)
			},

			/**
			 * Imports settings from src file and assign the settings based of it
			 */

			importFromSrcFile(srcFile) {
				this.settings = this.getDefault() // Set the settings to default value
				Object.assign(this.settings, JSON.parse(this.decodeFromBase64(srcFile))) // assign the changes
			},

			/**
			 * converts given inch to pixel
			 */

			convert2Pixels(inches) {
				return (inches * 96).toFixed(2)
			},

			/**
			 * sync the sizes based upon the selected page orientation and format
			 */

			syncSizes() {

				const errorValue = 0.2 // Subtracting this value to make the pages more accurate

				this.settings.defaultHeightOfPaper =
					this.locals.pageSizeDictionary[this.settings.orientation][this.settings.pageSize]["height"] // Gettings the default sizes from the base dic

				this.settings.totalHeightOfAPaper =
					this.settings.defaultHeightOfPaper -
					this.settings.footer.height -
					this.settings.header.height -
					errorValue

				this.settings.defaultWidthOfPaper =
					this.locals.pageSizeDictionary[this.settings.orientation][
					this.settings.pageSize
					]["width"]
			},

			/**
			 * Initializing dragging settings
			 */

			settingsInitFunc() {
				setTimeout(() => {
					this.headerBorderDragFunc()
					this.footerBorderDragFunc()
				}, 100)
			},

			/**
			 * converts given pixel to inch
			 */

			convert2Inches(pixels) {
				return (pixels / 96).toFixed(2)
			},

			/**
			 * Adjust the section's height by dragging
			 */

			headerBorderDragFunc() {
				var headerSection = document.getElementsByClassName("section header")[0] // element to make resizable

				var resizer = document.createElement("div")
				resizer.className = "resizer"
				resizer.style.height = "10px"
				headerSection.appendChild(resizer)
				resizer.addEventListener("mousedown", initDrag, false)

				var startY, startHeight

				let that = this // Storing this value to that to be able to use it inside a function

				function initDrag(e) {
					startY = e.clientY
					startHeight = parseInt(
						document.defaultView.getComputedStyle(headerSection).height,
						10
					)
					document.documentElement.addEventListener("mousemove", doDrag, false)
					document.documentElement.addEventListener("mouseup", stopDrag, false)
				}

				function doDrag(e) {
					that.settings.header.height = that.convert2Inches(
						startHeight + e.clientY - startY
					)
				}

				function stopDrag(e) {
					document.documentElement.removeEventListener(
						"mousemove",
						doDrag,
						false
					)
					document.documentElement.removeEventListener(
						"mouseup",
						stopDrag,
						false
					)
				}
			},

			/**
			 * Adjust the section's height by dragging
			 */

			footerBorderDragFunc() {
				var footerSection = document.getElementsByClassName("section footer")[0] // element to make resizable

				var resizer = document.createElement("div")
				resizer.className = "resizer"
				resizer.style.height = "10px"
				footerSection.appendChild(resizer)
				resizer.addEventListener("mousedown", initDrag, false)

				var startY, startHeight

				let that = this // Storing this value to that to be able to use it inside a function

				function initDrag(e) {
					startY = e.clientY
					startHeight = parseInt(
						document.defaultView.getComputedStyle(footerSection).height,
						10
					)
					document.documentElement.addEventListener("mousemove", doDrag, false)
					document.documentElement.addEventListener("mouseup", stopDrag, false)
				}

				function doDrag(e) {
					that.settings.footer.height = that.convert2Inches(
						startHeight - e.clientY + startY
					)
				}

				function stopDrag(e) {
					document.documentElement.removeEventListener(
						"mousemove",
						doDrag,
						false
					)
					document.documentElement.removeEventListener(
						"mouseup",
						stopDrag,
						false
					)
				}
			},

			/** 
			 * Swtich between tabs in toolbar 
			 */

			switchTabs(type, tab) {
				let slecetdTab = document.getElementsByClassName('tab selected')[0]
				slecetdTab.classList.remove('selected')
				tab.classList.add('selected')

				switch (type) {

					case 'settings':
						this.locals.tabName = 'settings'
						break

					case 'variables':
						this.locals.tabName = 'variables'
						break

					case 'others':
						this.locals.tabName = 'others'
						break

					default:
						break
				}
			},

			/**
			 * Deselect all selected elements
			 */

			deSelectAll() {
				if (this.locals.isClicked) {
					this.locals.isClicked = false
					return
				}

				this.locals.selectedElement = {
					type: '',
					options: {
						configs: {},
						styles: {},
					},
				}
				let selectedElements =
					document.getElementsByClassName("element selected")
				for (let index = 0; index < selectedElements.length; index++) {
					selectedElements[index].classList.remove("selected")
				}
			},

			clickedOnElement(element) {
				this.locals.selectedElement = element
				this.locals.clickedElementId = element.options.id
				this.deletingElementOnPressingDeleteKey()
				this.locals.isClicked = true
			},

			createElement(parent) {
				let classType = this.locals.classType
				let uniqueId = this.locals.uniqueId
				let tmp

				switch (classType) {
					case 'textelement':
						tmp = {
							type: classType,
							options: {
								id: this.idGenerator(5),
								configs: { text: "متن خود را وارد نمایید" },
								styles: {
									whiteSpace: "pre",
									width: "150px",
									direction: "rtl",
									fontWeight: "",
								},
							},
						}
						break

					case 'datetime':
						tmp = {
							type: classType,
							options: {
								id: this.idGenerator(5),
								configs: { hasDate: true, hasTime: true, persianDate: true },
								styles: { width: "150px" },
							},
						}
						break

					case 'pagecounter':
						tmp = {
							type: classType,
							options: {
								id: this.idGenerator(5),
								configs: { counter: '1', persianNumbers: true, completeForm: true },
								styles: {},
							},
						}
						break

					case 'imageelement':
						tmp = {
							type: classType,
							options: {
								id: this.idGenerator(5),
								configs: { imageSrc: require("./elements/images/logo.png") },
								styles: {
									top: 0,
									left: 0,
									width: "100px",
									height: "100px",
								},
							},
						}
						break

					case 'bindingObject':
						tmp = {
							type: classType,
							options: {
								id: this.idGenerator(5),
								configs: {
									persianNumbers: false,
									field: "",
									bindingObject: {},
								},
								styles: {
									whiteSpace: "pre",
									width: "150px",
									direction: "rtl",
								},
							},
						}
						break

					case 'textpattern':
						tmp = {
							type: classType,
							options: {
								id: this.idGenerator(5),
								configs: {
									persianNumbers: false,
									text: 'الگوی خود را وارد نمایید',
									value: null,
								},
								styles: {
									whiteSpace: "pre",
									width: "150px",
									direction: "rtl",
								},
							},
						}
						break

					case 'variable':
						tmp = {
							type: classType,
							options: {
								id: this.idGenerator(5),
								configs: {
									uniqueId: uniqueId,
								},
								styles: {
									whiteSpace: "pre",
									width: "150px",
									direction: "rtl",
								},
							},
						}
						break

					default:
						break
				}
				if (parent.includes("header")) {
					this.settings.header.headerElements.push(tmp)
				} else if (parent.includes("footer")) {
					this.settings.footer.footerElements.push(tmp)
				}
				this.locals.classType = ""
				this.locals.uniqueId = 0
				return
			},

			/**
			* Creates variable in variables tab list
			*/

			createVariable() {
				let tmp = {
					uniqueId: this.idGenerator(5),
					name: '',
					type: 'text',
					context: '',
				}
				this.locals.variables.push(tmp)
			},

			/**
			 * Empty the context on type change
			 */

			onVariableTypeChange(variable) {
				variable.context = ''
			},

			/**
			* Deletes variable in variables tab list
			*/

			deleteVariable(uniqueId) {
				let variablesList = this.locals.variables
				let footerElements = this.settings.footer.footerElements
				let headerElements = this.settings.header.headerElements

				function deleteFromHeader() {
					for (let index = 0; index < headerElements.length; index++) {
						if (headerElements[index].options.configs.uniqueId == uniqueId) {
							headerElements.splice(index, 1)
						}
					}
				}

				function deleteFromFooter() {
					for (let index = 0; index < footerElements.length; index++) {
						if (footerElements[index].options.configs.uniqueId == uniqueId) {
							footerElements.splice(index, 1)
						}
					}
				}

				for (let index = 0; index < variablesList.length; index++) {
					deleteFromHeader()
					deleteFromFooter()
					if (variablesList[index].uniqueId == uniqueId) {
						deleteFromHeader() // Checks if there is any variable with specific uniqueId left
						deleteFromFooter()
						variablesList.splice(index, 1)
					}
				}
			},

			startDraggingElement(classType, uniqueId) {
				this.locals.classType = classType
				this.locals.uniqueId = uniqueId
				let headerSection = this.$refs.headerTemplate
				headerSection.className = headerSection.className + " dragged"
				let footerSection = this.$refs.footerTemplate
				footerSection.className = footerSection.className + " dragged"
			},

			droppedElementOnHeader() {
				let parent = "header"
				this.createElement(parent)
			},

			droppedElementOnFooter() {
				let parent = "footer"
				this.createElement(parent)
			},

			finishedDraggingElement() {
				let headerSection = this.$refs.headerTemplate
				headerSection.classList.remove("dragged")
				let footerSection = this.$refs.footerTemplate
				footerSection.classList.remove("dragged")
			},

			onFileChange(uniqueId) {
				let maximumFileSize = this.configuration.maximumFileSize * 1000
				let that = this // Storing this value to be able to use it inside a function

				switch (this.locals.selectedElement.type) {
					case 'imageelement':
						let image = document.getElementById("elementImageFileControl").files[0]
						if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
							return alert('فرمت فایل انتخاب شده مجاز نمی باشد.')
						}

						if (image.size >= maximumFileSize) { // Check if the file size is under 1MB the image size value is in bytes
							return alert('سایز فایل عکس انتخاب شده باید کمتر از ۱ مگابایت باشد')
						}

						this.toBase64(image).then((res) => {
							this.locals.selectedElement.options.configs.imageSrc = res
						})

						break

					case 'variable':
						let variables = this.locals.variables
						let variable

						for (let index = 0; index < variables.length; index++) {
							if (variables[index].uniqueId == uniqueId) {
								variable = variables[index]
							}
						}
						image = document.getElementById("variableImageFileControl").files[0]

						if (image.type != "image/jpeg" || image.type != "image/png") {
							return alert('فرمت فایل مورد نظر قابل قبول نمی باشد.')
						}

						if (image.size >= maximumFileSize) { // Check if the file size is under 1MB the image size value is in bytes
							return alert('سایز فایل عکس مورد نظر بالای ۱ مگابایت است')
						}

						this.toBase64(image).then((res) => {
							variable.context = res
						})

						break

					default: // if its a source file

						let fileSrc = document.getElementById("fileSrcControl").files[0]

						if (!fileSrc.name.includes('.vp')) { // Checking the file type
							return alert('فرمت فایل پشتیبانی نمیشود فرمت فایل های قابل قبول: vp.*')
						}

						if (fileSrc.size >= maximumFileSize) { // Check if the file size is under 1MB the image size value is in bytes
							return alert('سایز فایل عکس مورد نظر بالای ۱ مگابایت است')
						}
						var fr = new FileReader()
						fr.readAsText(fileSrc)
						fr.onload = function () {
							that.importFromSrcFile(fr.result)
						}
						fr.onerror = function (err) {
							alert(err)
						}
						break
				}

			},

			/**
			 * Converts given image to base64
			 */

			toBase64(file) {
				return new Promise((resolve, reject) => {
					const reader = new FileReader()
					reader.readAsDataURL(file)
					reader.onload = () => resolve(reader.result)
					reader.onerror = (error) => reject(error)
				})
			},

			/**
			 * Generate a n digit uinique id
			 */

			idGenerator(n) {
				return Math.random().toString(36).substr(2, n)
			},

			/**
			 * Adds an event listenner on delete button and then removes the element 
			 */

			deletingElementOnPressingDeleteKey() {
				let headerElements = this.settings.header.headerElements
				let footerElements = this.settings.footer.footerElements
				document.addEventListener("keydown", deleteElement, false)
				document.removeEventListener("keyup", deleteElement, false)

				let that = this // Storing the value of this to be able to use it inside of the function

				function deleteElement(e) {
					if (e.code == "Delete") {
						let id = that.locals.clickedElementId
						for (let index = 0; index < headerElements.length; index++) {
							if (headerElements[index].options.id == id) {
								headerElements.splice(index, 1)
							}
						}
						for (let index = 0; index < footerElements.length; index++) {
							if (footerElements[index].options.id == id) {
								footerElements.splice(index, 1)
							}
						}
						that.locals.selectedElement = {
							type: {},
							options: {
								configs: {},
								styles: {},
							},
						}
					}
				}
			},

			/**
			 * Gets coordinates of the given element
			 */

			getCoordinates(id) {
				let tmp = document.getElementById(id)
				let compStyle = getComputedStyle(tmp)
				let top = compStyle.getPropertyValue("top")
				let left = compStyle.getPropertyValue("left")
				let height = compStyle.getPropertyValue("height")
				let width = compStyle.getPropertyValue("width")
				return {
					top: top,
					left: left,
					height: height,
					width: width,
				}
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
			},

			showModal() {
				document.getElementById("templateBuilderModal").style.display = "block"
			},

			finishedEditingElement(element) {
				let tmp = this.settings.header.headerElements.find(
					(x) => x.options.id == element.options.id
				)
				if (tmp) {
					Object.assign(
						tmp.options.styles,
						this.getCoordinates(element.options.id)
					)
					return
				}
				tmp = this.settings.footer.footerElements.find(
					(x) => x.options.id == element.options.id
				)
				Object.assign(
					tmp.options.styles,
					this.getCoordinates(element.options.id)
				)
				return
			},
			clickedOnInput(id) {
				document.getElementById(id).click()
			},

			/**
			 * Encode given data to base64
			 */

			encode2Base64(str) {
				{
					return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
						function toSolidBytes(match, p1) {
							return String.fromCharCode('0x' + p1)
						}))
				}
			},

			/**
			 * Decode given data from base64
			 */

			decodeFromBase64(str) {
				return decodeURIComponent(atob(str).split('').map(function (c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
				}).join(''))
			}
		},
	};
</script>

<style>
	@import "./css/templateBuilder.css";
	@import "./css/modal.css";
</style>