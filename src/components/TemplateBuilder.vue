<template>
	<div id="templateBuilderPage" :dir="settings.pageDirections">
		<!-- Preview Modal-->
		<div @click="deselectSection" id="templateBuilderModal" tabindex="0" class="vcp-modal">
			<div id="fullscreenControl" class="vcp-modal-content">
				<div class="vcp-modal-header">
					<div>
						<a @click="save" :title="_$t('template-builder.save')" class="vcp-modal-icon" href="#">
							<img src="@/assets/images/floppy-disk.png" />
						</a>
					</div>
					<div>
						<h3 class="vcp-modal-title">{{ _$t('template-builder.name') }}</h3>
					</div>

					<div>
						<span id="TemplateBuilderModalCloseBtn" @click="closeModal('templateBuilderModal')" class="vcp-modal-close-btn">&times;</span>
					</div>
				</div>

				<div class="vcp-template-builder-container">

					<!-- Section 1 (Template Builder) -->
					<div class="vcp-toolbar-container">
						<div class="toolbar-content">
							<!-- Tabs -->
							<div class="vcp-tabs">
								<a class="vcp-tab" @click="switchTabs(locals.tabs.SETTINGS)" ref="settings">{{_$t('template-builder.settings')}}</a>
								<a class="vcp-tab" @click="switchTabs(locals.tabs.VARIABLES)" ref="variables">{{ _$t('template-builder.variables.variables') }}</a>
								<a class="vcp-tab" @click="switchTabs(locals.tabs.OTHERS)" ref="others">{{ _$t('template-builder.others') }}</a>
							</div>

							<!-- Variables Tab -->
							<div v-show="locals.activeTab === locals.tabs.VARIABLES">
								<div class="vcp-toolbar-header" style="border-right: 1px solid #81c3ff">
									<span>{{ _$t('template-builder.variables.list') }}</span>
								</div>
								<div class="vcp-toolbar-content-wrapper">
									<div class="vcp-toolbar-content-row">
										<div class="vcp-toolbar-content-field w-100">
											<a @click="createVariable" class="vcp-button">{{ _$t('template-builder.variables.add') }}</a>
										</div>
									</div>
									<div :id="`${locals.elementType.VARIABLE}_Settings`" class="vcp-variables settings-section">
										<div :class="['vcp-variable',{selected:locals.selectedElement.configs.variableId === variable.variableId}]" v-for="variable in variablesList" :key="variable.variableId">
											<div class="vcp-variables-row">
												<div class="vcp-variables-row vcp-large">
													<div class="vcp-variables-content-field" style="width: 60%">
														<input type="text" v-model="variable.name" aria-label="Small" :placeholder="_$t('template-builder.variables.name')" aria-describedby="inputGroup-sizing-sm" />
													</div>
													<div class="vcp-variables-content-field" style="width: 40%">
														<select v-model="variable.variableType" @change="onVariableTypeChange(variable)">
															<option v-for="option in locals.VariableTypes" :value="option" :key="option">{{ _$t(`template-builder.variables.${option}`) }}</option>
														</select>
													</div>
												</div>
												<div draggable="true" class="vcp-variables-content-field vcp-small" @dragstart="startDraggingElement(locals.ElementTypes.VARIABLE, variable)"
													@dragend="finishedDraggingElement()">
													<img style="height: 20px; width: 15px; cursor: move;" src="@/assets/images/drag.png" />
												</div>
											</div>
											<div class="vcp-variables-row" style="justify-content: flex-end;">
												<div v-if="variable.variableType === locals.VariableTypes.TEXT" class="vcp-variables-content-field vcp-large">
													<input type="text" v-model="variable.context" aria-label="Small" :placeholder="_$t('template-builder.variables.text')" aria-describedby="inputGroup-sizing-sm" />
												</div>
												<div class="vcp-variables-content-field vcp-large" v-if="variable.variableType === locals.VariableTypes.IMAGE">
													<input type="file" accept="image/*" @change="onFileChange(locals.fileEntryTypes.imageVariable, variable)" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
														id="variableImageFileControl" />
												</div>
												<div class="vcp-variables-content-field vcp-small">
													<img @click="deleteVariable(variable.variableId)" style="width: 15px; height: 15px" src="@/assets/images/cancel.png" />
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							<!-- Others Tab  -->
							<div v-show="locals.activeTab === locals.tabs.OTHERS" class="others-tab">
								<div class="vcp-toolbar-header" style="border-right: 1px solid #81c3ff">
									<span>{{_$t('template-builder.save')}}</span>
								</div>
								<div class="vcp-toolbar-content-wrapper">
									<div class="vcp-toolbar-content-row">
										<div class="vcp-toolbar-content-field w-100">
											<a class="vcp-button" @click="export2SrcFile()">{{_$t('template-builder.export')}}</a>
										</div>
									</div>
									<div class="vcp-toolbar-content-row">
										<div class="vcp-toolbar-content-field w-100">
											<a class="vcp-button" @click="clickedOnInput('fileSrcControl')">{{_$t('template-builder.import')}}</a>
										</div>
									</div>
									<div style="display:none" class="vcp-toolbar-content-row">
										<div class="vcp-variables-content-field">
											<input type="file" accept=".vcp" @change="onFileChange(locals.fileEntryTypes.VCPSrcFile)" aria-label="Small" aria-describedby="inputGroup-sizing-sm" id="fileSrcControl" />
										</div>
									</div>
								</div>
							</div>

							<!-- Settings Tab -->
							<div v-show="locals.activeTab === locals.tabs.SETTINGS" class="settings-tab">

								<!-- Settings -->
								<div class="vcp-toolbar-header" style="border-right: 1px solid #81c3ff">
									<span>{{_$t('template-builder.print-settings')}}</span>
								</div>
								<div class="vcp-toolbar-content-wrapper" id="printConfigsMenu">
									<div class="vcp-toolbar-content-row">
										<div class="vcp-toolbar-content-label">
											<span>{{_$t('template-builder.template-name')}}</span>
										</div>
										<div class="vcp-toolbar-content-field">
											<input type="text" v-model="settings.designName" class="vcp-input-form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
										</div>
									</div>
									<div class="vcp-toolbar-content-row">
										<div class="vcp-toolbar-content-label">
											<span>{{_$t('template-builder.language')}}</span>
										</div>
										<div class="vcp-toolbar-content-field">
											<select class="vcp-input-form-control" v-model="_$i18n.locale">
												<option v-for="(lang, i) in locals.langs" :key="`Lang${i}`" :value="lang">
													{{ lang }}
												</option>
											</select>
										</div>
									</div>
									<div class="vcp-toolbar-content-row">
										<div class="vcp-toolbar-content-label">
											<label for="pageSizeControl">{{_$t('template-builder.page-size')}}</label>
										</div>
										<div class="vcp-toolbar-content-field">
											<select class="vcp-input-form-control" v-model="settings.pageSize" @change="syncSizes()" id="pageSizeControl">
												<option value="a3">A3</option>
												<option value="a4">A4</option>
												<option value="a5">A5</option>
											</select>
										</div>
									</div>
									<div class="vcp-toolbar-content-row">
										<div class="vcp-toolbar-content-label">
											<label for="pageOrientiationsControl">{{_$t('template-builder.page-orientation')}}</label>
										</div>
										<div class="vcp-toolbar-content-field">
											<select class="vcp-input-form-control" @change="syncSizes()" v-model="settings.orientation" id="pageOrientiationsControl">
												<option value="portrait">{{_$t('template-builder.vertical')}}</option>
												<option value="landscape">{{_$t('template-builder.horizental')}}</option>
											</select>
										</div>
									</div>
									<div class="vcp-toolbar-content-row">
										<div class="vcp-toolbar-content-label">
											<span>{{_$t('template-builder.page-border')}}</span>
										</div>
										<div class="vcp-toolbar-content-field">
											<input type="text" class="vcp-input-form-control" v-model="settings.pageBorder" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
										</div>
									</div>
									<div class="vcp-toolbar-content-row">
										<div class="vcp-toolbar-content-label">
											<label for="repeatableHeaderControl">{{_$t('template-builder.repeat-header')}}</label>
										</div>
										<div class="vcp-toolbar-content-field">
											<input class="vcp-input-form-control" type="checkbox" v-model="settings.header.repeatable" id="repeatableHeaderControl" />
										</div>
									</div>
									<div class="vcp-toolbar-content-row">
										<div class="vcp-toolbar-content-label">
											<label for="repeatableFooterControl">{{_$t('template-builder.repeat-footer')}}</label>
										</div>
										<div class="vcp-toolbar-content-field">
											<input class="vcp-input-form-control" type="checkbox" v-model="settings.footer.repeatable" id="repeatableFooterControl" />
										</div>
									</div>
									<div class="vcp-toolbar-content-row">
										<div class="vcp-toolbar-content-label">
											<span>{{_$t('template-builder.page-direction')}}</span>
										</div>
										<div class="vcp-toolbar-content-field" style="text-align: right">
											<div>
												<label for="pageDirections">
													<input type="radio" name="pageDirections" id="pageDirections" value="rtl" v-model="settings.pageDirections" />
													{{_$t('template-builder.elements.styles.right-to-left')}}
												</label>
											</div>
											<div>
												<label for="pageDirections">
													<input type="radio" name="pageDirections" id="pageDirections" value="ltr" v-model="settings.pageDirections" />
													{{_$t('template-builder.elements.styles.left-to-right')}}
												</label>
											</div>
										</div>
									</div>
								</div>

								<!-- Elements -->
								<div class="vcp-toolbar-header">
									<span>{{_$t('template-builder.elements.name')}}</span>
								</div>
								<div class="vcp-toolbar-content-wrapper" style="flex-direction: row" id="elementsMenu">
									<div class="vcp-toolbar-content-row m-0">
										<div class="vcp-element-draggable">
											<span draggable="true" @dragstart="startDraggingElement(locals.ElementTypes.TEXTELEMENT)" @dragend="finishedDraggingElement()">
												<img src="@/assets/images/text.png" :alt="_$t('template-builder.elements.textelement')" />
												<div class="element-title">{{_$t('template-builder.elements.textelement')}}</div>
											</span>
										</div>
										<div class="vcp-element-draggable">
											<span draggable="true" @dragstart="startDraggingElement(locals.ElementTypes.DATETIME)" @dragend="finishedDraggingElement()">
												<img src="@/assets/images/timetable.png" :alt="_$t('template-builder.elements.datetime')" />
												<div class="element-title">{{_$t('template-builder.elements.datetime')}}</div>
											</span>
										</div>
									</div>
									<div class="vcp-toolbar-content-row m-0">
										<div class="vcp-element-draggable">
											<span draggable="true" @dragstart="startDraggingElement(locals.ElementTypes.PAGECOUNTER)" @dragend="finishedDraggingElement()">
												<img src="@/assets/images/pages.png" :alt="_$t('template-builder.elements.pagecounter')" />
												<div class="element-title">{{_$t('template-builder.elements.pagecounter')}}</div>
											</span>
										</div>
										<div class="vcp-element-draggable">
											<span draggable="true" @dragstart="startDraggingElement(locals.ElementTypes.IMAGEELEMENT)" @dragend="finishedDraggingElement()">
												<img src="@/assets/images/image.png" alt="_$t('template-builder.elements.imageelement')" />
												<div class="element-title">{{_$t('template-builder.elements.imageelement')}}</div>
											</span>
										</div>
									</div>
									<div class="vcp-toolbar-content-row m-0">
										<div class="vcp-element-draggable">
											<span draggable="true" @dragstart="startDraggingElement(locals.ElementTypes.BINDINGOBJECT)" @dragend="finishedDraggingElement()">
												<img src="@/assets/images/binding.png" :alt="_$t('template-builder.elements.bindingobject')" />
												<div class="element-title">{{_$t('template-builder.elements.bindingobject')}}</div>
											</span>
										</div>
										<div class="vcp-element-draggable">
											<span draggable="true" @dragstart="startDraggingElement(locals.ElementTypes.TEXTPATTERN)" @dragend="finishedDraggingElement()">
												<img src="@/assets/images/textpattern.png" :alt="_$t('template-builder.elements.textpattern')" />
												<div class="element-title">{{_$t('template-builder.elements.textpattern')}}</div>
											</span>
										</div>
									</div>
									<div class="vcp-toolbar-content-row m-0">
										<div class="vcp-element-draggable">
											<span draggable="true" @dragstart="startDraggingElement(locals.ElementTypes.DATASET)" @dragend="finishedDraggingElement()">
												<img src="@/assets/images/data-set.png" :alt="_$t('template-builder.elements.dataset')" width="32" height="32" />
												<div class="element-title">{{_$t('template-builder.elements.dataset')}}</div>
											</span>
										</div>
										<div class="vcp-element-draggable">
											<span draggable="true" @dragstart="startDraggingElement(locals.ElementTypes.REPEATOR)" @dragend="finishedDraggingElement()">
												<img src="@/assets/images/repeat.png" :alt="_$t('template-builder.elements.repeator')" width="32" height="32" />
												<div class="element-title">{{_$t('template-builder.elements.repeator')}}</div>
											</span>
										</div>
									</div>
								</div>

								<!-- Element's Settings -->
								<div v-if="locals.selectedElement.type !== locals.ElementTypes.EMPTY && locals.selectedElement.type !== locals.ElementTypes.VARIABLE">
									<div class="vcp-toolbar-header">
										<span>{{_$t('template-builder.elements.settings', {elementType: _$t(`template-builder.elements.${locals.selectedElement.type}`)})}}</span>
									</div>

									<div class="vcp-toolbar-content-wrapper">

										<div v-if="locals.selectedElement.type === locals.ElementTypes.TEXTELEMENT" :id="`${locals.ElementTypes.TEXTELEMENT}_Settings`" class="vcp-element-settings">
											<div class="vcp-toolbar-content-row">
												<div style="text-align: center; width: 100%">
													<span>{{_$t('template-builder.elements.configs.type-text')}}</span>
												</div>
											</div>
											<div class="vcp-toolbar-content-row" v-if="locals.selectedElement.type === locals.ElementTypes.TEXTELEMENT">
												<div class="vcp-toolbar-content-field">
													<textarea :dir="settings.pageDirections" v-model="locals.selectedElement.configs.text" class="vcp-input-form-control" aria-label="Small"
														aria-describedby="inputGroup-sizing-sm"></textarea>
												</div>
											</div>
										</div>

										<div v-if="locals.selectedElement.type === locals.ElementTypes.DATETIME" :id="`${locals.ElementTypes.DATETIME}_Settings`" class="vcp-element-settings">
											<div class="vcp-toolbar-content-row">
												<div class="vcp-toolbar-content-label">
													<label for="hasDateControl">{{_$t('template-builder.elements.configs.date')}}</label>
												</div>
												<div class="vcp-toolbar-content-field">
													<input class="vcp-input-form-control" type="checkbox" v-model="locals.selectedElement.configs.hasDate" id="hasDateControl" />
												</div>
											</div>
											<div class="vcp-toolbar-content-row">
												<div class="vcp-toolbar-content-label">
													<label for="hasTimeControl">{{_$t('template-builder.elements.configs.time')}}</label>
												</div>
												<div class="vcp-toolbar-content-field">
													<input class="vcp-input-form-control" type="checkbox" v-model="locals.selectedElement.configs.hasTime" id="hasTimeControl" />
												</div>
											</div>
											<div class="vcp-toolbar-content-row">
												<div class="vcp-toolbar-content-label">
													<label for="persiaDateControl">{{_$t('template-builder.elements.configs.solar-date')}}</label>
												</div>
												<div class="vcp-toolbar-content-field">
													<input class="vcp-input-form-control" type="checkbox" v-model="locals.selectedElement.configs.persianDate" id="persiaDateControl" />
												</div>
											</div>
										</div>

										<div v-if="locals.selectedElement.type === locals.ElementTypes.PAGECOUNTER" :id="`${locals.ElementTypes.PAGECOUNTER}_Settings`" class="vcp-element-settings">
											<div class="vcp-toolbar-content-row">
												<div class="vcp-toolbar-content-label">
													<label for="persianNumbersControl">{{_$t('template-builder.elements.configs.persian-digits')}}</label>
												</div>
												<div class="vcp-toolbar-content-field">
													<input type="checkbox" class="vcp-input-form-control" v-model="locals.selectedElement.configs.persianNumbers" id="persianNumbersControl" />
												</div>
											</div>
											<div class="vcp-toolbar-content-row">
												<div class="vcp-toolbar-content-label">
													<label for="completeFormControl">{{_$t('template-builder.elements.configs.use-complete-format')}}</label>
												</div>
												<div class="vcp-toolbar-content-field">
													<input type="checkbox" class="vcp-input-form-control" v-model="locals.selectedElement.configs.completeForm" id="completeFormControl" />
												</div>
											</div>
										</div>

										<div v-if="locals.selectedElement.type === locals.ElementTypes.IMAGEELEMENT" :id="`${locals.ElementTypes.IMAGEELEMENT}_Settings`" class="vcp-element-settings">
											<div class="vcp-toolbar-content-row" style="flex-direction: column">
												<label for="elementImageFileControl">{{_$t('template-builder.elements.configs.upload-image-text')}}</label>
												<div class="vcp-imageelement-text">{{_$t('template-builder.elements.configs.maximum-file-size')}}</div>
												<div class="vcp-imageelement-text">{{_$t('template-builder.elements.configs.accepted-formats')}}</div>
												<div class="vcp-imageelement-text" style="direction: ltr; margin-top: 0px;">*.png, *. jpeg</div>
											</div>
											<div class="vcp-toolbar-content-row">
												<div style="width: 100%;" class="vcp-toolbar-content-field">
													<a class="vcp-button" @click="clickedOnInput('elementImageFileControl')">{{_$t('template-builder.elements.configs.upload-image')}}</a>
												</div>
											</div>
											<div style="display: none;" class="vcp-toolbar-content-row">
												<input style="margin-right: 21px;" type="file" accept="image/*" @change="onFileChange(locals.fileEntryTypes.imageElement)" aria-label="Small"
													aria-describedby="inputGroup-sizing-sm" id="elementImageFileControl" />
											</div>
										</div>

										<div v-if="locals.selectedElement.type === locals.ElementTypes.BINDINGOBJECT" :id="`${locals.ElementTypes.BINDINGOBJECT}_Settings`" class="vcp-element-settings">
											<div class="vcp-toolbar-content-row">
												<div class="vcp-toolbar-content-label">
													<label for="bindingObjectPersianNumbersControl">{{_$t('template-builder.elements.configs.persian-digits')}}</label>
												</div>
												<div class="vcp-toolbar-content-field">
													<input type="checkbox" class="vcp-input-form-control" v-model="locals.selectedElement.configs.persianNumbers" id="bindingObjectPersianNumbersControl" />
												</div>
											</div>
											<div class="vcp-toolbar-content-row" v-if="locals.selectedElement.type === locals.ElementTypes.BINDINGOBJECT">
												<div class="vcp-toolbar-content-label">
													<label for="bindingObjectControl">{{_$t('template-builder.elements.configs.data-type')}}</label>
												</div>
												<div class="vcp-toolbar-content-field">
													<select class="vcp-input-form-control" v-model="locals.selectedElement.configs.field" id="bindingObjectControl">
														<option v-for="option in Object.keys(bindingObjectComputed)" :key="option">{{ option }}</option>
													</select>
												</div>
											</div>
										</div>

										<div v-if="locals.selectedElement.type === locals.ElementTypes.TEXTPATTERN" :id="`${locals.ElementTypes.TEXTPATTERN}_Settings`" class="vcp-element-settings">
											<div class="vcp-toolbar-content-row" v-if="locals.selectedElement.type === locals.ElementTypes.TEXTPATTERN">
												<div style="text-align: center; width: 100%">
													<span>{{_$t('template-builder.elements.configs.type-text')}}</span>
													<p>{{_$t('template-builder.elements.configs.textpattern-example', {name: '{name}'})}}</p>
												</div>
											</div>
											<div>
												<div class="vcp-toolbar-content-field">
													<textarea :dir="settings.pageDirections" v-model="locals.selectedElement.configs.text" class="vcp-input-form-control" aria-label="Small"
														aria-describedby="inputGroup-sizing-sm"></textarea>
												</div>
											</div>
											<div class="vcp-toolbar-content-row">
												<div class="vcp-toolbar-content-label">
													<label for="textPatternPersianNumbersControl">{{_$t('template-builder.elements.configs.persian-digits')}}</label>
												</div>
												<div class="vcp-toolbar-content-field">
													<input :dir="settings.pageDirections" type="checkbox" class="vcp-input-form-control" v-model="locals.selectedElement.configs.persianNumbers"
														id="textPatternPersianNumbersControl" />
												</div>
											</div>
											<div class="vcp-toolbar-content-row">
												<div class="vcp-toolbar-content-label">
													<label for="textpatternControl">{{_$t('template-builder.elements.configs.fields')}}</label>
												</div>
												<div class="vcp-toolbar-content-field">
													<select class="vcp-input-form-control" id="textpatternControl">
														<option v-for="option in Object.keys(bindingObjectComputed)" :key="option">{{ option }}</option>
													</select>
												</div>
											</div>
										</div>

										<div v-if="locals.selectedElement.type === locals.ElementTypes.COLUMN" :id="`${locals.ElementTypes.COLUMN}_Settings`" class="vcp-element-settings">
											<div class="vcp-toolbar-content-row">
												<div style="width: 100%;" class="vcp-toolbar-content-label">
													<label for="dataSetNameControl">{{_$t('template-builder.elements.configs.order')}} ({{locals.selectedElement.configs.key}})</label>
												</div>
												<div class="vcp-toolbar-content-field">
													<label for="colActive">
														<input style="flex-grow: unset;" type="number" class="vcp-input-form-control" v-model="locals.selectedElement.configs.order" id="colActive" />
													</label>
												</div>
											</div>

											<div class="vcp-toolbar-content-row">
												<div style="width: 100%;" class="vcp-toolbar-content-label">
													<label for="dataSetNameControl">{{_$t('template-builder.elements.configs.title')}}</label>
												</div>
												<div class="vcp-toolbar-content-field">
													<label for="colActive">
														<input style="flex-grow: unset;" type="text" class="vcp-input-form-control" v-model="locals.selectedElement.configs.title" id="colActive" />
													</label>
												</div>
											</div>
										</div>

										<div v-if="locals.selectedElement.type === locals.ElementTypes.ROW" :id="`${locals.ElementTypes.ROW}_Settings`" class="vcp-element-settings">
											<div class="vcp-toolbar-content-row">
												<div class="vcp-toolbar-content-label">
													<label for="dataSetNameControl">{{_$t('template-builder.elements.configs.stylesTarget')}}</label>
												</div>
												<div class="vcp-toolbar-content-field">
													<select v-model="locals.selectedElement.configs.stylesTarget" class="vcp-input-form-control" id="dataSetNameControl">
														<option v-for="option in locals.StylesTargets" :value="option" :key="option">{{ _$t(`template-builder.elements.configs.${option}`) }}</option>
													</select>
												</div>
											</div>

											<div class="vcp-toolbar-content-row">
												<div class="vcp-toolbar-content-label">
													<label for="dataSetNameControl">{{_$t('template-builder.elements.configs.rowsHeight')}}</label>
												</div>
												<div class="vcp-toolbar-content-field">
													<input type="number" class="vcp-input-form-control" v-model="locals.selectedElement.styles.minHeight" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
												</div>
											</div>
										</div>

										<div v-if="locals.selectedElement.type === locals.ElementTypes.DATASET || locals.selectedElement.type === locals.ElementTypes.REPEATOR"
											:id="`${locals.selectedElement.type}_Settings`" class="vcp-element-settings">
											<div class="vcp-toolbar-content-row">
												<div class="vcp-toolbar-content-label">
													<label for="dataSetNameControl">{{_$t('template-builder.elements.configs.datasets')}}</label>
												</div>
												<div class="vcp-toolbar-content-field">
													<select v-model="locals.selectedElement.configs.selectedDataSet" class="vcp-input-form-control" id="dataSetNameControl">
														<option v-for="dataset in Object.keys(dataSetComputed)" :value="dataset" :key="dataset">{{ dataSetComputed[dataset].configs.title }}</option>
													</select>
												</div>
											</div>
										</div>

										<div v-if="locals.selectedElement.type === locals.ElementTypes.DATASET && locals.selectedElement.configs.selectedDataSet" class="vcp-toolbar-content-row vcp-element-settings"
											style="flex-wrap: wrap; justify-content: center;">
											<Toggler v-for="col in dataSetComputed[locals.selectedElement.configs.selectedDataSet].configs.columns" :key="col.id" @click="togglerClicked(col)"
												class="vcp-toolbar-content-label vcp-column-toggler" :options="prepareTogglerOptions(col)" />
										</div>

									</div>
								</div>

								<!-- Element's Styles -->
								<div v-if="locals.selectedElement.type !== locals.ElementTypes.EMPTY">
									<div style="margin-top: 15px" class="vcp-toolbar-header">
										<span>{{_$t('template-builder.elements.styles.name', {elementType: _$t(`template-builder.elements.${locals.selectedElement.type}`)})}}</span>
									</div>
									<div class="vcp-toolbar-content-wrapper" id="elementStylesMenu">
										<div class="vcp-toolbar-content-row">
											<div class="vcp-toolbar-content-label">
												<label for="elementTextAlignControl">{{_$t('template-builder.elements.styles.text-align')}}</label>
											</div>
											<div class="vcp-toolbar-content-field">
												<select v-model="locals.selectedElement.styles.textAlign" class="vcp-input-form-control" id="elementTextAlignControl">
													<option value="right">{{_$t('template-builder.elements.styles.positions.right')}}</option>
													<option value="center">{{_$t('template-builder.elements.styles.positions.center')}}</option>
													<option value="left">{{_$t('template-builder.elements.styles.positions.left')}}</option>
												</select>
											</div>
										</div>
										<div class="vcp-toolbar-content-row">
											<div class="vcp-toolbar-content-label">
												<label for="elementTextAlignControl">{{_$t('template-builder.elements.styles.align-items')}}</label>
											</div>
											<div class="vcp-toolbar-content-field">
												<select v-model="locals.selectedElement.styles.alignItems" class="vcp-input-form-control" id="elementTextAlignControl">
													<option value="flex-start">{{_$t('template-builder.elements.styles.positions.top')}}</option>
													<option value="center">{{_$t('template-builder.elements.styles.positions.center')}}</option>
													<option value="flex-end">{{_$t('template-builder.elements.styles.positions.bottom')}}</option>
												</select>
											</div>
										</div>
										<div class="vcp-toolbar-content-row">
											<div class="vcp-toolbar-content-label">
												<span>{{_$t('template-builder.elements.styles.text-color')}}</span>
											</div>
											<div class="vcp-toolbar-content-field">
												<input type="color" class="vcp-input-form-control" v-model="locals.selectedElement.styles.color" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
											</div>
										</div>
										<div class="vcp-toolbar-content-row">
											<div class="vcp-toolbar-content-label">
												<span>{{_$t('template-builder.elements.styles.background-color')}}</span>
											</div>
											<div class="vcp-toolbar-content-field">
												<input type="color" class="vcp-input-form-control" v-model="locals.selectedElement.styles.backgroundColor" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
											</div>
										</div>
										<div class="vcp-toolbar-content-row">
											<div class="vcp-toolbar-content-label">
												<span>{{_$t('template-builder.elements.styles.font-size')}}</span>
											</div>
											<div class="vcp-toolbar-content-field">
												<select class="vcp-input-form-control" v-model="locals.selectedElement.styles.fontSize" id="pageSizeControl">
													<option v-for="option in locals.fontSizes" :key="option" :value="option + 'px'">{{ option }}</option>
												</select>
											</div>
										</div>
										<div class="vcp-toolbar-content-row">
											<div class="vcp-toolbar-content-label">
												<label for="fontWeightControl">{{_$t('template-builder.elements.styles.font-weight')}}</label>
											</div>
											<div class="vcp-toolbar-content-field">
												<select v-model="locals.selectedElement.styles.fontWeight" class="vcp-input-form-control" id="elementTextAlignControl">
													<option value="normal">{{_$t('template-builder.elements.styles.normal')}}</option>
													<option value="bold">{{_$t('template-builder.elements.styles.bold')}}</option>
												</select>
											</div>
										</div>
										<div class="vcp-toolbar-content-row">
											<div class="vcp-toolbar-content-label">
												<span>{{_$t('template-builder.elements.styles.font-family')}}</span>
											</div>
											<div class="vcp-toolbar-content-field">
												<input type="text" class="vcp-input-form-control" v-model="locals.selectedElement.styles.fontFamily" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
											</div>
										</div>
										<div class="vcp-toolbar-content-row">
											<div class="vcp-toolbar-content-label">
												<span>{{_$t('template-builder.elements.styles.borders')}}</span>
											</div>
											<div class="vcp-toolbar-content-field" style="text-align: right">
												<label for="bordersAlldirections">
													<input class="vcp-input-form-control" style="display: inline-block" type="checkbox" v-model="locals.bordersAllDirections" id="bordersAlldirections" />
													{{_$t('template-builder.elements.styles.border-on-all-directions')}}
												</label>
											</div>
										</div>
										<div class="vcp-toolbar-content-row" v-if="locals.bordersAllDirections">
											<div class="vcp-toolbar-content-label">
												<span>{{_$t('template-builder.elements.styles.border-style')}}</span>
											</div>
											<div class="vcp-toolbar-content-field">
												<input type="text" class="vcp-input-form-control" v-model="locals.selectedElement.styles.border" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
											</div>
										</div>
										<div v-if="locals.bordersAllDirections === false" style="width: 100%">
											<div class="vcp-toolbar-content-row">
												<div class="vcp-toolbar-content-label">
													<span>{{_$t('template-builder.elements.styles.border-top')}}</span>
												</div>
												<div class="vcp-toolbar-content-field">
													<input type="text" class="vcp-input-form-control" v-model="locals.selectedElement.styles.borderTop" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
												</div>
											</div>
											<div class="vcp-toolbar-content-row">
												<div class="vcp-toolbar-content-label">
													<span>{{_$t('template-builder.elements.styles.border-right')}}</span>
												</div>
												<div class="vcp-toolbar-content-field">
													<input type="text" class="vcp-input-form-control" v-model="locals.selectedElement.styles.borderRight" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
												</div>
											</div>
											<div class="vcp-toolbar-content-row">
												<div class="vcp-toolbar-content-label">
													<span>{{_$t('template-builder.elements.styles.border-bottom')}}</span>
												</div>
												<div class="vcp-toolbar-content-field">
													<input type="text" class="vcp-input-form-control" v-model="locals.selectedElement.styles.borderBottom" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
												</div>
											</div>
											<div class="vcp-toolbar-content-row">
												<div class="vcp-toolbar-content-label">
													<span>{{_$t('template-builder.elements.styles.border-left')}}</span>
												</div>
												<div class="vcp-toolbar-content-field">
													<input type="text" class="vcp-input-form-control" v-model="locals.selectedElement.styles.borderLeft" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
												</div>
											</div>
										</div>
										<div class="vcp-toolbar-content-row">
											<div class="vcp-toolbar-content-label">
												<span>{{_$t('template-builder.elements.styles.text-direction')}}</span>
											</div>
											<div class="vcp-toolbar-content-field" style="text-align: right">
												<label for="elementDirections">
													<div>
														<input type="radio" name="elementDirections" id="elementDirections" value="rtl" v-model="locals.selectedElement.styles.direction" />
														{{_$t('template-builder.elements.styles.right-to-left')}}
													</div>
												</label>
												<label for="elementDirections2">
													<div>
														<input type="radio" name="elementDirections" id="elementDirections2" value="ltr" v-model="locals.selectedElement.styles.direction" />
														{{_$t('template-builder.elements.styles.left-to-right')}}
													</div>
												</label>
											</div>
										</div>
										<div class="vcp-toolbar-content-row">
											<div class="vcp-toolbar-content-label">
												<span>{{_$t('template-builder.elements.styles.top')}}</span>
											</div>
											<div class="vcp-toolbar-content-field">
												<input type="text" class="vcp-input-form-control" v-model="locals.selectedElement.styles.top" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
											</div>
										</div>
										<div class="vcp-toolbar-content-row">
											<div class="vcp-toolbar-content-label">
												<span>{{_$t('template-builder.elements.styles.left')}}</span>
											</div>
											<div class="vcp-toolbar-content-field">
												<input type="text" class="vcp-input-form-control" v-model="locals.selectedElement.styles.left" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
											</div>
										</div>
										<div class="vcp-toolbar-content-row">
											<div class="vcp-toolbar-content-label">
												<span>{{_$t('template-builder.elements.styles.width')}}</span>
											</div>
											<div class="vcp-toolbar-content-field">
												<input type="text" class="vcp-input-form-control" v-model="locals.selectedElement.styles.width" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
											</div>
										</div>
										<div class="vcp-toolbar-content-row">
											<div class="vcp-toolbar-content-label">
												<span>{{_$t('template-builder.elements.styles.height')}}</span>
											</div>
											<div class="vcp-toolbar-content-field">
												<input type="text" class="vcp-input-form-control" v-model="locals.selectedElement.styles.height" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
											</div>
										</div>
									</div>
								</div>

								<!-- Section's Styles -->
								<div v-if="locals.selectedSection" :id="`${locals.selectedSection}Template_Settings`">
									<div style="margin-top: 15px" class="vcp-toolbar-header">
										<span>{{_$t('template-builder.sections.styles', {sectionName: locals.selectedSection})}}</span>
									</div>
									<div class="vcp-toolbar-content-wrapper">
										<!-- <div class="vcp-toolbar-content-row">
										<div class="vcp-toolbar-content-label">
											<span>{{_$t('template-builder.elements.styles.background-color')}}</span>
										</div>
										<div class="vcp-toolbar-content-field">
											<input type="color" class="vcp-input-form-control" v-model="settings[locals.selectedSection].styles.backgroundColor" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
										</div>
									</div> -->
										<div class="vcp-toolbar-content-row">
											<div class="vcp-toolbar-content-label">
												<span>{{_$t('template-builder.elements.styles.borders')}}</span>
											</div>
											<div class="vcp-toolbar-content-field" style="text-align: right">
												<label for="bordersAlldirections">
													<input class="vcp-input-form-control" style="display: inline-block" type="checkbox" v-model="locals.bordersAllDirections" id="bordersAlldirections" />
													{{_$t('template-builder.elements.styles.border-on-all-directions')}}
												</label>
											</div>
										</div>
										<div class="vcp-toolbar-content-row" v-if="locals.bordersAllDirections">
											<div class="vcp-toolbar-content-label">
												<span>{{_$t('template-builder.elements.styles.border-style')}}</span>
											</div>
											<div class="vcp-toolbar-content-field">
												<input type="text" class="vcp-input-form-control" v-model="settings[locals.selectedSection].styles.border" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
											</div>
										</div>
										<div v-if="!locals.bordersAllDirections" style="width: 100%">
											<div class="vcp-toolbar-content-row">
												<div class="vcp-toolbar-content-label">
													<span>{{_$t('template-builder.elements.styles.border-top')}}</span>
												</div>
												<div class="vcp-toolbar-content-field">
													<input type="text" class="vcp-input-form-control" v-model="settings[locals.selectedSection].styles.borderTop" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
												</div>
											</div>
											<div class="vcp-toolbar-content-row">
												<div class="vcp-toolbar-content-label">
													<span>{{_$t('template-builder.elements.styles.border-right')}}</span>
												</div>
												<div class="vcp-toolbar-content-field">
													<input type="text" class="vcp-input-form-control" v-model="settings[locals.selectedSection].styles.borderRight" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
												</div>
											</div>
											<div class="vcp-toolbar-content-row">
												<div class="vcp-toolbar-content-label">
													<span>{{_$t('template-builder.elements.styles.border-bottom')}}</span>
												</div>
												<div class="vcp-toolbar-content-field">
													<input type="text" class="vcp-input-form-control" v-model="settings[locals.selectedSection].styles.borderBottom" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
												</div>
											</div>
											<div class="vcp-toolbar-content-row">
												<div class="vcp-toolbar-content-label">
													<span>{{_$t('template-builder.elements.styles.border-left')}}</span>
												</div>
												<div class="vcp-toolbar-content-field">
													<input type="text" class="vcp-input-form-control" v-model="settings[locals.selectedSection].styles.borderLeft" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
												</div>
											</div>
										</div>
									</div>
								</div>
								<hr />
							</div>
						</div>
					</div>

					<!-- Section 2 (Template)-->
					<div class="vcp-template-container" tabindex="0" id="templateContainer">
						<div class="vcp-toolbar">
							<img src="@/assets/images/zoom-in.png" style="width: 16px" @click="locals.scale += 0.1" />
							<img src="@/assets/images/zoom-out.png" style="width: 16px" @click="locals.scale -= 0.1" />
							<img src="@/assets/images/delete.png" style="width: 16px" @click="deleteElement()" />
							<img src="@/assets/images/expand.png" style="width: 16px" @click="fullScreen()" />
						</div>
						<div ref="template"
							:style="{width: '100%', height: locals.templateHeight + 'in', border: settings.pageBorder, 'min-height': settings.defaultHeightOfPaper + 'in', width: settings.defaultWidthOfPaper + 'in', transform: `scale(${locals.scale})`}"
							class="vcp-template" @click="deSelectAll">
							<Section v-for="section in locals.sections" :set="currentSection = settings[section]" :key="section" :section="section" :elements="currentSection.elements"
								:active="locals.selectedSection === section" :height="currentSection.height" :styles="currentSection.styles" @finishedEditingElement="finishedEditingElement"
								@clickedOnElement="clickedOnElement" @clickedOnSection="clickedOnSection" @droppedElement="droppedElement" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { IElement, IElementStates, IEmptyElement, IVariable, IDataSetLikeElement } from '~/interfaces/elements'
	import { fileEntryTypes, TemplateBuilderSections, Tabs } from '~/enums/general'
	import { ElementGrandParents, ElementParents, ElementTypes, StylesTargets, VariableTypes } from '~/enums/element'
	import { IFile, ISettings } from '~/interfaces/general'
	import { fetchLangList } from '~/translations'
	import { BindingObjectLikeElement, DataSetLikeElement, EmptyElement, createElement, DEFAULTELEMENTSTATES, findElementsParentInstance, createDataSetDetails, createElementInstanceFromObject, } from '~/plugins/element-utilities'
	import { idGenerator, convert2Inches, toFloatVal, merge, encode2Base64, prepareSettings, isEmpty, getDefaultSettings, decodeFromBase64, validateDesign } from '~/plugins/general-utilities'

	//@ts-ignore
	import { saveAs } from 'file-saver'
	import { IColumn, IDataset } from '@/interfaces/datasets'
	import cloneDeep from 'lodash/cloneDeep'
	import KeyboardHandler from '~/plugins/keyboard-handler'
	import Logger from '~/plugins/logger'
	import { defineComponent } from 'vue'

	import { useVariablesStore } from '~/stores/variables'
	import { useGeneralStore } from '~/stores/general'
	import { useDataSetStore } from '~/stores/dataset'
	import { useBindingObjectStore } from '~/stores/binding-object'

	const variablesStore = useVariablesStore()
	const generalStore = useGeneralStore()
	const dataSetStore = useDataSetStore()
	const bindingObjectStore = useBindingObjectStore()

	export default defineComponent({
		name: "TemplateBuilder",
		props: {
			options: Object,
		},
		computed: {
			bindingObjectComputed() {
				if (this.locals.selectedElement instanceof BindingObjectLikeElement) {
					var element = findElementsParentInstance(this.settings, this.locals.selectedElement)
					var dataSetDetails = createDataSetDetails(element)
					return this.locals.selectedElement.computeBindingObject(dataSetDetails)
				}
			},
			dataSetComputed() {
				if (this.locals.selectedElement instanceof DataSetLikeElement) {
					var element = findElementsParentInstance(this.settings, this.locals.selectedElement)
					var dataSetDetails = createDataSetDetails(element)
					return this.locals.selectedElement.computeDatasets(dataSetDetails)
				}
			},
			variablesList() {
				return variablesStore.all
			},
		},
		data() {
			return {
				locals: {
					tabs: Tabs,
					sections: Object.values(TemplateBuilderSections),
					StylesTargets: StylesTargets,
					fileEntryTypes: fileEntryTypes,
					ElementTypes: ElementTypes,
					elementType: ElementTypes.EMPTY,
					VariableTypes: VariableTypes,
					currentVariable: new EmptyElement as IElement | IEmptyElement,
					selectedSection: null as TemplateBuilderSections | null,
					fullScreen: false,
					templateHeight: 11.7,
					langs: fetchLangList(),
					copiedElement: new EmptyElement as IElement | IEmptyElement,
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
					bordersAllDirections: true,
					activeTab: '',
					isClicked: false,
					selectedElement: new EmptyElement as IElement | IEmptyElement,
					fontSizes: [8, 10, 12, 14, 16, 18, 20, 22, 24, 30, 36, 42, 50, 58, 66, 74],
				},
				settings: getDefaultSettings(),
			}
		},
		watch: {
			options: {
				// deep: true,
				immediate: true,
				handler(val) {
					this.settings = prepareSettings(val)
				},
			}
		},
		mounted() {
			this.keyboardHandler()
			this.switchTabs(Tabs.SETTINGS)
		},
		methods: {

			/**
			 * prepare toggler options and decide for isActive
			 * @param {IColumn} col - toggler bound col.
			 * @return {Object} toggler options
			 */
			prepareTogglerOptions(col: IColumn): object {
				var isActive = false
				var element = this.locals.selectedElement
				var displaySet: IDataset = element.configs.dataSets[element.configs.selectedDataSet]
				var columns: IColumn[] = displaySet.configs.columns
				var index: number = columns.findIndex((x: IColumn) => x.configs.key === col.configs.key)

				if (index > -1)
					isActive = true

				return { title: col.configs.title, isActive }
			},

			/**
			 * add/delete clicked column to/from dataset columns
			 * @param {IColumn} col - toggler bound col.
			 * @return {Void} void
			 */
			togglerClicked(col: IColumn): void {
				var element = this.locals.selectedElement
				var displaySet: IDataset = element.configs.dataSets[element.configs.selectedDataSet]
				var columns: IColumn[] = displaySet.configs.columns
				var index: number = columns.findIndex((x: IColumn) => x.configs.key === col.configs.key)


				if (index > -1)
					columns.splice(index, 1)

				else {
					col.configs.order = columns.length + 1
					columns.push(cloneDeep(col))
				}
			},

			/**
			 * Temp method to close modal before refactoring modal
			 */
			closeModal(id: string): void {
				document.getElementById(id)!.style.display = 'none'
			},

			/**
			 * Deselect Section.
			 * @param {Event} e - event.
			 */
			deselectSection(e: any): void {
				if (e.target.id === 'templateBuilderModal')
					this.locals.selectedSection = null
			},

			/**
			 * Sets selected section.
			 * @param {String} section - clicked SectionName.
			 */
			clickedOnSection(section: TemplateBuilderSections, e: any): void {

				if (e.target.id && e.target.id.includes('Template')) {
					this.locals.selectedSection = section
					this.switchTabs(Tabs.SETTINGS)

					setTimeout(() => {

						var settingsSection = document.getElementById(`${section}Template_Settings`)

						if (settingsSection)
							settingsSection.scrollIntoView({
								behavior: "smooth",
								block: "start",
								inline: "nearest"
							})
					}, 1)
				}
			},
			/**
			 * Fullscreen TB view
			 */
			fullScreen() {
				var TBContainer = document.getElementById('fullscreenControl')
				if (this.locals.fullScreen) {
					this.locals.fullScreen = false
					TBContainer!.style.margin = '2% auto'
					TBContainer!.style.width = '1090px'
				}
				else {
					this.locals.fullScreen = true
					TBContainer!.style.margin = '2%'
					TBContainer!.style.width = 'unset'
				}
			},
			/**
			 * delets given element
			 * @param {Object} element - element to delete.
			 */
			deleteElement(element: IElement = this.locals.selectedElement) {

				if (element.type === ElementTypes.EMPTY)
					return

				var parent = this.locals.selectedElement.parent
				var array = this.settings[parent].elements

				var index = array.findIndex((x: IElement) => x.id === element.id)

				if (index > -1)
					array.splice(index, 1)
			},

			/**
			 * @param {IElement} element - element to copy/paste.
			 * validate Copy
			 */
			validateCopy(element: IElement | IEmptyElement): boolean {
				const NOTCOPYABLE = [ElementTypes.EMPTY, ElementTypes.ROW, ElementTypes.CELL, ElementTypes.COLUMN]

				if (NOTCOPYABLE.includes(element.type))
					return false

				return true
			},
			/**
			 * Copy selected element.
			 */
			copyElement(element: IElement): void {

				if (!this.validateCopy(element))
					return

				this.locals.copiedElement = cloneDeep(this.createElement(element.type, element.parent, DEFAULTELEMENTSTATES, element.styles, element.configs))
			},
			/**
			 * Paste copied element.
			 */
			pasteCopiedElement(): void {

				var element = this.locals.copiedElement

				if (!this.validateCopy(element))
					return

				var parent = this.locals.selectedElement.parent
				var array = this.settings[parent].elements

				element.parent = parent
				element.styles.top = '0px'

				if (element.repeatorId) {
					var repeator = array.find((x: IElement) => x.id === element.repeatorId)
					repeator.configs.appendedElements.push(element)
				}
				else
					array.push(element)
			},

			/**
			 * Save Changes on TB close.
			 * @return {Object} - design file
			 */
			save(): void {
				let design: ISettings = this.export2Json()

				if (!design)
					return

				if (this.settings.callback)
					this.settings.callback(design)

				var text = this._$t('template-builder.alerts.save-success')
				Logger.alert(text)
			},
			/**
			 * Exports settings to json a file.
			 * @return {Object} - json file
			 */
			export2Json(): ISettings | void {

				var json: ISettings = cloneDeep(this.settings)

				json.totalHeightOfAPaper = json.defaultHeightOfPaper - json.header.height - json.footer.height

				if (json.totalHeightOfAPaper < 0)
					json.totalHeightOfAPaper = 1.77

				if (!validateDesign(json))
					return

				return json
			},

			/**
			 * Exports settings to vcp file.
			 * @return {File} - save settings file in browser
			 */
			export2SrcFile(): void {
				var file: IFile = { design: this.export2Json(), variables: variablesStore.all }
				var encoded: string = encode2Base64(JSON.stringify(file)) // encoding the settings to export

				var currentdate = new Date()
				var defaultDesignName = 'vcp' + " "
					+ currentdate.getFullYear() + "-"
					+ (currentdate.getMonth() + 1) + "-"
					+ currentdate.getDate() + " at "
					+ currentdate.getHours() + "."
					+ currentdate.getMinutes() + '.'
					+ currentdate.getSeconds()

				let fileName = file.design.designName === '' ? defaultDesignName : file.design.designName

				var blob = new Blob([encoded],
					{ type: "text/plain;charset=utf-8" })
				saveAs(blob, `${fileName}.vcp`)
			},

			/**
			 * Imports settings from src file and assign merge with settings.
			 * @param {srcFile} srcFile - given srcFile
			 * @return {void} - void
			 */
			importFromSrcFile(srcFile: string): void {
				var callback = this.settings.callback || null
				this.settings = getDefaultSettings() // Set the settings to default value
				var designFile: IFile = JSON.parse(decodeFromBase64(srcFile))


				if (designFile.variables)
					variablesStore.updateVariables(designFile.variables)

				this.settings = merge(this.settings, designFile.design) // assign the changes

				for (var section of this.locals.sections) {

					for (let index = 0; index < this.settings[section].elements.length; index++) {
						var elem = this.settings[section].elements[index]

						if (elem instanceof Element === false)
							this.settings[section].elements[index] = createElementInstanceFromObject(elem)

					}
				}

				if (callback)
					this.settings.callback = callback
			},

			/**
			 * sync the sizes based upon the selected page orientation and format.
			 * @return {void} - void
			 */
			syncSizes(): void {

				const errorValue = 0.2 // Subtracting this value to make the pages more accurate

				this.settings.defaultHeightOfPaper = this.locals.pageSizeDictionary[this.settings.orientation][this.settings.pageSize]["height"] // Gettings the default sizes from the base dic
				this.settings.totalHeightOfAPaper = this.settings.defaultHeightOfPaper - this.settings.footer.height - this.settings.header.height - errorValue
				this.settings.defaultWidthOfPaper = this.locals.pageSizeDictionary[this.settings.orientation][this.settings.pageSize]["width"]
			},

			/**
			 * Initializing dragging settings
			 */
			settingsInitFunc(): void {
				setTimeout(() => {
					this.sectionResizeHandler([TemplateBuilderSections.HEADER, TemplateBuilderSections.BEFOREBODY, TemplateBuilderSections.AFTERBODY, TemplateBuilderSections.FOOTER])
					this.locals.scale = 1
				}, 100)
			},

			/**
			 * Init resize functionality for sections.
			 * @return {void} - void
			 */
			sectionResizeHandler(sections: TemplateBuilderSections[]): void {


				for (let sectionName of sections) {
					let section: any = document.getElementsByClassName(`vcp-section ${sectionName}`)[0] // element to make resizable

					var resizer = document.createElement("div")
					resizer.className = "vcp-resizer"
					resizer.style.height = "10px"
					section.appendChild(resizer)
					resizer.addEventListener("mousedown", (e) => initDrag(e, section), false)

					var startY: number, startHeight: number, parentHeight: number

					const initDrag = (e: any, section: HTMLElement) => {
						startY = e.clientY
						parentHeight = this.locals.templateHeight

						startHeight = parseInt(document.defaultView!.getComputedStyle(section).height, 10)

						document.documentElement.addEventListener("mousemove", doDrag, false)
						document.documentElement.addEventListener("mouseup", stopDrag, false)
					}

					const doDrag = (e: any) => {
						if (sectionName === TemplateBuilderSections.HEADER)
							this.settings.header.height = convert2Inches(startHeight + e.clientY - startY)

						else if (sectionName === TemplateBuilderSections.BEFOREBODY) {
							this.settings.beforeBody.height = convert2Inches(startHeight + e.clientY - startY)
							this.locals.templateHeight = parentHeight + this.settings.beforeBody.height - convert2Inches(startHeight)
						}

						else if (sectionName === TemplateBuilderSections.AFTERBODY) {
							this.settings.afterBody.height = convert2Inches(startHeight + e.clientY - startY)
							this.locals.templateHeight = parentHeight + this.settings.afterBody.height - convert2Inches(startHeight)
						}

						else if (sectionName === TemplateBuilderSections.FOOTER)
							this.settings.footer.height = convert2Inches(startHeight - e.clientY + startY)

					}

					const stopDrag = (e: any) => {
						document.documentElement.removeEventListener("mousemove", doDrag, false)
						document.documentElement.removeEventListener("mouseup", stopDrag, false)
					}
				}
			},

			/**
			 * Swtich between tabs in toolbar.
			 * @param {String} tabName - tabName
			 * @param {HTMLElement} tab - selected tab element
			 * @return {void} - void
			 */
			switchTabs(tabName: Tabs): void {

				if (tabName === this.locals.activeTab)
					return

				let previousTab = document.getElementsByClassName('vcp-tab selected')[0]
				var tab = this.$refs[tabName] as HTMLElement

				if (!tab)
					return

				if (previousTab)
					previousTab.classList.remove('selected')

				tab.classList.add('selected')
				this.locals.activeTab = tabName
			},

			/**
			 * Deselect all selected elements.
			 * @return {void} - void
			 */
			deSelectAll(): void {
				if (this.locals.isClicked) {
					this.locals.isClicked = false
					return
				}

				this.locals.selectedElement = new EmptyElement
				let selectedElements = document.getElementsByClassName("vcp-element selected")
				for (let index = 0; index < selectedElements.length; index++) {
					selectedElements[index].classList.remove("selected")
				}
			},

			/**
			 * Clicked on element.
			 * @param {Object} element - element
			 * @return {void} - void
			 */
			clickedOnElement(element: IElement): void {
				this.locals.selectedElement = element
				this.locals.isClicked = true
				this.locals.selectedSection = null

				if (this.locals.selectedElement.type === ElementTypes.VARIABLE)
					this.switchTabs(Tabs.VARIABLES)
				else
					this.switchTabs(Tabs.SETTINGS)

				var settingsSection = document.getElementById(`${this.locals.selectedElement.type}_Settings`)

				if (settingsSection)
					settingsSection.scrollIntoView({
						behavior: "smooth",
						block: "start",
						inline: "nearest"
					})

			},

			/**
			 * create element.
			 * @param {String} parent - element parent
			 * @return {IElement} - returns instance of element class
			 */
			createElement(elementType: ElementTypes, parent: ElementParents, states: IElementStates = DEFAULTELEMENTSTATES, styles?: any, configs?: any): IElement {
				return createElement(elementType, parent, ElementGrandParents.TEMPLATEBUILDER, states, styles, configs)
			},
			/**
			 * Creates variable in variables tab list.
			 * @return {void} - void
			 */
			createVariable(): void {

				var variable: IVariable = {
					variableId: idGenerator(),
					name: '',
					context: '',
					variableType: VariableTypes.TEXT,
				}
				variablesStore.pushVariable(variable)
			},

			/**
			 * Delete the variable context on type change.
			 * @param {variable} variable - variable object
			 * @return {void} - void
			 */
			onVariableTypeChange(variable: IVariable): void {
				variable.context = ''
			},

			/**
			 * Deletes variable in variables tab list.
			 * @param {string} id - variable unique id
			 * @return {void} - void
			 */
			deleteVariable(variableId: string): void {

				for (let section of this.locals.sections) {
					for (let index = 0; index < this.settings[section].elements.length; index++) {
						if (this.settings[section].elements[index].configs.variableId === variableId)
							this.settings[section].elements.splice(index, 1)
					}
				}

				variablesStore.deleteById(variableId)
			},


			/**
			 * Method that triggers on element drag.
			 * @param {ElementTypes} elementType - element type
			 * @param {IElement} variable - element unique id
			 * @return {void} - void
			 */
			startDraggingElement(elementType: ElementTypes, variable: IElement): void {
				this.locals.currentVariable = variable
				this.locals.elementType = elementType
				this.$refs.template.className += " dragged"
			},

			prepareNewElementsConfigs(elementType: ElementTypes): any {

				let configs = {}

				switch (elementType) {
					case ElementTypes.VARIABLE:
						configs = this.locals.currentVariable
						break

					case ElementTypes.IMAGEELEMENT:
						configs = { imageSrc: generalStore.getByKey('configurations').imageSrc }
						break

					default:
						break
				}

				return configs

			},

			/**
			 * Method that triggers on element drop on header / footer.
			 */
			droppedElement(parent: ElementParents, e: any, parentElement?: IDataSetLikeElement): void {

				var elementType: ElementTypes = this.locals.elementType
				var isChild = parentElement && parentElement.type === ElementTypes.REPEATOR

				if (elementType === ElementTypes.EMPTY)
					return

				var baseStyles = {
					top: e.offsetY + 'px' || '0px',
					left: e.offsetX + 'px' || '0px',
					direction: this.settings.pageDirections,
				}

				var configs = this.prepareNewElementsConfigs(elementType)

				var elementInstance: IElement = this.createElement(elementType, parent, DEFAULTELEMENTSTATES, baseStyles, configs)

				if (!this.elementValidator(elementInstance, isChild, parentElement)) {
					elementType = ElementTypes.EMPTY
					return
				}

				elementInstance = this.adjustElementToPage(elementInstance)

				if (isChild && parentElement) { // Element is dropped on another element.
					elementInstance = cloneDeep(elementInstance) // removing refrence to other instances therefore the modification only affects this instance
					elementInstance.states.isChild = true
					elementInstance.repeatorId = parentElement.id
					elementInstance.configs.dataSetDetails = createDataSetDetails(parentElement)
					parentElement.configs.appendedElements.push(elementInstance)
				}
				else {
					this.settings[parent].elements.push(elementInstance)
				}

				elementType = ElementTypes.EMPTY
			},

			elementValidator(element: IElement, isChild: boolean = false, parentElement?: IDataSetLikeElement): boolean {

				const DISSALLOWED_CHILDTYPES = [ElementTypes.PAGECOUNTER, ElementTypes.REPEATOR]

				if (element instanceof DataSetLikeElement && isEmpty(dataSetStore.all)) {
					var text = this._$t('template-builder.elements.validators.dataset-is-empty')
					Logger.alert(text, Logger.levels.ERROR)
					return false
				}

				if (element instanceof BindingObjectLikeElement && isEmpty(bindingObjectStore.all)) {
					var text = this._$t('template-builder.elements.validators.bindingobject-is-empty')
					Logger.alert(text, Logger.levels.ERROR)
					return false
				}

				if (element.type === ElementTypes.PAGECOUNTER && (element.parent !== ElementParents.HEADER && element.parent !== ElementParents.FOOTER)) {
					var text = this._$t('template-builder.elements.validators.pagecounter-parent')
					Logger.alert(text, Logger.levels.ERROR)
					return false
				}


				if (isChild) {

					if (!parentElement!.configs.selectedDataSet) {
						var text = this._$t('template-builder.elements.validators.select-dataset-first')
						Logger.alert(text, Logger.levels.ERROR)
						return false
					}

					if (DISSALLOWED_CHILDTYPES.includes(element.type)) {
						var type = this._$t(`template-builder.elements.${element.type}`)
						var text = this._$t('template-builder.elements.validators.element-type-cant-be-child', { type: type })
						Logger.alert(text, Logger.levels.ERROR)
						return false
					}

					// if child element wants to be parent element
					if (parentElement!.states.isChild) {
						var text = this._$t('template-builder.elements.validators.child-cant-be-parent')
						Logger.alert(text, Logger.levels.ERROR)
						return false
					}
				}

				return true
			},

			/** Controls if added element is outside page borders and adjust if so.
				* @param {Object} element - element object
				* @return {Object} element - adjusted element
				*/
			adjustElementToPage(element: IElement): IElement {
				var sectionId = `${element.parent}Template`
				let elementWidth = element.styles.width || '150px'
				let elementHeight = element.styles.height || '30px'
				let containerRec = document.getElementById(sectionId)!.getBoundingClientRect()
				let sectionWidth = containerRec.width
				let sectionHeight = containerRec.height

				// subtracting repeator title height for child element to make offsetTop accurate.
				if (element.repeatorId)
					sectionHeight -= 20

				elementWidth = toFloatVal(elementWidth)
				elementHeight = toFloatVal(elementHeight)

				if (elementWidth + toFloatVal(element.styles.left) > sectionWidth)
					element.styles.left = sectionWidth - elementWidth + 'px'

				if (elementHeight + toFloatVal(element.styles.top) > sectionHeight)
					element.styles.top = sectionHeight - elementHeight + 'px'

				return element
			},

			/**
			 * Method that triggers when drag is finished
			 */
			finishedDraggingElement(): void {
				(this.$refs.template as HTMLElement).classList.remove("dragged")
			},

			/**
			 * Method that triggers on file change.
			 * @param {fileEntryTypes} type - enrty type
			 * @param {IElement} variable - variable
			 * @return {void} - void
			 */
			onFileChange(type: fileEntryTypes, variable: IVariable): void {
				let maximumFileSize = generalStore.getByKey('configurations').maximumFileSize * 1000
				var file

				const fileValidator = (file: any, maximumFileSize: number, validTypes: string[]) => {

					if (validTypes.length && !validTypes.includes(file.type)) {
						var text = this._$t('template-builder.alerts.format-notsupported')
						return Logger.alert(text, Logger.levels.ERROR)
					}

					if (file.size >= maximumFileSize) {// Check if the file size is under 1MB the image size value is in bytes
						var text = this._$t('template-builder.alerts.fileSize-exceeded', { size: maximumFileSize })
						return Logger.alert(text, Logger.levels.ERROR)
					}
					return true
				}

				const getFile = (id: string) => (document.getElementById(id) as any).files[0]

				switch (type) {
					case fileEntryTypes.imageElement:

						file = getFile('elementImageFileControl')

						if (fileValidator(file, maximumFileSize, ['image/jpeg', 'image/png']))
							this.toBase64(file).then((res: string) => this.locals.selectedElement.configs.imageSrc = res)

						break

					case fileEntryTypes.imageVariable:

						file = getFile('variableImageFileControl')

						if (fileValidator(file, maximumFileSize, ['image/jpeg', 'image/png']))
							this.toBase64(file).then((res: string) => variable.context = res)

						break

					case fileEntryTypes.VCPSrcFile:
					default:

						file = getFile('fileSrcControl')

						if (!file.name.includes('.vcp')) {
							var text = this._$t('template-builder.alerts.format-notsupported')
							return Logger.alert(text, Logger.levels.ERROR)

						}

						if (fileValidator(file, maximumFileSize, [])) {

							var fr = new FileReader()
							fr.readAsText(file)
							fr.onload = () => this.importFromSrcFile(fr.result)
							fr.onerror = (err) => Logger.alert(text, Logger.levels.ERROR)

						}
						break
				}

			},

			/**
			 * Converts given image to base64.
			 * @param {File} file - image
			 * @return {*} - base64 of image
			 */
			toBase64(file: File): Promise<string | ArrayBuffer> {
				return new Promise((resolve, reject) => {
					const reader = new FileReader()
					reader.readAsDataURL(file)
					reader.onload = () => {
						if (reader.result)
							resolve(reader.result)
					}
					reader.onerror = (error) => reject(error)
				})
			},

			/**
			 * Adds an event listenner on delete button and then removes the element
			 */
			keyboardHandler(): void {
				const FOCUSEL = document.getElementById('templateContainer')
				const expandDownSections: TemplateBuilderSections[] = [TemplateBuilderSections.HEADER, TemplateBuilderSections.BEFOREBODY]
				const elementStyleChanger = (style: string, operator: string): void => {
					this.locals.selectedElement.styles[style] = toFloatVal(this.locals.selectedElement.styles[style])
					this.locals.selectedElement.styles[style] = eval(`${this.locals.selectedElement.styles[style]} ${operator} 1`)
					this.locals.selectedElement.styles[style] = this.locals.selectedElement.styles[style] + 'px'
				}

				var requests = [
					{
						name: 'element-section-arrowup',
						shortcut: {
							keyCode: 38, // 38:ArrowUp,
							ctrlKey: false,
						},
						focusEl: FOCUSEL,
						test: () => {
							return this.locals.selectedSection !== null || this.locals.selectedElement.type !== ElementTypes.EMPTY
						},
						handler: () => {

							if (this.locals.selectedSection && this.locals.selectedSection !== TemplateBuilderSections.BODY) { // section resize 

								if (expandDownSections.includes(this.locals.selectedSection))
									this.settings[this.locals.selectedSection].height -= 0.01
								else
									this.settings[this.locals.selectedSection].height += 0.01
							}

							else if (this.locals.selectedElement.type !== ElementTypes.EMPTY)
								elementStyleChanger('top', '-')
						},
					},
					{
						name: 'element-drag',
						shortcut: {
							keyCode: 38, // 38:ArrowUp,
							ctrlKey: true
						},
						focusEl: FOCUSEL,
						test: () => {
							return this.locals.selectedElement.type !== ElementTypes.EMPTY
						},
						handler: () => {
							elementStyleChanger('height', '-')
						},
					},
					{
						name: 'element-section-arrowdown',
						shortcut: {
							keyCode: 40, // 40:ArrowDown,
							ctrlKey: false,
						},
						test: () => {
							return this.locals.selectedSection !== null || this.locals.selectedElement.type !== ElementTypes.EMPTY
						},
						focusEl: FOCUSEL,
						handler: () => {

							if (this.locals.selectedSection && this.locals.selectedSection !== TemplateBuilderSections.BODY) { // section resize 

								if (expandDownSections.includes(this.locals.selectedSection))
									this.settings[this.locals.selectedSection].height += 0.01
								else
									this.settings[this.locals.selectedSection].height -= 0.01
							}

							else if (this.locals.selectedElement.type !== ElementTypes.EMPTY) {
								elementStyleChanger('top', '+')
							}
						}
					},
					{
						name: 'element-arrowdown',
						shortcut: {
							keyCode: 40, // 40:ArrowDown,
							ctrlKey: true
						},
						focusEl: FOCUSEL,
						test: () => {
							return this.locals.selectedElement.type !== ElementTypes.EMPTY
						},
						handler: () => {
							elementStyleChanger('height', '+')
						},
					},
					{
						name: 'element-arrowright',
						shortcut: {
							keyCode: 39, // 39:ArrowRight,
							ctrlKey: false,
						},
						focusEl: FOCUSEL,
						test: () => {
							return this.locals.selectedElement.type !== ElementTypes.EMPTY
						},
						handler: () => {
							elementStyleChanger('left', '+')
						}
					},
					{
						name: 'element-ctrl-arrowright',
						shortcut: {
							keyCode: 39, // 39:ArrowRight,
							ctrlKey: true,
						},
						focusEl: FOCUSEL,
						test: () => {
							return this.locals.selectedElement.type !== ElementTypes.EMPTY
						},
						handler: () => {
							elementStyleChanger('width', '+')
						}
					},
					{
						name: 'element-arrowleft',
						shortcut: {
							keyCode: 37, // 37:ArrowLeft,
							ctrlKey: false,
						},
						focusEl: FOCUSEL,
						test: () => {
							return this.locals.selectedElement.type !== ElementTypes.EMPTY
						},
						handler: () => {
							elementStyleChanger('left', '-')
						}
					},
					{
						name: 'element-ctrl-arrowleft',
						shortcut: {
							keyCode: 37, // 37:ArrowLeft,
							ctrlKey: true,
						},
						focusEl: FOCUSEL,
						test: () => {
							return this.locals.selectedElement.type !== ElementTypes.EMPTY
						},
						handler: () => {
							elementStyleChanger('width', '-')
						}
					},
					{
						name: 'element-delete',
						shortcut: {
							keyCode: 46, // 46:Delete,
							ctrlKey: false,
						},
						// test: () => {
						// 	return this.locals.selectedElement.type !== ElementTypes.EMPTY
						// },
						focusEl: FOCUSEL,
						handler: () => {
							const NOTDELETABLE = [ElementTypes.EMPTY, ElementTypes.COLUMN, ElementTypes.ROW]

							if (NOTDELETABLE.includes(this.locals.selectedElement.type))
								return

							var parent = this.locals.selectedElement.parent
							var array: IElement[] = this.settings[parent].elements

							if (parent === ElementParents.EMPTY || !array.length)
								return

							if (this.locals.selectedElement.states.isChild) { // it's a repeator's child element.

								let index = array.findIndex(x => x.id === this.locals.selectedElement.repeatorId) // repeator index in elements array

								if (index > -1) {
									let repeator = array[index]
									var children: IElement[] = repeator.configs.appendedElements

									index = children.findIndex(x => x.id === this.locals.selectedElement.id) // child index in repeator children array

									if (index > -1) {
										children.splice(index, 1)
										this.locals.selectedElement = new EmptyElement
									}
								}
							}

							else { // it's a normal element.
								let index = array.findIndex(x => x.id === this.locals.selectedElement.id)

								if (index > -1) {
									array.splice(index, 1)
									this.locals.selectedElement = new EmptyElement
								}
							}
						}
					},
					{
						name: 'element-copy',
						shortcut: {
							keyCode: 67, // 67:C,
							ctrlKey: true,
						},
						focusEl: FOCUSEL,
						test: () => {
							return this.locals.selectedElement.type !== ElementTypes.EMPTY
						},
						handler: () => {
							this.copyElement(this.locals.selectedElement as IElement)
						}
					},
					{
						name: 'element-paste',
						shortcut: {
							keyCode: 86, // 86:V,
							ctrlKey: true,
						},
						focusEl: FOCUSEL,
						test: () => {
							return this.locals.selectedElement.type !== ElementTypes.EMPTY
						},
						handler: () => {
							this.pasteCopiedElement()
						}
					},
					{
						name: 'design-save',
						shortcut: {
							keyCode: 83, // 83:S,
							ctrlKey: true,
						},
						focusEl: document.getElementById('templateBuilderModal'),
						handler: () => {
							this.save()
						}
					},
				]

				new KeyboardHandler(requests)
			},

			/**
			 * function to display modal
			 */
			showModal(): void {
				document.getElementById("templateBuilderModal")!.style.display = "block"
			},

			/**
			 * function that triggers while editing is finished.
			 * @param {Object} element - element
			 * @return {void} - void
			 */
			finishedEditingElement(element: IElement, section: TemplateBuilderSections): void {

				var array = this.settings[section].elements

				if (this.locals.selectedElement.states.isChild) { // it's a repeator's child.
					let index = array.findIndex((x: IElement) => x.id === this.locals.selectedElement.repeatorId)

					if (index > -1) {
						var childrens = array[index].configs.appendedElements

						index = childrens.findIndex((x: IElement) => x.id === this.locals.selectedElement.id)
						if (index > -1)
							childrens[index].styles = merge(childrens[index].styles, childrens[index].getCoordinates())
					}
				}

				let elem = array.find((x: IElement) => x.id === element.id)
				elem!.styles = merge(elem!.styles, element.getCoordinates('string'))
			},

			/**
			 * function that triggers when clicked on input.
			 * @param {string} id - element id
			 * @return {void} - void
			 */
			clickedOnInput(id: string): void {
				document.getElementById(id)!.click()
			},
		},
	})
</script>	
