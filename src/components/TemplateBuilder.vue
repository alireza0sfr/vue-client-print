<template>
	<div id="templateBuilderPage" :dir="settings.pageDirections">
		<!-- Preview Modal-->
		<div @click="deselectSection" id="templateBuilderModal" class="print-modal">
			<div id="fullscreenControl" class="print-modal-content">
				<div class="print-modal-header">
					<div>
						<a @click="save()" :title="_$t('template-builder.save')" class="modal-icon" href="#">
							<img src="@/assets/images/floppy-disk.png" />
						</a>
					</div>
					<div>
						<h3 class="title">{{ _$t('template-builder.name') }}</h3>
					</div>

					<div>
						<span id="TemplateBuilderModalCloseBtn" @click="closeModal('templateBuilderModal')" class="close-btn">&times;</span>
					</div>
				</div>

				<div class="template-builder-container">

					<!-- Section 1 (Template Builder) -->
					<div class="toolbar-container">
						<div class="toolbar-content">
							<!-- Tabs -->
							<div class="tabs">
								<a class="tab selected" @click="switchTabs(locals.tabs.SETTINGS)" ref="settings">{{_$t('template-builder.settings')}}</a>
								<a class="tab" @click="switchTabs(locals.tabs.VARIABLES)" ref="variables">{{ _$t('template-builder.variables.variables') }}</a>
								<a class="tab" @click="switchTabs(locals.tabs.OTHERS)" ref="others">{{ _$t('template-builder.others') }}</a>
							</div>

							<!-- Variables Tab -->
							<div v-show="locals.activeTab === locals.tabs.VARIABLES" class="variables-tab">
								<div class="toolbar-header variables-header" style="border-right: 1px solid #81c3ff">
									<span>{{ _$t('template-builder.variables.list') }}</span>
								</div>
								<div class="variables-content-wrapper">
									<div @click="createVariable" style="text-align: center; margin-top: 10px">
										<a class="a-btn">{{ _$t('template-builder.variables.add') }}</a>
									</div>
									<div :id="`${locals.elementType.VARIABLE}_Settings`" class="variables settings-section">
										<div :class="['variable',{selected:locals.selectedElement.configs.variableId === variable.variableId}]" v-for="variable in variablesList" :key="variable.variableId">
											<div class="variables-row">
												<div class="variables-row large">
													<div class="variables-content-field" style="width: 60%">
														<input type="text" v-model="variable.name" class="input-form-control" aria-label="Small" :placeholder="_$t('template-builder.variables.name')"
															aria-describedby="inputGroup-sizing-sm" />
													</div>
													<div class="variables-content-field" style="width: 40%">
														<select class="input-form-control" v-model="variable.variableType" @change="onVariableTypeChange(variable)">
															<option v-for="option in locals.VariableTypes" :value="option" :key="option">{{ _$t(`template-builder.variables.${option}`) }}</option>
														</select>
													</div>
												</div>
												<div draggable="true" class="variables-content-field small" @dragstart="startDraggingElement(locals.ElementTypes.VARIABLE, variable)" @dragend="finishedDraggingElement()">
													<img style="height: 20px; width: 15px; cursor: move;" src="@/assets/images/drag.png" />
												</div>
											</div>
											<div class="variables-row" style="justify-content: flex-end;">
												<div v-if="variable.variableType === locals.VariableTypes.TEXT" class="variables-content-field large">
													<input type="text" v-model="variable.context" class="input-form-control" aria-label="Small" :placeholder="_$t('template-builder.variables.text')"
														aria-describedby="inputGroup-sizing-sm" />
												</div>
												<div class="variables-content-field large" v-if="variable.variableType === locals.VariableTypes.IMAGE">
													<input type="file" accept="image/*" @change="onFileChange(locals.fileEntryTypes.imageVariable, variable)" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
														id="variableImageFileControl" />
												</div>
												<div class="variables-content-field small">
													<img @click="deleteVariable(variable.variableId)" style="width: 15px; height: 15px" src="@/assets/images/cancel.png" />
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							<!-- Others Tab  -->
							<div v-show="locals.activeTab === locals.tabs.OTHERS" class="others-tab">
								<div class="toolbar-header variables-header" style="border-right: 1px solid #81c3ff">
									<span>{{_$t('template-builder.save')}}</span>
								</div>
								<div class="toolbar-content-row">
									<div style="width: 100%;" class="toolbar-content-field">
										<a class="a-btn" @click="export2SrcFile()">{{_$t('template-builder.export')}}</a>
									</div>
								</div>
								<div class="toolbar-content-row">
									<div style="width: 100%;" class="toolbar-content-field">
										<a class="a-btn" @click="clickedOnInput('fileSrcControl')">{{_$t('template-builder.import')}}</a>
									</div>
								</div>
								<div style="display:none" class="toolbar-content-row">
									<div class="variables-content-field">
										<input type="file" @change="onFileChange(locals.fileEntryTypes.VCPSrcFile)" aria-label="Small" aria-describedby="inputGroup-sizing-sm" id="fileSrcControl" />
									</div>
								</div>
							</div>

							<!-- Settings Tab -->
							<div v-show="locals.activeTab === locals.tabs.SETTINGS" class="settings-tab">

								<!-- Settings -->
								<div class="toolbar-header" style="border-right: 1px solid #81c3ff">
									<span>{{_$t('template-builder.print-settings')}}</span>
								</div>
								<div class="toolbar-content-wrapper" id="printConfigsMenu">
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<span>{{_$t('template-builder.template-name')}}</span>
										</div>
										<div class="toolbar-content-field">
											<input type="text" v-model="settings.designName" class="input-form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<span>{{_$t('template-builder.language')}}</span>
										</div>
										<div class="toolbar-content-field">
											<select class="input-form-control" v-model="_$i18n.locale">
												<option v-for="(lang, i) in locals.langs" :key="`Lang${i}`" :value="lang">
													{{ lang }}
												</option>
											</select>
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<label for="pageSizeControl">{{_$t('template-builder.page-size')}}</label>
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
											<label for="pageOrientiationsControl">{{_$t('template-builder.page-orientation')}}</label>
										</div>
										<div class="toolbar-content-field">
											<select class="input-form-control" @change="syncSizes()" v-model="settings.orientation" id="pageOrientiationsControl">
												<option value="portrait">{{_$t('template-builder.vertical')}}</option>
												<option value="landscape">{{_$t('template-builder.horizental')}}</option>
											</select>
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<span>{{_$t('template-builder.page-border')}}</span>
										</div>
										<div class="toolbar-content-field">
											<input type="text" class="input-form-control" v-model="settings.pageBorder" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<label for="repeatableHeaderControl">{{_$t('template-builder.repeat-header')}}</label>
										</div>
										<div class="toolbar-content-field">
											<input class="input-form-control" type="checkbox" v-model="settings.header.repeatable" id="repeatableHeaderControl" />
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<label for="repeatableFooterControl">{{_$t('template-builder.repeat-footer')}}</label>
										</div>
										<div class="toolbar-content-field">
											<input class="input-form-control" type="checkbox" v-model="settings.footer.repeatable" id="repeatableFooterControl" />
										</div>
									</div>
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<span>{{_$t('template-builder.page-direction')}}</span>
										</div>
										<div class="toolbar-content-field" style="text-align: right">
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
								<div class="toolbar-header">
									<span>{{_$t('template-builder.elements.name')}}</span>
								</div>
								<div class="toolbar-content-wrapper" style="flex-direction: row" id="elementsMenu">
									<div class="toolbar-content-row-elements">
										<div class="toolbar-content-row-element">
											<span draggable="true" @dragstart="startDraggingElement(locals.ElementTypes.TEXTELEMENT)" @dragend="finishedDraggingElement()">
												<img src="@/assets/images/text.png" :alt="_$t('template-builder.elements.textelement')" />
												<div class="element-title">{{_$t('template-builder.elements.textelement')}}</div>
											</span>
										</div>
									</div>
									<div class="toolbar-content-row-elements">
										<div class="toolbar-content-row-element">
											<span draggable="true" @dragstart="startDraggingElement(locals.ElementTypes.DATETIME)" @dragend="finishedDraggingElement()">
												<img src="@/assets/images/timetable.png" :alt="_$t('template-builder.elements.datetime')" />
												<div class="element-title">{{_$t('template-builder.elements.datetime')}}</div>
											</span>
										</div>
									</div>
									<div class="toolbar-content-row-elements">
										<div class="toolbar-content-row-element">
											<span draggable="true" @dragstart="startDraggingElement(locals.ElementTypes.PAGECOUNTER)" @dragend="finishedDraggingElement()">
												<img src="@/assets/images/pages.png" :alt="_$t('template-builder.elements.pagecounter')" />
												<div class="element-title">{{_$t('template-builder.elements.pagecounter')}}</div>
											</span>
										</div>
									</div>
									<div class="toolbar-content-row-elements">
										<div class="toolbar-content-row-element">
											<span draggable="true" @dragstart="startDraggingElement(locals.ElementTypes.IMAGEELEMENT)" @dragend="finishedDraggingElement()">
												<img src="@/assets/images/image.png" alt="_$t('template-builder.elements.imageelement')" />
												<div class="element-title">{{_$t('template-builder.elements.imageelement')}}</div>
											</span>
										</div>
									</div>
									<div class="toolbar-content-row-elements">
										<div class="toolbar-content-row-element">
											<span draggable="true" @dragstart="startDraggingElement(locals.ElementTypes.BINDINGOBJECT)" @dragend="finishedDraggingElement()">
												<img src="@/assets/images/binding.png" :alt="_$t('template-builder.elements.bindingobject')" />
												<div class="element-title">{{_$t('template-builder.elements.bindingobject')}}</div>
											</span>
										</div>
									</div>
									<div class="toolbar-content-row-elements">
										<div class="toolbar-content-row-element">
											<span draggable="true" @dragstart="startDraggingElement(locals.ElementTypes.TEXTPATTERN)" @dragend="finishedDraggingElement()">
												<img src="@/assets/images/textpattern.png" :alt="_$t('template-builder.elements.textpattern')" />
												<div class="element-title">{{_$t('template-builder.elements.textpattern')}}</div>
											</span>
										</div>
									</div>
									<div class="toolbar-content-row-elements">
										<div class="toolbar-content-row-element">
											<span draggable="true" @dragstart="startDraggingElement(locals.ElementTypes.DATASET)" @dragend="finishedDraggingElement()">
												<img src="@/assets/images/data-set.png" :alt="_$t('template-builder.elements.dataset')" width="32" height="32" />
												<div class="element-title">{{_$t('template-builder.elements.dataset')}}</div>
											</span>
										</div>
									</div>
									<div class="toolbar-content-row-elements">
										<div class="toolbar-content-row-element">
											<span draggable="true" @dragstart="startDraggingElement(locals.ElementTypes.REPEATOR)" @dragend="finishedDraggingElement()">
												<img src="@/assets/images/repeat.png" :alt="_$t('template-builder.elements.repeator')" width="32" height="32" />
												<div class="element-title">{{_$t('template-builder.elements.repeator')}}</div>
											</span>
										</div>
									</div>
								</div>

								<!-- Element's Settings -->
								<div v-if="locals.selectedElement.type !== locals.ElementTypes.EMPTY && locals.selectedElement.type !== locals.ElementTypes.VARIABLE">
									<div class="toolbar-header">
										<span>{{_$t('template-builder.elements.settings', {elementType: _$t(`template-builder.elements.${locals.selectedElement.type}`)})}}</span>
									</div>

									<div class="toolbar-content-wrapper">

										<div v-if="locals.selectedElement.type === locals.ElementTypes.TEXTELEMENT" :id="`${locals.ElementTypes.TEXTELEMENT}_Settings`" class="element-settings">
											<div class="toolbar-content-row">
												<div style="text-align: center; width: 100%">
													<span>{{_$t('template-builder.elements.configs.type-text')}}</span>
												</div>
											</div>
											<div class="toolbar-content-row" v-if="locals.selectedElement.type === locals.ElementTypes.TEXTELEMENT">
												<div class="toolbar-content-field">
													<textarea :dir="settings.pageDirections" v-model="locals.selectedElement.configs.text" class="input-form-control" aria-label="Small"
														aria-describedby="inputGroup-sizing-sm"></textarea>
												</div>
											</div>
										</div>

										<div v-if="locals.selectedElement.type === locals.ElementTypes.DATETIME" :id="`${locals.ElementTypes.DATETIME}_Settings`" class="element-settings">
											<div class="toolbar-content-row">
												<div class="toolbar-content-label">
													<label for="hasDateControl">{{_$t('template-builder.elements.configs.date')}}</label>
												</div>
												<div class="toolbar-content-field">
													<input class="input-form-control" type="checkbox" v-model="locals.selectedElement.configs.hasDate" id="hasDateControl" />
												</div>
											</div>
											<div class="toolbar-content-row">
												<div class="toolbar-content-label">
													<label for="hasTimeControl">{{_$t('template-builder.elements.configs.time')}}</label>
												</div>
												<div class="toolbar-content-field">
													<input class="input-form-control" type="checkbox" v-model="locals.selectedElement.configs.hasTime" id="hasTimeControl" />
												</div>
											</div>
											<div class="toolbar-content-row">
												<div class="toolbar-content-label">
													<label for="persiaDateControl">{{_$t('template-builder.elements.configs.solar-date')}}</label>
												</div>
												<div class="toolbar-content-field">
													<input class="input-form-control" type="checkbox" v-model="locals.selectedElement.configs.persianDate" id="persiaDateControl" />
												</div>
											</div>
										</div>

										<div v-if="locals.selectedElement.type === locals.ElementTypes.PAGECOUNTER" :id="`${locals.ElementTypes.PAGECOUNTER}_Settings`" class="element-settings">
											<div class="toolbar-content-row">
												<div class="toolbar-content-label">
													<label for="persianNumbersControl">{{_$t('template-builder.elements.configs.persian-digits')}}</label>
												</div>
												<div class="toolbar-content-field">
													<input type="checkbox" class="input-form-control" v-model="locals.selectedElement.configs.persianNumbers" id="persianNumbersControl" />
												</div>
											</div>
											<div class="toolbar-content-row">
												<div class="toolbar-content-label">
													<label for="completeFormControl">{{_$t('template-builder.elements.configs.use-complete-format')}}</label>
												</div>
												<div class="toolbar-content-field">
													<input type="checkbox" class="input-form-control" v-model="locals.selectedElement.configs.completeForm" id="completeFormControl" />
												</div>
											</div>
										</div>

										<div v-if="locals.selectedElement.type === locals.ElementTypes.IMAGEELEMENT" :id="`${locals.ElementTypes.IMAGEELEMENT}_Settings`" class="element-settings">
											<div class="toolbar-content-row" style="flex-direction: column">
												<label for="elementImageFileControl">{{_$t('template-builder.elements.configs.upload-image-text')}}</label>
												<div class="imageelement-text">{{_$t('template-builder.elements.configs.maximum-file-size')}}</div>
												<div class="imageelement-text">{{_$t('template-builder.elements.configs.accepted-formats')}}</div>
												<div class="imageelement-text" style="direction: ltr; margin-top: 0px;">*.png, *. jpeg</div>
											</div>
											<div class="toolbar-content-row">
												<div style="width: 100%;" class="toolbar-content-field">
													<a class="a-btn" @click="clickedOnInput('elementImageFileControl')">{{_$t('template-builder.elements.configs.upload-image')}}</a>
												</div>
											</div>
											<div style="display: none;" class="toolbar-content-row">
												<input style="margin-right: 21px;" type="file" accept="image/*" @change="onFileChange(locals.fileEntryTypes.imageElement)" aria-label="Small"
													aria-describedby="inputGroup-sizing-sm" id="elementImageFileControl" />
											</div>
										</div>

										<div v-if="locals.selectedElement.type === locals.ElementTypes.BINDINGOBJECT" :id="`${locals.ElementTypes.BINDINGOBJECT}_Settings`" class="element-settings">
											<div class="toolbar-content-row">
												<div class="toolbar-content-label">
													<label for="bindingObjectPersianNumbersControl">{{_$t('template-builder.elements.configs.persian-digits')}}</label>
												</div>
												<div class="toolbar-content-field">
													<input type="checkbox" class="input-form-control" v-model="locals.selectedElement.configs.persianNumbers" id="bindingObjectPersianNumbersControl" />
												</div>
											</div>
											<div class="toolbar-content-row" v-if="locals.selectedElement.type === locals.ElementTypes.BINDINGOBJECT">
												<div class="toolbar-content-label">
													<label for="bindingObjectControl">{{_$t('template-builder.elements.configs.data-type')}}</label>
												</div>
												<div class="toolbar-content-field">
													<select class="input-form-control" v-model="locals.selectedElement.configs.field" id="bindingObjectControl">
														<option v-for="option in Object.keys(bindingObjectComputed)" :key="option">{{ option }}</option>
													</select>
												</div>
											</div>
										</div>

										<div v-if="locals.selectedElement.type === locals.ElementTypes.TEXTPATTERN" :id="`${locals.ElementTypes.TEXTPATTERN}_Settings`" class="element-settings">
											<div class="toolbar-content-row" v-if="locals.selectedElement.type === locals.ElementTypes.TEXTPATTERN">
												<div style="text-align: center; width: 100%">
													<span>{{_$t('template-builder.elements.configs.type-text')}}</span>
													<p>{{_$t('template-builder.elements.configs.textpattern-example', {name: '{name}'})}}</p>
												</div>
											</div>
											<div>
												<div class="toolbar-content-field">
													<textarea :dir="settings.pageDirections" v-model="locals.selectedElement.configs.text" class="input-form-control" aria-label="Small"
														aria-describedby="inputGroup-sizing-sm"></textarea>
												</div>
											</div>
											<div class="toolbar-content-row">
												<div class="toolbar-content-label">
													<label for="textPatternPersianNumbersControl">{{_$t('template-builder.elements.configs.persian-digits')}}</label>
												</div>
												<div class="toolbar-content-field">
													<input :dir="settings.pageDirections" type="checkbox" class="input-form-control" v-model="locals.selectedElement.configs.persianNumbers"
														id="textPatternPersianNumbersControl" />
												</div>
											</div>
											<div class="toolbar-content-row">
												<div class="toolbar-content-label">
													<label for="textpatternControl">{{_$t('template-builder.elements.configs.fields')}}</label>
												</div>
												<div class="toolbar-content-field">
													<select class="input-form-control" id="textpatternControl">
														<option v-for="option in Object.keys(bindingObjectComputed)" :key="option">{{ option }}</option>
													</select>
												</div>
											</div>
										</div>
									</div>

									<div v-if="locals.selectedElement.type === locals.ElementTypes.COLUMN" :id="`${locals.ElementTypes.COLUMN}_Settings`" class="element-settings">
										<div class="toolbar-content-row">
											<div style="width: 100%;" class="toolbar-content-label">
												<label for="dataSetNameControl">{{_$t('template-builder.elements.configs.order')}} ({{locals.selectedElement.configs.title}})</label>
											</div>
											<div class="toolbar-content-field">
												<label for="colActive">
													<input style="flex-grow: unset;" type="number" class="input-form-control" v-model="locals.selectedElement.configs.order" id="colActive" />
												</label>
											</div>
										</div>
									</div>

									<div v-if="locals.selectedElement.type === locals.ElementTypes.ROW" :id="`${locals.ElementTypes.ROW}_Settings`" class="element-settings">
										<div class="toolbar-content-row">
											<div class="toolbar-content-label">
												<label for="dataSetNameControl">{{_$t('template-builder.elements.configs.stylesTarget')}}</label>
											</div>
											<div class="toolbar-content-field">
												<select v-model="locals.selectedElement.configs.stylesTarget" class="input-form-control" id="dataSetNameControl">
													<option v-for="option in locals.StylesTargets" :value="option" :key="option">{{ _$t(`template-builder.elements.configs.${option}`) }}</option>
												</select>
											</div>
										</div>

										<div class="toolbar-content-row">
											<div class="toolbar-content-label">
												<label for="dataSetNameControl">{{_$t('template-builder.elements.configs.rowsHeight')}}</label>
											</div>
											<div class="toolbar-content-field">
												<input type="number" class="input-form-control" v-model="locals.selectedElement.configs.rowsHeight" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
											</div>
										</div>
									</div>

									<div v-if="locals.selectedElement.type === locals.ElementTypes.DATASET || locals.selectedElement.type === locals.ElementTypes.REPEATOR"
										:id="`${locals.selectedElement.type}_Settings`" class="element-settings">
										<div class="toolbar-content-row">
											<div class="toolbar-content-label">
												<label for="dataSetNameControl">{{_$t('template-builder.elements.configs.datasets')}}</label>
											</div>
											<div class="toolbar-content-field">
												<select v-model="locals.selectedElement.configs.selectedDataSet" class="input-form-control" id="dataSetNameControl">
													<option v-for="dataset in Object.keys(dataSetComputed)" :value="dataset" :key="dataset">{{ dataSetComputed[dataset].configs.title }}</option>
												</select>
											</div>
										</div>

									</div>

									<div v-if="locals.selectedElement.type === locals.ElementTypes.DATASET && locals.selectedElement.configs.selectedDataSet" class="toolbar-content-row element-settings"
										style="flex-wrap: wrap; justify-content: center;">
										<Toggler v-for="col in dataSetComputed[locals.selectedElement.configs.selectedDataSet].configs.columns" :key="col.id" @click="togglerClicked(col)"
											class="toolbar-content-label column-toggler" :options="prepareTogglerOptions(col)" />
									</div>

								</div>

								<!-- Element's Styles -->
								<div v-if="locals.selectedElement.type !== locals.ElementTypes.EMPTY">
									<div style="margin-top: 15px" class="toolbar-header">
										<span>{{_$t('template-builder.elements.styles.name', {elementType: _$t(`template-builder.elements.${locals.selectedElement.type}`)})}}</span>
									</div>
									<div class="toolbar-content-wrapper" id="elementStylesMenu">
										<div class="toolbar-content-row">
											<div class="toolbar-content-label">
												<label for="elementTextAlignControl">{{_$t('template-builder.elements.styles.text-align')}}</label>
											</div>
											<div class="toolbar-content-field">
												<select v-model="locals.selectedElement.styles.textAlign" class="input-form-control" id="elementTextAlignControl">
													<option value="right">{{_$t('template-builder.elements.styles.positions.right')}}</option>
													<option value="center">{{_$t('template-builder.elements.styles.positions.center')}}</option>
													<option value="left">{{_$t('template-builder.elements.styles.positions.left')}}</option>
												</select>
											</div>
										</div>
										<div class="toolbar-content-row">
											<div class="toolbar-content-label">
												<label for="elementTextAlignControl">{{_$t('template-builder.elements.styles.align-items')}}</label>
											</div>
											<div class="toolbar-content-field">
												<select v-model="locals.selectedElement.styles.alignItems" class="input-form-control" id="elementTextAlignControl">
													<option value="flex-start">{{_$t('template-builder.elements.styles.positions.top')}}</option>
													<option value="center">{{_$t('template-builder.elements.styles.positions.center')}}</option>
													<option value="flex-end">{{_$t('template-builder.elements.styles.positions.bottom')}}</option>
												</select>
											</div>
										</div>
										<div class="toolbar-content-row">
											<div class="toolbar-content-label">
												<span>{{_$t('template-builder.elements.styles.text-color')}}</span>
											</div>
											<div class="toolbar-content-field">
												<input type="color" class="input-form-control" v-model="locals.selectedElement.styles.color" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
											</div>
										</div>
										<div class="toolbar-content-row">
											<div class="toolbar-content-label">
												<span>{{_$t('template-builder.elements.styles.background-color')}}</span>
											</div>
											<div class="toolbar-content-field">
												<input type="color" class="input-form-control" v-model="locals.selectedElement.styles.backgroundColor" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
											</div>
										</div>
										<div class="toolbar-content-row">
											<div class="toolbar-content-label">
												<span>{{_$t('template-builder.elements.styles.font-size')}}</span>
											</div>
											<div class="toolbar-content-field">
												<select class="input-form-control" v-model="locals.selectedElement.styles.fontSize" id="pageSizeControl">
													<option v-for="option in locals.fontSizes" :key="option" :value="option + 'px'">{{ option }}</option>
												</select>
											</div>
										</div>
										<div class="toolbar-content-row">
											<div class="toolbar-content-label">
												<label for="fontWeightControl">{{_$t('template-builder.elements.styles.font-weight')}}</label>
											</div>
											<div class="toolbar-content-field">
												<select v-model="locals.selectedElement.styles.fontWeight" class="input-form-control" id="elementTextAlignControl">
													<option value="normal">{{_$t('template-builder.elements.styles.normal')}}</option>
													<option value="bold">{{_$t('template-builder.elements.styles.bold')}}</option>
												</select>
											</div>
										</div>
										<div class="toolbar-content-row">
											<div class="toolbar-content-label">
												<span>{{_$t('template-builder.elements.styles.font-family')}}</span>
											</div>
											<div class="toolbar-content-field">
												<input type="text" class="input-form-control" v-model="locals.selectedElement.styles.fontFamily" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
											</div>
										</div>
										<div class="toolbar-content-row">
											<div class="toolbar-content-label">
												<span>{{_$t('template-builder.elements.styles.borders')}}</span>
											</div>
											<div class="toolbar-content-field" style="text-align: right">
												<label for="bordersAlldirections">
													<input class="input-form-control" style="display: inline-block" type="checkbox" v-model="locals.bordersAllDirections" id="bordersAlldirections" />
													{{_$t('template-builder.elements.styles.border-on-all-directions')}}
												</label>
											</div>
										</div>
										<div class="toolbar-content-row" v-if="locals.bordersAllDirections">
											<div class="toolbar-content-label">
												<span>{{_$t('template-builder.elements.styles.border-style')}}</span>
											</div>
											<div class="toolbar-content-field">
												<input type="text" class="input-form-control" v-model="locals.selectedElement.styles.border" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
											</div>
										</div>
										<div v-if="locals.bordersAllDirections === false" style="width: 100%">
											<div class="toolbar-content-row">
												<div class="toolbar-content-label">
													<span>{{_$t('template-builder.elements.styles.border-top')}}</span>
												</div>
												<div class="toolbar-content-field">
													<input type="text" class="input-form-control" v-model="locals.selectedElement.styles.borderTop" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
												</div>
											</div>
											<div class="toolbar-content-row">
												<div class="toolbar-content-label">
													<span>{{_$t('template-builder.elements.styles.border-right')}}</span>
												</div>
												<div class="toolbar-content-field">
													<input type="text" class="input-form-control" v-model="locals.selectedElement.styles.borderRight" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
												</div>
											</div>
											<div class="toolbar-content-row">
												<div class="toolbar-content-label">
													<span>{{_$t('template-builder.elements.styles.border-bottom')}}</span>
												</div>
												<div class="toolbar-content-field">
													<input type="text" class="input-form-control" v-model="locals.selectedElement.styles.borderBottom" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
												</div>
											</div>
											<div class="toolbar-content-row">
												<div class="toolbar-content-label">
													<span>{{_$t('template-builder.elements.styles.border-left')}}</span>
												</div>
												<div class="toolbar-content-field">
													<input type="text" class="input-form-control" v-model="locals.selectedElement.styles.borderLeft" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
												</div>
											</div>
										</div>
										<div class="toolbar-content-row">
											<div class="toolbar-content-label">
												<span>{{_$t('template-builder.elements.styles.text-direction')}}</span>
											</div>
											<div class="toolbar-content-field" style="text-align: right">
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
										<div class="toolbar-content-row">
											<div class="toolbar-content-label">
												<span>{{_$t('template-builder.elements.styles.top')}}</span>
											</div>
											<div class="toolbar-content-field">
												<input type="text" class="input-form-control" v-model="locals.selectedElement.styles.top" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
											</div>
										</div>
										<div class="toolbar-content-row">
											<div class="toolbar-content-label">
												<span>{{_$t('template-builder.elements.styles.left')}}</span>
											</div>
											<div class="toolbar-content-field">
												<input type="text" class="input-form-control" v-model="locals.selectedElement.styles.left" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
											</div>
										</div>
										<div class="toolbar-content-row">
											<div class="toolbar-content-label">
												<span>{{_$t('template-builder.elements.styles.width')}}</span>
											</div>
											<div class="toolbar-content-field">
												<input type="text" class="input-form-control" v-model="locals.selectedElement.styles.width" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
											</div>
										</div>
										<div class="toolbar-content-row">
											<div class="toolbar-content-label">
												<span>{{_$t('template-builder.elements.styles.height')}}</span>
											</div>
											<div class="toolbar-content-field">
												<input type="text" class="input-form-control" v-model="locals.selectedElement.styles.height" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
											</div>
										</div>
									</div>
								</div>

								<!-- Section's Styles -->
								<div v-if="locals.selectedSection">
									<div style="margin-top: 15px" class="toolbar-header">
										<span>{{_$t('template-builder.sections.styles', {sectionName: locals.selectedSection})}}</span>
									</div>
									<!-- <div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<span>{{_$t('template-builder.elements.styles.background-color')}}</span>
										</div>
										<div class="toolbar-content-field">
											<input type="color" class="input-form-control" v-model="settings[locals.selectedSection].styles.backgroundColor" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
										</div>
									</div> -->
									<div class="toolbar-content-row">
										<div class="toolbar-content-label">
											<span>{{_$t('template-builder.elements.styles.borders')}}</span>
										</div>
										<div class="toolbar-content-field" style="text-align: right">
											<label for="bordersAlldirections">
												<input class="input-form-control" style="display: inline-block" type="checkbox" v-model="locals.bordersAllDirections" id="bordersAlldirections" />
												{{_$t('template-builder.elements.styles.border-on-all-directions')}}
											</label>
										</div>
									</div>
									<div class="toolbar-content-row" v-if="locals.bordersAllDirections">
										<div class="toolbar-content-label">
											<span>{{_$t('template-builder.elements.styles.border-style')}}</span>
										</div>
										<div class="toolbar-content-field">
											<input type="text" class="input-form-control" v-model="settings[locals.selectedSection].styles.border" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
										</div>
									</div>
									<div v-if="!locals.bordersAllDirections" style="width: 100%">
										<div class="toolbar-content-row">
											<div class="toolbar-content-label">
												<span>{{_$t('template-builder.elements.styles.border-top')}}</span>
											</div>
											<div class="toolbar-content-field">
												<input type="text" class="input-form-control" v-model="settings[locals.selectedSection].styles.borderTop" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
											</div>
										</div>
										<div class="toolbar-content-row">
											<div class="toolbar-content-label">
												<span>{{_$t('template-builder.elements.styles.border-right')}}</span>
											</div>
											<div class="toolbar-content-field">
												<input type="text" class="input-form-control" v-model="settings[locals.selectedSection].styles.borderRight" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
											</div>
										</div>
										<div class="toolbar-content-row">
											<div class="toolbar-content-label">
												<span>{{_$t('template-builder.elements.styles.border-bottom')}}</span>
											</div>
											<div class="toolbar-content-field">
												<input type="text" class="input-form-control" v-model="settings[locals.selectedSection].styles.borderBottom" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
											</div>
										</div>
										<div class="toolbar-content-row">
											<div class="toolbar-content-label">
												<span>{{_$t('template-builder.elements.styles.border-left')}}</span>
											</div>
											<div class="toolbar-content-field">
												<input type="text" class="input-form-control" v-model="settings[locals.selectedSection].styles.borderLeft" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
											</div>
										</div>
									</div>
								</div>
								<hr />
							</div>
						</div>
					</div>

					<!-- Section 2 (Template)-->
					<div style="overflow: auto; width: 100%; padding: 20px">
						<div class="toolbar">
							<img src="@/assets/images/zoom-in.png" style="width: 16px" @click="locals.scale += 0.1" />
							<img src="@/assets/images/zoom-out.png" style="width: 16px" @click="locals.scale -= 0.1" />
							<img src="@/assets/images/delete.png" style="width: 16px" @click="deleteElement()" />
							<img src="@/assets/images/expand.png" style="width: 16px" @click="fullScreen()" />
						</div>
						<div class="template-container"
							:style="{'min-height': settings.defaultHeightOfPaper + 'in', width: settings.defaultWidthOfPaper + 'in','transform-origin': 'top right', transform: `scale(${locals.scale})`}">
							<div ref="template" :style="{width: '100%', height: locals.templateHeight + 'in', border: settings.pageBorder}" class="template" @click="deSelectAll">
								<Section v-for="section in locals.sections" :set="currentSection = settings[section]" :key="section" :section="section" :elements="currentSection.elements"
									:active="locals.selectedSection === section" :height="currentSection.height" :styles="currentSection.styles" @finishedEditingElement="finishedEditingElement"
									@clickedOnElement="clickedOnElement" @clickedOnSection="clickedOnSection" @droppedElement="droppedElement" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { IElement, IEmptyElement, IVariable, ICreateElementExtraArgs } from '~/interfaces/elements'
	import { fileEntryTypes, TemplateBuilderSections, Tabs } from '~/enums/general'
	import { ElementParents, ElementTypes, StylesTargets, VariableTypes } from '~/enums/element'
	import { IJson } from '~/interfaces/general'
	import { fetchLangList } from '~/translations'
	import { Element, BindingObjectLikeElement, DataSetLikeElement, EmptyElement } from '~/plugins/element-utilities'
	import { idGenerator, convert2Inches, toFloatVal, merge, clone, encode2Base64, prepareSettings, isEmpty, getDefaultSettings, decodeFromBase64 } from '~/plugins/general-utilities'
	import { saveAs } from 'file-saver'
	import { ElementGrandParents } from '@/enums/element'
	import { useVariablesStore } from '~/stores/variables'
	import { IColumn, IDataset } from '@/interfaces/datasets'

	const variablesStore = useVariablesStore()

	export default {
		name: "TemplateBuilder",
		props: {
			options: Object,
			configurations: Object,
			bindingObject: Object,
			dataSets: { type: Object, default: () => ({}) },
		},
		computed: {
			bindingObjectComputed() {
				if (this.locals.selectedElement instanceof BindingObjectLikeElement)
					return this.locals.selectedElement.computeBindingObject(this.settings)
			},
			dataSetComputed() {
				if (this.locals.selectedElement instanceof DataSetLikeElement)
					return this.locals.selectedElement.computeDatasets(this.settings)
			},
			variablesList() {
				return variablesStore.getVarialbesList
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
					bordersAllDirections: true,
					activeTab: Tabs.SETTINGS,
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
					this.settings = prepareSettings(this.settings, val, this.bindingObject, this.dataSets)
				},
			}
		},
		mounted() {
			this.initCopyPaste()
			this.keyboardHandler()
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

				else
					columns.push(col)
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

				if (e.target.id && e.target.id.includes('Template'))
					this.locals.selectedSection = section
			},
			/**
			 * Fullscreen TB view
			 */
			fullScreen() {
				var TBContainer = document.getElementById('fullscreenControl')
				if (this.locals.fullScreen) {
					this.locals.fullScreen = false
					TBContainer.style.margin = '2% auto'
					TBContainer.style.width = '1090px'
				}
				else {
					this.locals.fullScreen = true
					TBContainer.style.margin = '2%'
					TBContainer.style.width = 'unset'
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

				var index = array.findIndex(x => x.id === element.id)

				if (index > -1)
					array.splice(index, 1)
			},

			/**
			 * Init copy paste listenners.
			 */
			initCopyPaste(): void {
				document.addEventListener("keydown", this.copyCurrentElement, false)
				document.addEventListener("keyup", this.pasteCopiedElement, false)
			},
			/**
			 * Terminate copy paste listenners.
			 */
			terminateCopyPaste(): void {
				document.removeEventListener("keydown", this.copyCurrentElement, false)
				document.removeEventListener("keyup", this.pasteCopiedElement, false)
			},
			/**
			 * Copy selected element.
			 */
			copyCurrentElement(e: any): void {

				if (this.locals.selectedElement.type === ElementTypes.EMPTY)
					return

				if (e.keyCode == 67 && e.ctrlKey) // 67 = c
					this.locals.copiedElement = clone(this.locals.selectedElement)
			},
			/**
			 * Paste copied element.
			 */
			pasteCopiedElement(e: any): void {

				if (this.locals.selectedElement === ElementTypes.EMPTY)
					return

				if (e.keyCode == 86 && e.ctrlKey) { // 86 = v
					var parent = this.locals.selectedElement.parent
					var array = this.settings[parent].elements
					this.locals.copiedElement.id = idGenerator()
					this.locals.copiedElement.styles.top = '0px'

					if (this.locals.copiedElement.repeatorId) {
						var repeator = array.find(x => x.id === this.locals.copiedElement.repeatorId)
						repeator.configs.appendedElements.push(this.locals.copiedElement)
					}
					else
						array.push(this.locals.copiedElement)
				}
			},

			/**
			 * Save Changes on TB close.
			 * @return {Object} - json file
			 */
			save(): void {
				let json: IJson = this.export2Json()

				// this.terminateCopyPaste()

				if (this.settings.callback)
					this.settings.callback(json)

				var text = this._$t('template-builder.alerts.save-success')
				alert(text)
			},
			/**
			 * Exports settings to json a file.
			 * @return {Object} - json file
			 */
			export2Json(): IJson {
				this.settings.totalHeightOfAPaper = this.settings.defaultHeightOfPaper - this.settings.header.height - this.settings.footer.height

				if (this.settings.totalHeightOfAPaper < 0)
					this.settings.totalHeightOfAPaper = 1.77

				let tmp: any = this.settings
				tmp.variables = this.variablesList
				return tmp as IJson
			},

			/**
			 * Exports settings to vcp file.
			 * @return {File} - save settings file in browser
			 */
			export2SrcFile(): void {
				let settings: IJson = this.export2Json()
				var encoded: string = encode2Base64(JSON.stringify(settings)) // encoding the settings to export

				var currentdate = new Date()
				var defaultDesignName = 'vcp' + "_"
					+ currentdate.getFullYear() + "_"
					+ (currentdate.getMonth() + 1) + "_"
					+ currentdate.getDate() + "_"
					+ currentdate.getHours() + "_"
					+ currentdate.getMinutes()

				let fileName = this.settings.designName === '' ? defaultDesignName : this.settings.designName

				var blob = new Blob([encoded],
					{ type: "text/plain;charset=utf-8" })
				saveAs(blob, `${fileName}.vcp`)
			},

			/**
			 * Imports settings from src file and assign merge with settings.
			 * @param {srcFile} srcFile - given srcFile
			 * @return {void} - void
			 */
			importFromSrcFile(srcFile: File): void {
				var callback = this.settings.callback || null
				this.settings = getDefaultSettings() // Set the settings to default value
				var jsonFile: any = JSON.parse(decodeFromBase64(srcFile))


				if (jsonFile.variables) {
					variablesStore.updateVariables(jsonFile.variables)
					delete jsonFile.variables
				}

				this.settings = merge(this.settings, jsonFile) // assign the changes

				for (var section of this.locals.sections) {

					for (let index = 0; index < this.settings[section].elements.length; index++) {
						var elem = this.settings[section].elements[index]
						this.settings[section].elements[index] = this.createElement(elem.type, ElementParents[section.toUpperCase()], { styles: elem.styles, configs: elem.configs })
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
					let section = document.getElementsByClassName(`section ${sectionName}`)[0] // element to make resizable

					var resizer = document.createElement("div")
					resizer.className = "resizer"
					resizer.style.height = "10px"
					section.appendChild(resizer)
					resizer.addEventListener("mousedown", (e) => initDrag(e, section), false)

					var startY, startHeight, parentHeight

					const initDrag = (e, section) => {
						startY = e.clientY
						parentHeight = this.locals.templateHeight

						startHeight = parseInt(document.defaultView.getComputedStyle(section).height, 10)

						document.documentElement.addEventListener("mousemove", doDrag, false)
						document.documentElement.addEventListener("mouseup", stopDrag, false)
					}

					const doDrag = (e) => {
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

					const stopDrag = (e) => {
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

				let previousTab = document.getElementsByClassName('tab selected')[0]
				var tab = this.$refs[tabName] as HTMLElement

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
				let selectedElements = document.getElementsByClassName("element selected")
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
			createElement(elementType: ElementTypes, parent: ElementParents, extraArgs?: ICreateElementExtraArgs): IElement {

				var configs: any = merge({}, extraArgs?.configs || {})
				var baseStyles = {
					top: extraArgs?.e?.offsetY + 'px' || '0px',
					left: extraArgs?.e?.offsetX + 'px' || '0px',
					direction: this.settings.pageDirections
				}
				var styles: any = merge(baseStyles, extraArgs?.styles || {})

				switch (elementType) {

					case ElementTypes.VARIABLE:
						configs = merge(extraArgs?.variable || {}, configs)
						break

					case ElementTypes.REPEATOR:
					case ElementTypes.DATASET:
						return new DataSetLikeElement(elementType, parent, ElementGrandParents.TEMPLATEBUILDER, styles, configs, '')

					case ElementTypes.BINDINGOBJECT:
					case ElementTypes.TEXTPATTERN:
						return new BindingObjectLikeElement(elementType, parent, ElementGrandParents.TEMPLATEBUILDER, styles, configs, '')

					case ElementTypes.IMAGEELEMENT:
						configs = merge({ imageSrc: this.configurations.imageSrc }, configs)
						break

					default:
						break
				}
				return new Element(elementType, parent, ElementGrandParents.TEMPLATEBUILDER, styles, configs, '')
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

			/**
			 * Method that triggers on element drop on header / footer.
			 */
			droppedElement(parent: ElementParents, e: any, parentElement?: IElement): void {

				var elementType: ElementTypes = this.locals.elementType
				var isChild = parentElement && parentElement.type === ElementTypes.REPEATOR
				var parentId: string = parentElement ? parentElement.id : `${parent}Template`

				if (elementType === ElementTypes.EMPTY)
					return

				var elementInstance: IElement = this.createElement(elementType, parent, { e, variable: this.locals.currentVariable })

				if (!this.elementValidator(elementInstance, isChild, parentElement)) {
					elementType = ElementTypes.EMPTY
					return
				}

				elementInstance = this.adjustElementToPage(elementInstance, parentId)

				if (isChild) { // Element is dropped on another element.
					elementInstance.isChild = true
					elementInstance.repeatorId = parentElement!.id
					parentElement!.configs.appendedElements.push(elementInstance)
				}
				else {
					this.settings[parent].elements.push(elementInstance)
				}

				elementType = ElementTypes.EMPTY
			},

			elementValidator(element: IElement, isChild: boolean = false, parentElement?: IElement): boolean {

				this.locals.selectedElement = element

				const DISSALLOWED_CHILDTYPES = [ElementTypes.PAGECOUNTER, ElementTypes.REPEATOR]

				if (element instanceof DataSetLikeElement && isEmpty(this.dataSetComputed)) {
					alert('[VCP] DataSet is empty')
					throw Error('[VCP] DataSet is empty')
				}

				if (element instanceof BindingObjectLikeElement && isEmpty(this.bindingObjectComputed)) {
					alert('[VCP] BindingObject is empty')
					throw Error('[VCP] BindingObject is empty')
				}

				if (isChild) {

					if (DISSALLOWED_CHILDTYPES.includes(element.type)) {
						var type = this._$t(`template-builder.elements.${element.type}`)
						var text = this._$t('template-builder.validators.element-type-cant-be-child', { type: type })
						alert(text)
						return false
					}

					// if child element wants to be parent element
					if (parentElement!.isChild) {
						var text = this._$t('template-builder.validators.child-cant-be-parent')
						alert(text)
						return false
					}
				}

				this.locals.selectedElement = new EmptyElement
				return true
			},

			/** Controls if added element is outside page borders and adjust if so.
				* @param {Object} element - element object
				* @param {String} sectionId - section id that element is dropped to (parent)
				* @return {Object} element - adjusted element
				*/
			adjustElementToPage(element: IElement, sectionId: string): IElement {
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
				this.$refs.template.classList.remove("dragged")
			},

			/**
			 * Method that triggers on file change.
			 * @param {fileEntryTypes} type - enrty type
			 * @param {IElement} variable - variable
			 * @return {void} - void
			 */
			onFileChange(type: fileEntryTypes, variable: IElement): void {
				let maximumFileSize = this.configurations.maximumFileSize * 1000
				var file

				const fileValidator = (file: any, maximumFileSize: number, validTypes: string[]) => {

					if (validTypes.length && !validTypes.includes(file.type)) {
						var text = this._$t('template-builder.alerts.format-notsupported')
						return alert(text)
					}

					if (file.size >= maximumFileSize) {// Check if the file size is under 1MB the image size value is in bytes
						var text = this._$t('template-builder.alerts.fileSize-exceeded', { size: maximumFileSize })
						return alert(text)
					}
					return true
				}

				const getFile = (id: string) => (<HTMLInputElement>document.getElementById(id)).files[0]

				switch (type) {
					case fileEntryTypes.imageElement:

						file = getFile('elementImageFileControl')

						if (fileValidator(file, maximumFileSize, ['image/jpeg', 'image/png']))
							this.toBase64(file).then(res => this.locals.selectedElement.configs.imageSrc = res)

						break

					case fileEntryTypes.imageVariable:

						file = getFile('variableImageFileControl')

						if (fileValidator(file, maximumFileSize, ['image/jpeg', 'image/png']))
							this.toBase64(file).then(res => variable.context = res)

						break

					case fileEntryTypes.VCPSrcFile:
					default:

						file = (<HTMLInputElement>document.getElementById('fileSrcControl')).files[0]

						if (!file.name.includes('.vcp')) {
							var text = this._$t('template-builder.alerts.format-notsupported')
							return alert(text)
						}

						if (fileValidator(file, maximumFileSize, [])) {

							var fr = new FileReader()
							fr.readAsText(file)
							fr.onload = () => this.importFromSrcFile(fr.result)
							fr.onerror = (err) => alert(err)

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
					reader.onload = () => resolve(reader.result)
					reader.onerror = (error) => reject(error)
				})
			},

			/**
			 * Adds an event listenner on delete button and then removes the element
			 */
			keyboardHandler(): void {
				const elementStyleChanger = (style: string, operator: string, e: any): void => {
					e.preventDefault()
					this.locals.selectedElement.styles[style] = toFloatVal(this.locals.selectedElement.styles[style])
					this.locals.selectedElement.styles[style] = eval(`${this.locals.selectedElement.styles[style]} ${operator} 1`)
					this.locals.selectedElement.styles[style] = this.locals.selectedElement.styles[style] + 'px'
				}
				const keyBinds = (e: any): void => {
					const expandDownSections: TemplateBuilderSections[] = [TemplateBuilderSections.HEADER, TemplateBuilderSections.BEFOREBODY]

					if (e.keyCode === 38) { // 38:ArrowUp
						e.preventDefault()

						if (this.locals.selectedSection) { // section resize 

							if (expandDownSections.includes(this.locals.selectedSection))
								this.settings[this.locals.selectedSection].height -= 0.01
							else
								this.settings[this.locals.selectedSection].height += 0.01
						}

						else if (this.locals.selectedElement.type !== ElementTypes.EMPTY) {
							if (e.ctrlKey) // element resize
								elementStyleChanger('height', '-', e)
							else // element drag
								elementStyleChanger('top', '-', e)
						}

					}

					if (e.keyCode === 40) { // 40:ArrowDown
						e.preventDefault()

						if (this.locals.selectedSection) { // section resize 

							if (expandDownSections.includes(this.locals.selectedSection))
								this.settings[this.locals.selectedSection].height += 0.01
							else
								this.settings[this.locals.selectedSection].height -= 0.01
						}

						else if (this.locals.selectedElement.type !== ElementTypes.EMPTY) {
							if (e.ctrlKey) // element resize
								elementStyleChanger('height', '+', e)
							else // element drag
								elementStyleChanger('top', '+', e)
						}
					}

					if (e.keyCode === 39) { // 39:ArrowRight
						if (this.locals.selectedElement.type === ElementTypes.EMPTY)
							return

						if (e.ctrlKey) // element resize
							elementStyleChanger('width', '+', e)
						else // element drag
							elementStyleChanger('left', '+', e)

					}

					if (e.keyCode === 37) { // 41:ArrowLeft
						if (this.locals.selectedElement.type === ElementTypes.EMPTY)
							return

						if (e.ctrlKey) // element resize
							elementStyleChanger('width', '-', e)
						else // element drag
							elementStyleChanger('left', '-', e)
					}

					if (e.keyCode === 46) { // // 46:Delete

						const NOTDELETABLE = [ElementTypes.EMPTY, ElementTypes.COLUMN, ElementTypes.ROW]

						if (NOTDELETABLE.includes(this.locals.selectedElement.type))
							return

						var parent = this.locals.selectedElement.parent
						var array: IElement[] = this.settings[parent].elements

						if (parent === ElementParents.EMPTY || !array.length)
							return

						if (this.locals.selectedElement.isChild) { // it's a repeator's child element.

							let index = array.findIndex(x => x.id === this.locals.selectedElement.repeatorId) // repeator index in elements array

							if (index > -1) {
								let repeator = array[index]
								var children: IElement[] = repeator.configs.appendedElements

								index = children.findIndex(x => x.id === this.locals.selectedElement.id) // child index in repeator children array

								if (index > -1)
									children.splice(index, 1)
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
				}
				document.removeEventListener('keyup', keyBinds, false)
				document.addEventListener('keydown', keyBinds, false)
			},

			/**
			 * function to display modal
			 */
			showModal(): void {
				document.getElementById("templateBuilderModal").style.display = "block"
			},

			/**
			 * function that triggers while editing is finished.
			 * @param {Object} element - element
			 * @return {void} - void
			 */
			finishedEditingElement(element: IElement, section: TemplateBuilderSections): void {

				var array = this.settings[section].elements

				if (this.locals.selectedElement.isChild) { // it's a repeator.
					let index = array.findIndex(x => x.id === this.locals.selectedElement.repeatorId)
					if (index > -1) {
						let repeator = array[index]
						var children = repeator.configs.appendedElements
						index = children.findIndex((x: IElement) => x.id === this.locals.selectedElement.id)
						if (index > -1)
							children[index].styles = merge(children[index].styles, children[index].getCoordinates())
					}
				}

				let elem = array.find(x => x.id === element.id)
				elem.styles = merge(elem.styles, element.getCoordinates())
			},

			/**
			 * function that triggers when clicked on input.
			 * @param {string} id - element id
			 * @return {void} - void
			 */
			clickedOnInput(id: string): void {
				document.getElementById(id).click()
			},
		},
	};
</script>	
