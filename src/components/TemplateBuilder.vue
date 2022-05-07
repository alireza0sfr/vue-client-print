<template>
	<div id="templateBuilderPage" :dir="settings.pageDirections">
		<!-- Preview Modal-->
		<div id="templateBuilderModal" class="print-modal">
			<div class="print-modal-content">
				<div class="print-modal-header">
					<div>
						<a @click="save()" :title="$t('template-builder.save')" class="modal-icon" href="#">
							<img src="@/assets/images/floppy-disk.png" />
						</a>
					</div>
					<div>
						<h3 class="title">{{ $t('template-builder.name') }}</h3>
					</div>

					<div>
						<span id="TemplateBuilderModalCloseBtn" class="close-btn">&times;</span>
					</div>
				</div>

				<!-- Section 1 (Template Builder) -->
				<div class="template-builder-container">
					<div class="toolbar-container">
						<div class="toolbar-content">
							<!-- Tabs -->
							<div class="tabs">
								<a class="tab selected" @click="switchTabs('settings', $refs.settings)" ref="settings">{{$t('template-builder.settings')}}</a>
								<a class="tab" @click="switchTabs('variables', $refs.variables)" ref="variables">{{ $t('template-builder.variables.variables') }}</a>
								<a class="tab" @click="switchTabs('others', $refs.others)" ref="others">{{ $t('template-builder.others') }}</a>
							</div>

							<!-- Variables Tab -->
							<div v-show="locals.tabName === 'variables'" class="variables-tab">
								<div class="toolbar-header variables-header" style="border-right: 1px solid #81c3ff">
									<span>{{ $t('template-builder.variables.list') }}</span>
								</div>
								<div class="variables-content-wrapper">
									<div @click="createVariable()" style="text-align: center; margin-top: 10px">
										<a class="a-btn">{{ $t('template-builder.variables.add') }}</a>
									</div>
									<div class="variables">
										<div :class="['variable',{selected:locals.selectedElement.options.configs.uniqueId ===variable.uniqueId}]" v-for="variable in locals.variables" :key="variable.uniqueId">
											<div class="variables-row">
												<div class="variables-row large">
													<div class="variables-content-field" style="width: 60%">
														<input type="text" v-model="variable.name" class="input-form-control" aria-label="Small" :placeholder="$t('template-builder.variables.name')" aria-describedby="inputGroup-sizing-sm" />
													</div>
													<div class="variables-content-field" style="width: 40%">
														<select class="input-form-control" v-model="variable.type" @change="onVariableTypeChange(variable)">
															<option value="text">{{ $t('template-builder.variables.text') }}</option>
															<option value="image">{{ $t('template-builder.variables.image') }}</option>
														</select>
													</div>
												</div>
												<div draggable="true" class="variables-content-field small" @dragstart="startDraggingElement('variable', variable.uniqueId)" @dragend="finishedDraggingElement()">
													<img style="height: 20px; width: 15px; cursor: move;" src="@/assets/images/drag.png" />
												</div>
											</div>
											<div class="variables-row">
												<div v-if="variable.type === 'text'" class="variables-content-field large">
													<input type="text" v-model="variable.context" class="input-form-control" aria-label="Small" :placeholder="$t('template-builder.variables.text')" aria-describedby="inputGroup-sizing-sm" />
												</div>
												<div class="variables-content-field large" v-if="variable.type === 'image'">
													<input type="file" accept="image/*" @change="onFileChange(variable.uniqueId)" aria-label="Small" aria-describedby="inputGroup-sizing-sm" id="variableImageFileControl" />
												</div>
												<div class="variables-content-field small">
													<img @click="deleteVariable(variable.uniqueId)" style="width: 15px; height: 15px" src="@/assets/images/cancel.png" />
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							<!-- Others Tab  -->
							<div v-show="locals.tabName === 'others'" class="others-tab">
								<div class="toolbar-header variables-header" style="border-right: 1px solid #81c3ff">
									<span>{{$t('template-builder.save')}}</span>
								</div>
								<div class="toolbar-content-row">
									<div style="width: 100%;" class="toolbar-content-field">
										<a class="a-btn" @click="export2SrcFile()">{{$t('template-builder.export')}}</a>
									</div>
								</div>
								<div class="toolbar-content-row">
									<div style="width: 100%;" class="toolbar-content-field">
										<a class="a-btn" @click="clickedOnInput('fileSrcControl')">{{$t('template-builder.import')}}</a>
									</div>
								</div>
								<div style="display:none" class="toolbar-content-row">
									<div class="variables-content-field">
										<input type="file" @change="onFileChange()" aria-label="Small" aria-describedby="inputGroup-sizing-sm" id="fileSrcControl" />
									</div>
								</div>
							</div>

							<!-- Settings Tab -->
							<div v-show="locals.tabName === 'settings'" class="settings-tab">

								<!-- Settings -->
								<div class="toolbar-header" style="border-right: 1px solid #81c3ff">
									<span>{{$t('template-builder.print-settings')}}</span>
								</div>
								<div class="toolbar-content-wrapper" id="printConfigsMenu">
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<span>{{$t('template-builder.template-name')}}</span>
										</div>
										<div class="toolbar-content-field">
											<input type="text" v-model="settings.designName" class="input-form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<label for="pageSizeControl">{{$t('template-builder.page-size')}}</label>
										</div>
										<div class="toolbar-content-field">
											<select class="input-form-control" v-model="settings.pageSize" @change="syncSizes()" id="pageSizeControl">
												<option value="a3">A3</option>
												<option value="a4">A4</option>
												<option value="a5">A5</option>
											</select>
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<label for="pageOrientiationsControl">{{$t('template-builder.page-orientation')}}</label>
										</div>
										<div class="toolbar-content-field">
											<select class="input-form-control" @change="syncSizes()" v-model="settings.orientation" id="pageOrientiationsControl">
												<option value="portrait">{{$t('template-builder.vertical')}}</option>
												<option value="landscape">{{$t('template-builder.horizental')}}</option>
											</select>
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<span>{{$t('template-builder.page-border')}}</span>
										</div>
										<div class="toolbar-content-field">
											<input type="text" class="input-form-control" v-model="settings.pageBorder" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<label for="repeatableHeaderControl">{{$t('template-builder.repeat-header')}}</label>
										</div>
										<div class="toolbar-content-field">
											<input class="input-form-control" type="checkbox" v-model="settings.header.isHeaderRepeatable" id="repeatableHeaderControl" />
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<label for="repeatableFooterControl">{{$t('template-builder.repeat-footer')}}</label>
										</div>
										<div class="toolbar-content-field">
											<input class="input-form-control" type="checkbox" v-model="settings.footer.isFooterRepeatable" id="repeatableFooterControl" />
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<span>{{$t('template-builder.page-direction')}}</span>
										</div>
										<div class="toolbar-content-field" style="text-align: right">
											<div>
												<label for="pageDirections">
													<input type="radio" name="pageDirections" id="pageDirections" value="rtl" v-model="settings.pageDirections" />
													{{$t('template-builder.elements.styles.right-to-left')}}
												</label>
											</div>
											<div>
												<label for="pageDirections">
													<input type="radio" name="pageDirections" id="pageDirections" value="ltr" v-model="settings.pageDirections" />
													{{$t('template-builder.elements.styles.left-to-right')}}
												</label>
											</div>
										</div>
									</div>
								</div>

								<!-- Elements -->
								<div class="toolbar-header">
									<span>{{$t('template-builder.elements.name')}}</span>
								</div>
								<div class="toolbar-content-wrapper" style="flex-direction: row" id="elementsMenu">
									<div class="toolbar-content-row-elements">
										<div class="toolbar-content-row-element">
											<span draggable="true" @dragstart="startDraggingElement('textelement')" @dragend="finishedDraggingElement()">
												<img src="@/assets/images/text.png" :alt="$t('template-builder.elements.text-box')" />
												<div class="element-title">{{$t('template-builder.elements.text-box')}}</div>
											</span>
										</div>
									</div>
									<div class="toolbar-content-row-elements">
										<div class="toolbar-content-row-element">
											<span draggable="true" @dragstart="startDraggingElement('datetime')" @dragend="finishedDraggingElement()">
												<img src="@/assets/images/timetable.png" :alt="$t('template-builder.elements.date-time')" />
												<div class="element-title">{{$t('template-builder.elements.date-time')}}</div>
											</span>
										</div>
									</div>
									<div class="toolbar-content-row-elements">
										<div class="toolbar-content-row-element">
											<span draggable="true" @dragstart="startDraggingElement('pagecounter')" @dragend="finishedDraggingElement()">
												<img src="@/assets/images/pages.png" :alt="$t('template-builder.elements.page-counter')" />
												<div class="element-title">{{$t('template-builder.elements.page-counter')}}</div>
											</span>
										</div>
									</div>
									<div class="toolbar-content-row-elements">
										<div class="toolbar-content-row-element">
											<span draggable="true" @dragstart="startDraggingElement('imageelement')" @dragend="finishedDraggingElement()">
												<img src="@/assets/images/image.png" alt="$t('template-builder.elements.image')" />
												<div class="element-title">{{$t('template-builder.elements.image')}}</div>
											</span>
										</div>
									</div>
									<div class="toolbar-content-row-elements">
										<div class="toolbar-content-row-element">
											<span draggable="true" @dragstart="startDraggingElement('bindingObject')" @dragend="finishedDraggingElement()">
												<img src="@/assets/images/binding.png" :alt="$t('template-builder.elements.binding-objects')" />
												<div class="element-title">{{$t('template-builder.elements.binding-objects')}}</div>
											</span>
										</div>
									</div>
									<div class="toolbar-content-row-elements">
										<div class="toolbar-content-row-element">
											<span draggable="true" @dragstart="startDraggingElement('textpattern')" @dragend="finishedDraggingElement()">
												<img src="@/assets/images/textpattern.png" :alt="$t('template-builder.elements.text-pattern')" />
												<div class="element-title">{{$t('template-builder.elements.text-pattern')}}</div>
											</span>
										</div>
									</div>
									<div class="toolbar-content-row-elements">
										<div class="toolbar-content-row-element">
											<span draggable="true" @dragstart="startDraggingElement('dataset')" @dragend="finishedDraggingElement()">
												<img src="@/assets/images/data-set.png" :alt="$t('template-builder.elements.dataset')" width="32" height="32" />
												<div class="element-title">{{$t('template-builder.elements.dataset')}}</div>
											</span>
										</div>
									</div>
									<div class="toolbar-content-row-elements">
										<div class="toolbar-content-row-element">
											<span draggable="true" @dragstart="startDraggingElement('repeator')" @dragend="finishedDraggingElement()">
												<img src="@/assets/images/repeat.png" :alt="$t('template-builder.elements.repeator')" width="32" height="32" />
												<div class="element-title">{{$t('template-builder.elements.repeator')}}</div>
											</span>
										</div>
									</div>
								</div>
								<div class="toolbar-header">

									<!-- Element's Settings -->
									<span>{{$t('template-builder.elements.settings')}}</span>
								</div>
								<div class="toolbar-content-wrapper">
									<div class="toolbar-content-row" v-if="locals.selectedElement.type === 'textelement'">
										<div style="text-align: center; width: 100%">
											<span>{{$t('template-builder.elements.configs.type-text')}}</span>
										</div>
									</div>
									<div class="toolbar-content-row" v-if="locals.selectedElement.type === 'textelement'">
										<div class="toolbar-content-field">
											<textarea :dir="settings.pageDirections" v-model="locals.selectedElement.options.configs.text" class="input-form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"></textarea>
										</div>
									</div>
									<div class="toolbar-content-row" v-if="locals.selectedElement.type === 'datetime'">
										<div class="toolbar-content-label">
											<label for="hasDateControl">{{$t('template-builder.elements.configs.date')}}</label>
										</div>
										<div class="toolbar-content-field">
											<input class="input-form-control" type="checkbox" v-model="locals.selectedElement.options.configs.hasDate" id="hasDateControl" />
										</div>
									</div>
									<div class="toolbar-content-row" v-if="locals.selectedElement.type === 'datetime'">
										<div class="toolbar-content-label">
											<label for="hasTimeControl">{{$t('template-builder.elements.configs.time')}}</label>
										</div>
										<div class="toolbar-content-field">
											<input class="input-form-control" type="checkbox" v-model="locals.selectedElement.options.configs.hasTime" id="hasTimeControl" />
										</div>
									</div>
									<div class="toolbar-content-row" v-if="locals.selectedElement.type === 'datetime'">
										<div class="toolbar-content-label">
											<label for="persiaDateControl">{{$t('template-builder.elements.configs.solar-date')}}</label>
										</div>
										<div class="toolbar-content-field">
											<input class="input-form-control" type="checkbox" v-model="locals.selectedElement.options.configs.persianDate" id="persiaDateControl" />
										</div>
									</div>
									<div class="toolbar-content-row" v-if="locals.selectedElement.type === 'pagecounter'">
										<div class="toolbar-content-label">
											<label for="persianNumbersControl">{{$t('template-builder.elements.configs.persian-digits')}}</label>
										</div>
										<div class="toolbar-content-field">
											<input type="checkbox" class="input-form-control" v-model="locals.selectedElement.options.configs.persianNumbers" id="persianNumbersControl" />
										</div>
									</div>
									<div class="toolbar-content-row" v-if="locals.selectedElement.type === 'pagecounter'">
										<div class="toolbar-content-label">
											<label for="completeFormControl">{{$t('template-builder.elements.configs.use-complete-format')}}</label>
										</div>
										<div class="toolbar-content-field">
											<input type="checkbox" class="input-form-control" v-model="locals.selectedElement.options.configs.completeForm" id="completeFormControl" />
										</div>
									</div>
									<div class="toolbar-content-row" style="flex-direction: column" v-if="locals.selectedElement.type === 'imageelement'">
										<label for="elementImageFileControl">{{$t('template-builder.elements.configs.upload-image-text')}}</label>
										<div class="imageelement-text">{{$t('template-builder.elements.configs.maximum-file-size')}}</div>
										<div class="imageelement-text">{{$t('template-builder.elements.configs.accepted-formats')}}</div>
										<div class="imageelement-text" style="direction: ltr; margin-top: 0px;">*.png, *. jpeg</div>
									</div>
									<div class="toolbar-content-row" v-if="locals.selectedElement.type === 'imageelement'">
										<div style="width: 100%;" class="toolbar-content-field">
											<a class="a-btn" @click="clickedOnInput('elementImageFileControl')">{{$t('template-builder.elements.configs.upload-image')}}</a>
										</div>
									</div>
									<div style="display: none;" class="toolbar-content-row" v-if="locals.selectedElement.type === 'imageelement'">
										<input style="margin-right: 21px;" type="file" accept="image/*" @change="onFileChange()" aria-label="Small" aria-describedby="inputGroup-sizing-sm" id="elementImageFileControl" />
									</div>
									<div class="toolbar-content-row" v-if="locals.selectedElement.type === 'bindingObject'">
										<div class="toolbar-content-label">
											<label for="bindingObjectPersianNumbersControl">{{$t('template-builder.elements.configs.persian-digits')}}</label>
										</div>
										<div class="toolbar-content-field">
											<input type="checkbox" class="input-form-control" v-model="locals.selectedElement.options.configs.persianNumbers" id="bindingObjectPersianNumbersControl" />
										</div>
									</div>
									<div class="toolbar-content-row" v-if="locals.selectedElement.type === 'bindingObject'">
										<div class="toolbar-content-label">
											<label for="bindingObjectControl">{{$t('template-builder.elements.configs.data-type')}}</label>
										</div>
										<div class="toolbar-content-field">
											<select class="input-form-control" v-model="locals.selectedElement.options.configs.field" id="bindingObjectControl">
												<option v-for="option in Object.keys(settings.bindingObject)" :key="option">{{ option }}</option>
											</select>
										</div>
									</div>
									<div class="toolbar-content-row" v-if="locals.selectedElement.type === 'textpattern'">
										<div style="text-align: center; width: 100%">
											<span>{{$t('template-builder.elements.configs.type-text')}}</span>
											<p>{{$t('template-builder.elements.configs.text-pattern-example', {name: '{name}'})}}</p>
										</div>
									</div>
									<div v-if="locals.selectedElement.type === 'textpattern'">
										<div class="toolbar-content-field">
											<textarea :dir="settings.pageDirections" v-model="locals.selectedElement.options.configs.text" class="input-form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"></textarea>
										</div>
									</div>
									<div class="toolbar-content-row" v-if="locals.selectedElement.type === 'textpattern'">
										<div class="toolbar-content-label">
											<label for="textPatternPersianNumbersControl">{{$t('template-builder.elements.configs.persian-digits')}}</label>
										</div>
										<div class="toolbar-content-field">
											<input :dir="settings.pageDirections" type="checkbox" class="input-form-control" v-model="locals.selectedElement.options.configs.persianNumbers" id="textPatternPersianNumbersControl" />
										</div>
									</div>
								</div>
								<div class="toolbar-content-row" v-if="locals.selectedElement.type === 'textpattern'">
									<div class="toolbar-content-label">
										<label for="textpatternControl">{{$t('template-builder.elements.configs.fields')}}</label>
									</div>
									<div class="toolbar-content-field">
										<select class="input-form-control" id="textpatternControl">
											<option v-for="option in Object.keys(settings.bindingObject)" :key="option">{{ option }}</option>
										</select>
									</div>
								</div>

								<div v-if="locals.selectedElement.type === 'row'">
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<label for="dataSetNameControl">{{$t('template-builder.elements.configs.stylesTarget')}}</label>
										</div>
										<div class="toolbar-content-field">
											<select v-model="locals.selectedElement.options.configs.stylesTarget" class="input-form-control" id="dataSetNameControl">
												<option v-for="option in locals.rowStylesTargets" :value="option.key" :key="option.id">{{ option.title }}</option>
											</select>
										</div>
									</div>

									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<label for="dataSetNameControl">{{$t('template-builder.elements.configs.rowsHeight')}}</label>
										</div>
										<div class="toolbar-content-field">
											<input type="number" class="input-form-control" v-model="locals.selectedElement.options.configs.rowsHeight" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
										</div>
									</div>
								</div>

								<div v-if="locals.selectedElement.type === 'dataset'">
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<label for="dataSetNameControl">{{$t('template-builder.elements.configs.datasets')}}</label>
										</div>
										<div class="toolbar-content-field">
											<select v-model="locals.selectedElement.options.configs.selectedDataSet" class="input-form-control" id="dataSetNameControl">
												<option v-for="option in Object.keys(settings.dataSets)" :value="option" :key="option">{{ settings.dataSets[option].title }}</option>
											</select>
										</div>
									</div>

									<div v-for="(col, index) in locals.selectedElement.options.configs.dataSets[locals.selectedElement.options.configs.selectedDataSet].options.configs.columns" :key="col.options.id" class="toolbar-content-row">
										<div :dir="settings.pageDirections" class="toolbar-content-label">
											<label style="margin-right: 10px; display:flex" :for="`dataSetColumnsControl${index}`">
												<input type="checkbox" class="input-form-control" v-model="col.isActive" :id="`dataSetColumnsControl${index}`" />
												{{$t('template-builder.elements.configs.index-column', {index: index+1})}}
											</label>
										</div>
										<div class="toolbar-content-field">
											<input type="text" :disabled="!col.isActive" class="input-form-control" v-model="col.title" id="dataSetColumnsName" />
										</div>
									</div>
								</div>

								<!-- Element's Styles -->
								<div style="margin-top: 15px" class="toolbar-header">
									<span>{{$t('template-builder.elements.styles.name')}}</span>
								</div>
								<div class="toolbar-content-wrapper" id="elementStylesMenu">
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<label for="elementTextAlignControl">{{$t('template-builder.elements.styles.text-align')}}</label>
										</div>
										<div class="toolbar-content-field">
											<select v-model="locals.selectedElement.options.styles.textAlign" class="input-form-control" id="elementTextAlignControl">
												<option value="right">{{$t('template-builder.elements.styles.right')}}</option>
												<option value="center">{{$t('template-builder.elements.styles.center')}}</option>
												<option value="left">{{$t('template-builder.elements.styles.left')}}</option>
											</select>
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<span>{{$t('template-builder.elements.styles.text-color')}}</span>
										</div>
										<div class="toolbar-content-field">
											<input type="color" class="input-form-control" v-model="locals.selectedElement.options.styles.color" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<span>{{$t('template-builder.elements.styles.background-color')}}</span>
										</div>
										<div class="toolbar-content-field">
											<input type="color" class="input-form-control" v-model="locals.selectedElement.options.styles.backgroundColor" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<span>{{$t('template-builder.elements.styles.font-size')}}</span>
										</div>
										<div class="toolbar-content-field">
											<select class="input-form-control" v-model="locals.selectedElement.options.styles.fontSize" id="pageSizeControl">
												<option v-for="option in locals.fontSizes" :key="option" :value="option + 'px'">{{ option }}</option>
											</select>
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<label for="fontWeightControl">{{$t('template-builder.elements.styles.font-weight')}}</label>
										</div>
										<div class="toolbar-content-field">
											<select v-model="locals.selectedElement.options.styles.fontWeight" class="input-form-control" id="elementTextAlignControl">
												<option value="normal">{{$t('template-builder.elements.styles.normal')}}</option>
												<option value="bold">{{$t('template-builder.elements.styles.bold')}}</option>
											</select>
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<span>{{$t('template-builder.elements.styles.font-family')}}</span>
										</div>
										<div class="toolbar-content-field">
											<input type="text" class="input-form-control" v-model="locals.selectedElement.options.styles.fontFamily" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<span>{{$t('template-builder.elements.styles.borders')}}</span>
										</div>
										<div class="toolbar-content-field" style="text-align: right">
											<label for="bordersAlldirections">
												<input class="input-form-control" style="display: inline-block" type="checkbox" v-model="locals.bordersAllDirections" id="bordersAlldirections" />
												{{$t('template-builder.elements.styles.border-on-all-directions')}}
											</label>
										</div>
									</div>
									<div class="toolbar-content-row" v-if="locals.bordersAllDirections">
										<div class="toolbar-content-label">
											<span>{{$t('template-builder.elements.styles.border-style')}}</span>
										</div>
										<div class="toolbar-content-field">
											<input type="text" class="input-form-control" v-model="locals.selectedElement.options.styles.border" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
										</div>
									</div>
									<div v-if="locals.bordersAllDirections === false" style="width: 100%">
										<div class="toolbar-content-row">
											<div class="toolbar-content-label">
												<span>{{$t('template-builder.elements.styles.border-top')}}</span>
											</div>
											<div class="toolbar-content-field">
												<input type="text" class="input-form-control" v-model="locals.selectedElement.options.styles.borderTop" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
											</div>
										</div>
										<div class="toolbar-content-row">
											<div class="toolbar-content-label">
												<span>{{$t('template-builder.elements.styles.border-right')}}</span>
											</div>
											<div class="toolbar-content-field">
												<input type="text" class="input-form-control" v-model="locals.selectedElement.options.styles.borderRight" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
											</div>
										</div>
										<div class="toolbar-content-row">
											<div class="toolbar-content-label">
												<span>{{$t('template-builder.elements.styles.border-bottom')}}</span>
											</div>
											<div class="toolbar-content-field">
												<input type="text" class="input-form-control" v-model="locals.selectedElement.options.styles.borderBottom" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
											</div>
										</div>
										<div class="toolbar-content-row">
											<div class="toolbar-content-label">
												<span>{{$t('template-builder.elements.styles.border-left')}}</span>
											</div>
											<div class="toolbar-content-field">
												<input type="text" class="input-form-control" v-model="locals.selectedElement.options.styles.borderLeft" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
											</div>
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<span>{{$t('template-builder.elements.styles.text-direction')}}</span>
										</div>
										<div class="toolbar-content-field" style="text-align: right">
											<label for="elementDirections">
												<div>
													<input type="radio" name="elementDirections" id="elementDirections" value="rtl" v-model="locals.selectedElement.options.styles.direction" />
													{{$t('template-builder.elements.styles.right-to-left')}}
												</div>
											</label>
											<label for="elementDirections2">
												<div>
													<input type="radio" name="elementDirections" id="elementDirections2" value="ltr" v-model="locals.selectedElement.options.styles.direction" />
													{{$t('template-builder.elements.styles.left-to-right')}}
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
						<div style="margin:-5px 10px 10px">
							<img src="@/assets/images/zoom-in.png" style="width: 16px" @click="locals.scale += 0.1" />
							<img src="@/assets/images/zoom-out.png" style="width: 16px" @click="locals.scale -= 0.1" />
						</div>
						<div class="template-container" :style="{'min-height': settings.defaultHeightOfPaper + 'in', width: settings.defaultWidthOfPaper + 'in','transform-origin': 'top right', transform: `scale(${locals.scale})`}">
							<div ref="template" :style="{width: '100%', height: '100%', border: settings.pageBorder}" class="template" @click="deSelectAll">
								<div :style="{height: settings.header.height + 'in', 'min-height': '0.15in'}" id="headerTemplate" class="section header" @drop="droppedElement('header')" @dragenter.prevent @dragover.prevent>
									<component v-for="element in settings.header.headerElements" :key="element.options.id" @drop="droppedElement('element', element, 'header')" @dragenter.prevent @dragover.prevent :is="element.type" :options="element.options" :variable="element.type === 'variable'? locals.variables.find(x =>x.uniqueId === element.options.configs.uniqueId): {}" @clickedOnElement="(child) => clickedOnElement(child ? child : element)" @finishedEditingElement="finishedEditingElement(element, 'header')" />
								</div>
								<div style="min-height: 0.15in" id="bodyTemplate" class="section body" @drop="droppedElement('body')" @dragenter.prevent @dragover.prevent>
									<component v-for="element in settings.body.bodyElements" :key="element.options.id" :is="element.type" :options="element.options" @drop="droppedElement('element', element, 'body')" @dragenter.prevent @dragover.prevent :variable="element.type === 'variable'? locals.variables.find(x =>x.uniqueId === element.options.configs.uniqueId): {}" @clickedOnElement="(child) => clickedOnElement(child ? child : element)" @finishedEditingElement="finishedEditingElement(element, 'body')" />
								</div>
								<div :style="{height: settings.footer.height + 'in', 'min-height': '0.15in'}" id="footerTemplate" class="section footer" @drop="droppedElement('footer')" @dragenter.prevent @dragover.prevent>
									<component v-for="element in settings.footer.footerElements" :key="element.options.id" :is="element.type" :options="element.options" @drop="droppedElement('element', element, 'footer')" @dragenter.prevent @dragover.prevent :variable="element.type === 'variable' ? locals.variables.find(x =>x.uniqueId === element.options.configs.uniqueId): {}" @clickedOnElement="(child) =>clickedOnElement(child ? child : element)" @finishedEditingElement="finishedEditingElement(element, 'footer')" />
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
	import Variable from '~/components/elements/Variable.vue'
	import TextElement from '~/components/elements/TextElement.vue'
	import DateTime from '~/components/elements/DateTime.vue'
	import BindingObject from '~/components/elements/BindingObject.vue'
	import PageCounter from '~/components/elements/PageCounter.vue'
	import ImageElement from '~/components/elements/ImageElement.vue'
	import TextPattern from '~/components/elements/TextPattern.vue'
	import DataSet from '~/components/elements/DataSet/DataSet.vue'
	import { saveAs } from 'file-saver'
	import DefaultLogo from '@/assets/images/logo.png'
	import Repeator from '~/components/elements/Repeator.vue'
	export default {
		name: "TemplateBuilder",
		props: {
			options: Object,
			configurations: Object,
		},
		components: {
			textelement: TextElement,
			datetime: DateTime,
			pagecounter: PageCounter,
			imageelement: ImageElement,
			bindingObject: BindingObject,
			textpattern: TextPattern,
			variable: Variable,
			dataset: DataSet,
			repeator: Repeator
		},
		data() {
			return {
				locals: {
					rowStylesTargets: [
						{
							key: 'all',
							id: this.idGenerator(5),
							title: this.$t('template-builder.elements.configs.all')
						},
						{
							key: 'even',
							id: this.idGenerator(5),
							title: this.$t('template-builder.elements.configs.even')
						},
						{
							key: 'odd',
							id: this.idGenerator(5),
							title: this.$t('template-builder.elements.configs.odd')
						},
					],
					copiedElement: null,
					scale: 1,
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
					selectedElement: this.getDefaultSelectedElementObject(),
					fontSizes: [8, 10, 12, 14, 16, 18, 20, 22, 24, 30, 36, 42, 50, 58, 66, 74],
				},
				settings: this.getDefaultSettings(),
			}
		},
		watch: {
			options: {
				deep: true,
				immediate: true,
				handler(val) {
					let rawSettings = this.getDefaultSettings()
					Object.assign(rawSettings, val)
					this.settings = rawSettings
				},
			}
		},
		mounted() {
			this.initCopyPaste()
			this.modalManager('templateBuilderModal', 'TemplateBuilderModalCloseBtn')
			this.keyboardHandler()
		},
		methods: {
			/**
			 * Init copy paste listenners.
			 */
			initCopyPaste() {
				document.addEventListener("keydown", this.copyCurrentElement, false)
				document.addEventListener("keyup", this.pasteCopiedElement, false)
			},
			/**
			 * Terminate copy paste listenners.
			 */
			terminateCopyPaste() {
				document.removeEventListener("keydown", this.copyCurrentElement, false)
				document.removeEventListener("keyup", this.pasteCopiedElement, false)
			},
			/**
			 * Copy selected element.
			 */
			copyCurrentElement(e) {
				if (e.keyCode == 67 && e.ctrlKey) // 67 = c
					this.locals.copiedElement = JSON.parse(JSON.stringify(this.locals.selectedElement))
			},
			/**
			 * Paste copied element.
			 */
			pasteCopiedElement(e) {
				if (e.keyCode == 86 && e.ctrlKey) { // 86 = v
					var parent = this.locals.selectedElement.options.parent
					var array = this.settings[parent][`${parent}Elements`]
					this.locals.copiedElement.options.id = this.idGenerator(5)
					this.locals.copiedElement.options.styles.top = '0px'
					array.push(this.locals.copiedElement)
				}
			},
			/**
			 * Creates default element object.
			 * @param {Object} - returns default selected element object
			 */
			getDefaultSelectedElementObject() {
				return {
					type: '',
					parent: 'body',
					options: {
						configs: {},
						styles: {},
					},
				}
			},
			/**
			 * set variable list.
			 * @param {Array} list - variable list
			 */
			setVariables(list) {
				this.locals.variables = list
			},

			/**
			 * sync the given settings with the defaults.
			 * @return {Object} - returns settings objects
			 */
			getDefaultSettings() {
				return {
					header: {
						isHeaderRepeatable: true,
						height: 1,
						headerElements: [],
					},
					body: {
						bodyElements: []
					},
					footer: {
						isFooterRepeatable: true,
						height: 1,
						footerElements: [],
					},
					defaultHeightOfPaper: 11.7, // Standard Height of the chosen paper in inch
					defaultWidthOfPaper: 8.26, // Standard Width of the chosen paper in inch
					totalHeightOfAPaper: 10.4, // Useable height for body tag
					designName: '',
					orientation: 'portrait',
					pageSize: 'a4',
					pageDirections: 'rtl',
					bindingObject: {},
					dataSets: {},
					pageBorder: '',
					maximumFileSize: 1000 // Maximum file size in KB
				}
			},

			/**
			 * Save Changes on TB close.
			 * @return {Object} - json file
			 */
			save() {
				// Closing the template builder modal after save
				let tmp = this.export2Json()
				document.getElementById("templateBuilderModal").style.display = "none"

				// this.terminateCopyPaste()

				if (this.settings.callback)
					this.settings.callback(tmp)
			},
			/**
			 * Exports settings to json a file.
			 * @return {Object} - json file
			 */
			export2Json() {
				// Syncing headerElements with the user chagnes
				let headerElements = this.settings.header.headerElements
				let footerElements = this.settings.footer.footerElements

				for (let index = 0; index < headerElements.length; index++) {
					let computedStyles = this.getCoordinates(headerElements[index].options.id)
					let elementStyles = headerElements[index].options.styles
					Object.assign(elementStyles, computedStyles)
				}

				for (let index = 0; index < footerElements.length; index++) {
					let computedStyles = this.getCoordinates(footerElements[index].options.id)
					let elementStyles = footerElements[index].options.styles
					Object.assign(elementStyles, computedStyles)
				}

				this.settings.totalHeightOfAPaper = this.settings.defaultHeightOfPaper - this.settings.header.height - this.settings.footer.height

				if (this.settings.totalHeightOfAPaper < 0)
					this.settings.totalHeightOfAPaper = 1.77

				let tmp = this.settings
				tmp.variables = this.locals.variables
				return tmp
			},

			/**
			 * Exports Data from given src file
			 */

			/**
			 * Exports settings to vcp file.
			 * @return {File} - save settings file in browser
			 */
			export2SrcFile() {
				let tmp = this.export2Json()
				tmp = this.encode2Base64(JSON.stringify(tmp)) // encoding the settings to export

				let designName = this.settings.designName === '' ? 'vue-print' : this.settings.designName
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
			 * Imports settings from src file and assign merge with settings.
			 * @param {srcFile} srcFile - given srcFile
			 * @return {void} - void
			 */
			importFromSrcFile(srcFile) {
				this.settings = this.getDefaultSettings() // Set the settings to default value
				Object.assign(this.settings, JSON.parse(this.decodeFromBase64(srcFile))) // assign the changes

				if (this.settings.variables)
					this.setVariables(this.settings.variables)
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
			 * sync the sizes based upon the selected page orientation and format.
			 * @return {void} - void
			 */
			syncSizes() {

				const errorValue = 0.2 // Subtracting this value to make the pages more accurate

				this.settings.defaultHeightOfPaper = this.locals.pageSizeDictionary[this.settings.orientation][this.settings.pageSize]["height"] // Gettings the default sizes from the base dic
				this.settings.totalHeightOfAPaper = this.settings.defaultHeightOfPaper - this.settings.footer.height - this.settings.header.height - errorValue
				this.settings.defaultWidthOfPaper = this.locals.pageSizeDictionary[this.settings.orientation][this.settings.pageSize]["width"]
			},

			/**
			 * Initializing dragging settings
			 */
			settingsInitFunc() {
				setTimeout(() => {
					this.dragManager(['header', 'footer'])
					this.locals.scale = 1
				}, 100)
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
			 * Init drag functionality for sections.
			 * @return {void} - void
			 */
			dragManager(sections) {

				for (let sectionName of sections) {
					let section = document.getElementsByClassName(`section ${sectionName}`)[0] // element to make resizable

					var resizer = document.createElement("div")
					resizer.className = "resizer"
					resizer.style.height = "10px"
					section.appendChild(resizer)
					resizer.addEventListener("mousedown", (e) => initDrag(e, section), false)

					var startY, startHeight

					let that = this // Storing this value to that to be able to use it inside of the functions

					function initDrag(e, section) {
						startY = e.clientY

						startHeight = parseInt(document.defaultView.getComputedStyle(section).height, 10)

						document.documentElement.addEventListener("mousemove", doDrag, false)
						document.documentElement.addEventListener("mouseup", stopDrag, false)
					}

					function doDrag(e) {
						if (sectionName === 'header')
							that.settings.header.height = that.convert2Inches(startHeight + e.clientY - startY)
						else
							that.settings.footer.height = that.convert2Inches(startHeight - e.clientY + startY)

					}

					function stopDrag(e) {
						document.documentElement.removeEventListener("mousemove", doDrag, false)
						document.documentElement.removeEventListener("mouseup", stopDrag, false)
					}
				}
			},

			/**
			 * Swtich between tabs in toolbar.
			 * @param {String} tabName - tab name
			 * @param {HTMLElement} tab - selected tab element
			 * @return {void} - void
			 */
			switchTabs(tabName, tab) {
				let slecetdTab = document.getElementsByClassName('tab selected')[0]
				slecetdTab.classList.remove('selected')
				tab.classList.add('selected')
				this.locals.tabName = tabName
			},

			/**
			 * Deselect all selected elements.
			 * @return {void} - void
			 */
			deSelectAll() {
				if (this.locals.isClicked) {
					this.locals.isClicked = false
					return
				}

				this.locals.selectedElement = this.getDefaultSelectedElementObject()
				let selectedElements = document.getElementsByClassName("element selected")
				for (let index = 0; index < selectedElements.length; index++) {
					selectedElements[index].classList.remove("selected")
				}
			},

			/**
			 * Clicked on element.
			 * @param {HTMLElement} element - element
			 * @return {void} - void
			 */
			clickedOnElement(element) {
				console.log(element)
				this.locals.selectedElement = element
				this.locals.clickedElementId = element.options.id
				this.locals.isClicked = true
			},

			/**
			 * create element.
			 * @param {HTMLElement} parent - parent
			 * @return {void} - void
			 */
			createElement(parent) {
				let classType = this.locals.classType
				let uniqueId = this.locals.uniqueId
				let tmp

				switch (classType) {
					case 'repeator':
						tmp = {
							type: classType,
							options: {
								id: this.idGenerator(5),
								parent: parent,
								grandParent: 'TemplateBuilder',
								configs: {
									appendedElements: []
								},
								styles: {}
							}
						}
						break
					case 'dataset':
						var keys = Object.keys(this.settings.dataSets)
						tmp = {
							type: classType,
							options: {
								parent: parent,
								grandParent: 'TemplateBuilder',
								configs: {
									selectedDataSet: keys[0],
									dataSets: {},
									stylesTarget: 'all',
									defaultRow: [
										{
											type: 'row',
											options: {
												id: this.idGenerator(5),
												parent: this.options.parent,
												styles: {},
												configs: {
													cells: {
														center: {
															type: 'cell',
															isActive: true,
															options: {
																id: this.idGenerator(5),
																styles: {},
																parent: this.options.parent,
																configs: {
																	value: ''
																},
															}
														}
													}
												}
											}
										},
									]
								},
								id: this.idGenerator(5),
								styles: {
									height: "100px",
								},
							},
						}

						for (let set of keys) {
							var thisSet = JSON.parse(JSON.stringify(this.settings.dataSets[set])) // removing refrence to the original data

							for (let col of thisSet.columns) {
								col.isActive = true
								col.options.id = this.idGenerator(5)
								col.hasResizer = thisSet.columns.indexOf(col) !== thisSet.columns.length - 1
								col.type = 'column'
								col.options.parent = parent
							}


							/** converting normal row object to dataset row objects
							 * Sample Row:
							 * [
							 *   {
								*   center: 'center 1'
								*  }
								* ]
							 * 
							 * Sample Converted Row:
							 * 
							 * [
							 *  {
							 *	type: 'row',
									options: {
										id: this.idGenerator(5),
										parent: parent,
										styles: {},
									},
										configs: {
											cells: {
												center : {
													type: 'cell',
													isActive: true,
													options: {
														id: this.idGenerator(5),
														styles: {},
														parent: parent,
														configs: {
															value: ''
														},
													}
												}
											}
										}
									}
							 *  ]
							 */
							for (let index = 0; index < thisSet.rows.length; index++) {
								var objectKeys = Object.keys(thisSet.rows[index])
								var tempRow = {
									type: 'row',
									options: {
										id: this.idGenerator(5),
										parent: parent,
										styles: {},
										configs: {
											cells: {}
										}
									},
								}

								for (let key of objectKeys) {
									tempRow.options.configs.cells[key] = {
										type: 'cell',
										isActive: true,
										options: {
											id: this.idGenerator(5),
											styles: {},
											parent: parent,
											configs: {
												value: thisSet.rows[index][key]
											},
										}
									}
								}
								thisSet.rows[index] = tempRow
							}
							tmp.options.configs.dataSets[set] = {
								options: {
									id: thisSet.id,
									parent: parent,
									grandParent: 'TemplateBuilder',
									configs: {
										rows: thisSet.rows,
										columns: thisSet.columns,
										title: thisSet.title,
										key: thisSet.key
									},
									styles: thisSet.styles || {},
								}
							}
						}
						break
					case 'textelement':
						tmp = {
							type: classType,
							options: {
								id: this.idGenerator(5),
								parent: parent,
								grandParent: 'TemplateBuilder',
								configs: { text: this.$t('template-builder.elements.configs.type-text') },
								styles: {
									whiteSpace: "pre",
									width: "150px",
									direction: this.settings.pageDirections,
									fontWeight: "",
								},
							},
						}
						break

					case 'datetime':
						tmp = {
							type: classType,
							options: {
								parent: parent,
								grandParent: 'TemplateBuilder',
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
								parent: parent,
								grandParent: 'TemplateBuilder',
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
								parent: parent,
								grandParent: 'TemplateBuilder',
								id: this.idGenerator(5),
								configs: { imageSrc: DefaultLogo },
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
								parent: parent,
								grandParent: 'TemplateBuilder',
								id: this.idGenerator(5),
								configs: {
									persianNumbers: false,
									field: "",
									bindingObject: {},
								},
								styles: {
									whiteSpace: "pre",
									width: "150px",
									direction: this.settings.pageDirections,
								},
							},
						}
						break

					case 'textpattern':
						tmp = {
							type: classType,
							options: {
								parent: parent,
								grandParent: 'TemplateBuilder',
								id: this.idGenerator(5),
								configs: {
									persianNumbers: false,
									text: this.$t('template-builder.elements.configs.pattern-input'),
									value: null,
								},
								styles: {
									whiteSpace: "pre",
									width: "150px",
									direction: this.settings.pageDirections,
								},
							},
						}
						break

					case 'variable':
						tmp = {
							type: classType,
							options: {
								parent: parent,
								grandParent: 'TemplateBuilder',
								id: this.idGenerator(5),
								configs: {
									uniqueId: uniqueId,
								},
								styles: {
									whiteSpace: "pre",
									width: "150px",
									direction: this.settings.pageDirections,
								},
							},
						}
						break

					default:
						break
				}
				return tmp
			},

			/**
			 * Creates variable in variables tab list.
			 * @return {void} - void
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
			 * Delete the variable context on type change.
			 * @param {variable} variable - variable object
			 * @return {void} - void
			 */
			onVariableTypeChange(variable) {
				variable.context = ''
			},

			/**
			 * Deletes variable in variables tab list.
			 * @param {uniqueId} uniqueId - variable unique id
			 * @return {void} - void
			 */
			deleteVariable(uniqueId) {
				let variablesList = this.locals.variables
				let footerElements = this.settings.footer.footerElements
				let headerElements = this.settings.header.headerElements

				function deleteFromHeader() {
					for (let index = 0; index < headerElements.length; index++) {
						if (headerElements[index].options.configs.uniqueId === uniqueId)
							headerElements.splice(index, 1)
					}
				}

				function deleteFromFooter() {
					for (let index = 0; index < footerElements.length; index++) {
						if (footerElements[index].options.configs.uniqueId === uniqueId)
							footerElements.splice(index, 1)
					}
				}

				deleteFromHeader()
				deleteFromFooter()

				let index = variablesList.findIndex(x => x.uniqueId === uniqueId)
				if (index > -1)
					variablesList.splice(index, 1)
			},


			/**
			 * Method that triggers on element drag.
			 * @param {classType} classType - element classType
			 * @param {uniqueId} uniqueId - element unique id
			 * @return {void} - void
			 */
			startDraggingElement(classType, uniqueId) {
				this.locals.classType = classType
				this.locals.uniqueId = uniqueId
				this.$refs.template.className += " dragged"
			},

			/**
			 * Method that triggers on element drop on header / footer.
			 */
			droppedElement(parent, parentElement, grandParent) {

				if (!this.locals.classType)
					return

				var computedParent = parentElement ? grandParent : parent
				let elem = this.createElement(computedParent)

				if (parentElement) {// Element is dropped on another element.
					parentElement.options.configs.appendedElements.push(elem)
				}
				else
					this.settings[parent][`${parent}Elements`].push(elem)

				this.locals.classType = ""
				this.locals.uniqueId = 0
			},

			/**
			 * Method that triggers when drag is finished
			 */
			finishedDraggingElement() {
				this.$refs.template.classList.remove("dragged")
			},

			/**
			 * Method that triggers on file change.
			 * @param {uniqueId} uniqueId - variable | element unique id
			 * @return {void} - void
			 */
			onFileChange(uniqueId) {
				let maximumFileSize = this.configurations.maximumFileSize * 1000
				let that = this // Storing this value to be able to use it inside a function

				switch (this.locals.selectedElement.type) {
					case 'imageelement':
						let image = document.getElementById("elementImageFileControl").files[0]

						if (image.type !== 'image/jpeg' && image.type !== 'image/png')
							return alert('فرمت فایل انتخاب شده مجاز نمی باشد.')

						if (image.size >= maximumFileSize) // Check if the file size is under 1MB the image size value is in bytes
							return alert('سایز فایل عکس انتخاب شده باید کمتر از ۱ مگابایت باشد')

						this.toBase64(image).then((res) => {
							this.locals.selectedElement.options.configs.imageSrc = res
						})
						break

					case 'variable':
						let variables = this.locals.variables
						let variable

						for (let index = 0; index < variables.length; index++) {
							if (variables[index].uniqueId === uniqueId) {
								variable = variables[index]
							}
						}
						image = document.getElementById("variableImageFileControl").files[0]

						if (image.type !== "image/jpeg" || image.type !== "image/png")
							return alert('فرمت فایل مورد نظر قابل قبول نمی باشد.')

						if (image.size >= maximumFileSize) // Check if the file size is under 1MB the image size value is in bytes
							return alert('سایز فایل عکس مورد نظر بالای ۱ مگابایت است')

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
			 * Converts given image to base64.
			 * @param {File} file - image
			 * @return {*} - base64 of image
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
			 * Converts given image to base64.
			 * @param {Number} n - number of digits
			 * @return {String} - id
			 */
			idGenerator(n) {
				return Math.random().toString(36).substr(2, n)
			},

			/**
			 * Adds an event listenner on delete button and then removes the element
			 */
			keyboardHandler() {
				const toFloatVal = (val) => {
					if (val)
						return parseFloat(val.split('p')[0])
				}
				const elementStyleChanger = (style, operator, e) => {
					e.preventDefault()
					this.locals.selectedElement.options.styles[style] = toFloatVal(this.locals.selectedElement.options.styles[style])
					this.locals.selectedElement.options.styles[style] = eval(`${this.locals.selectedElement.options.styles[style]} ${operator} 1`)
					this.locals.selectedElement.options.styles[style] = this.locals.selectedElement.options.styles[style] + 'px'
				}
				const keyBinds = (e) => {
					if (e.code === "Delete") { // element delete

						if (this.locals.selectedElement.type === 'column') {  // it's a column.
							this.locals.selectedElement.isActive = false
							return
						}

						if (this.locals.selectedElement.type === 'row')  // it's a row.
							return

						var parent = this.locals.selectedElement.options.parent
						var array = this.settings[parent][`${parent}Elements`]

						if (!parent)
							return


						// it's a normal element.
						let id = this.locals.clickedElementId

						let index = array.findIndex(x => x.options.id === id)

						if (index > -1) {
							array.splice(index, 1)
							this.locals.selectedElement = this.getDefaultSelectedElementObject()
						}
					}
					else if (e.ctrlKey) { // element resize
						if (e.code === 'ArrowRight')
							elementStyleChanger('width', '+', e)
						else if (e.code === 'ArrowLeft')
							elementStyleChanger('width', '-', e)
						else if (e.code === 'ArrowUp')
							elementStyleChanger('height', '-', e)
						else if (e.code === 'ArrowDown')
							elementStyleChanger('height', '+', e)
					}
					else if (e.code === 'ArrowRight') { // element drag
						elementStyleChanger('left', '+', e)
					}
					else if (e.code === 'ArrowLeft')
						elementStyleChanger('left', '-', e)
					else if (e.code === 'ArrowUp')
						elementStyleChanger('top', '-', e)
					else if (e.code === 'ArrowDown')
						elementStyleChanger('top', '+', e)
				}
				document.removeEventListener('keyup', keyBinds, false)
				document.addEventListener('keydown', keyBinds, false)
			},

			/**
			 * Gets coordinates of the given element.
			 * @param {Number} id - element id
			 * @return {Object} - return Coordination
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
			},

			/**
			 * function to display modal
			 */
			showModal() {
				document.getElementById("templateBuilderModal").style.display = "block"
			},

			/**
			 * function that triggers while editing is finished.
			 * @param {HTMLElment} element - element
			 * @return {void} - void
			 */
			finishedEditingElement(element, elementLocation) {
				let elem = this.settings[elementLocation][`${elementLocation}Elements`].find(x => x.options.id === element.options.id)
				Object.assign(elem.options.styles, this.getCoordinates(element.options.id))
			},

			/**
			 * function that triggers when clicked on input.
			 * @param {Number} id - element id
			 * @return {void} - void
			 */
			clickedOnInput(id) {
				document.getElementById(id).click()
			},

			/**
			 * encode given string to base64.
			 * @param {String} str - string
			 * @return {*} - base64
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
			 * decode given string to base64.
			 * @param {String} str - string
			 * @return {*} - base64
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
	@import "~/assets/styles/templateBuilder.css";
	@import "~/assets/styles/modal.css";
</style>
