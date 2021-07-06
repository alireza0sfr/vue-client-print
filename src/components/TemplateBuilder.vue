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
          <div
            :style="{'height': settings.defaultHeightOfPaper + 'in',
        }"
            class="toolbar-container"
          >
            <div class="toolbar-content">
              <div class="toolbar-header">
                <span>تنظیمات پرینت</span>
              </div>
              <div class="toolbar-content-wrapper" id="printConfigsMenu">
                <div class="toolbar-content-row">
                  <div class="toolbar-content-label">
                    <label for="pageSizeControl">نوع صفحه</label>
                  </div>
                  <div class="toolbar-content-field">
                    <select
                      class="input-form-control"
                      v-model="settings.pageSize"
                      @change="calculateSizes()"
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
                      @change="calculateSizes()"
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
                    <span>اسم فایل</span>
                  </div>
                  <div class="toolbar-content-field">
                    <input
                      type="text"
                      v-model="settings.fileName"
                      class="input-form-control"
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
                      v-model="settings.isHeaderRepeatable"
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
                      v-model="settings.isFooterRepeatable"
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
                              <input type="radio"
                                     name="pageDirections"
                                     id="pageDirections"
                                     value="ltr"
                                     v-model="settings.pageDirections" />
                              راست به چپ
                          </label>
                      </div>
                      <div>
                          <label for="pageDirections">
                              <input type="radio"
                                     name="pageDirections"
                                     id="pageDirections"
                                     value="rtl"
                                     v-model="settings.pageDirections" />
                              چپ به راست
                          </label>
                      </div>
                  </div>
                </div>
              </div>
              <div class="toolbar-header">
                <span>المنت ها</span>
              </div>
              <div class="toolbar-content-wrapper" style="flex-direction: row;" id="elementsMenu">
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
                      class="d-sm-inline"
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
                      class="d-sm-inline"
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
                      class="d-sm-inline"
                    >
                      <img src="./elements/images/binding.png" alt="اتصال داده" />
                      <div class="element-title">اتصال داده</div>
                    </span>
                  </div>
                </div>
              </div>
              <div class="toolbar-header">
                <span>تنظیمات المنت ها</span>
              </div>
              <div class="toolbar-content-wrapper">
                <div
                  v-if="locals.selectedElement.type == 'textelement'"
                  class="toolbar-content-row"
                >
                  <div class="toolbar-content-label">
                    <span>متن</span>
                  </div>
                  <div class="toolbar-content-field">
                    <input
                      type="text"
                      v-model="locals.selectedElement.options.configs.text"
                      class="input-form-control"
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                    />
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
                      v-model="locals.selectedElement.options.configs.persianDate"
                      id="persiaDateControl"
                    />
                  </div>
                </div>
                <div
                  class="toolbar-content-row"
                  v-if="locals.selectedElement.type == 'pagecounter'"
                >
                  <div class="toolbar-content-label">
                    <label for="persianNumbersControl">اعداد فارسی</label>
                  </div>
                  <div class="toolbar-content-field">
                    <input
                      type="checkbox"
                      class="input-form-control"
                      v-model="locals.selectedElement.options.configs.persianNumbers"
                      id="persianNumbersControl"
                    />
                  </div>
                </div>
                <div
                  class="toolbar-content-row"
                  v-if="locals.selectedElement.type == 'imageelement'"
                >
                  <label
                    style="margin-right: 37px;"
                    for="imageFileControl"
                  >فایل تصویر خود را انتخاب کنید</label>
                </div>
                <div
                  class="toolbar-content-row"
                  v-if="locals.selectedElement.type == 'imageelement'"
                >
                  <input
                    type="file"
                    @change="onFileChange()"
                    aria-label="Small"
                    aria-describedby="inputGroup-sizing-sm"
                    id="imageFileControl"
                  />
                </div>

                <div
                  class="toolbar-content-row"
                  v-if="locals.selectedElement.type == 'imageelement'"
                >
                  <div class="toolbar-content-label">
                    <span>طول</span>
                  </div>
                  <div class="toolbar-content-field">
                    <input
                      type="text"
                      class="input-form-control"
                      v-model="locals.selectedElement.options.styles.height"
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                </div>
                <div
                  class="toolbar-content-row"
                  v-if="locals.selectedElement.type == 'imageelement'"
                >
                  <div class="toolbar-content-label">
                    <span>عرض</span>
                  </div>
                  <div class="toolbar-content-field">
                    <input
                      type="text"
                      class="input-form-control"
                      v-model="locals.selectedElement.options.styles.width"
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                </div>
                <div
                  class="toolbar-content-row"
                  v-if="locals.selectedElement.type == 'bindingObject'"
                >
                  <div class="toolbar-content-label">
                    <label for="bindingObjectControl">نوع داده</label>
                  </div>
                  <div class="toolbar-content-field">
                    <select
                      class="input-form-control"
                      v-model="locals.selectedElement.options.configs.field"
                      id="bindingObjectControl"
                    >
                      <option
                        v-for="option in Object.keys(settings.bindingObject)"
                        :key="option"
                      >{{option}}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div style="margin-top: 15px" class="toolbar-header">
                <span>استایل المنت ها</span>
              </div>
              <div class="toolbar-content-wrapper" id="elementStylesMenu">
                <div class="toolbar-content-row">
                  <div class="toolbar-content-label">
                    <label for="elementTextAlignControl">مکان نوشته</label>
                  </div>
                  <div class="toolbar-content-field">
                    <select
                      v-model="locals.selectedElement.options.styles.textAlign"
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
                    <span>اندازه فونت</span>
                  </div>
                  <div class="toolbar-content-field">
                    <input
                      type="text"
                      class="input-form-control"
                      v-model="locals.selectedElement.options.styles.fontSize"
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                    />
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
                      v-model="locals.selectedElement.options.styles.fontFamily"
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                </div>
                <div class="toolbar-content-row">
                    <div class="toolbar-content-label">
                        <span>استایل لبه ها</span>
                    </div>
                    <div class="toolbar-content-field" style="text-align: right">
                        <label for="bordersAlldirections">
                            <input class="input-form-control"
                                   style="display: inline-block"
                                   type="checkbox"
                                   v-model="locals.bordersAllDirections"
                                   id="bordersAlldirections" />
                            همه جهات
                        </label>
                    </div>
                </div>
                <div class="toolbar-content-row" v-if="locals.bordersAllDirections" >
                    <div style="margin-right: 10px;" class="toolbar-content-label">
                        <span>استایل همه لبه ها</span>
                    </div>
                    <div class="toolbar-content-field">
                        <input type="text"
                                class="input-form-control"
                                v-model="locals.selectedElement.options.styles.border"
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm" />
                    </div>
                </div>
                  <div v-if="locals.bordersAllDirections == false" style="width:100%">
                    <div class="toolbar-content-row">
                      <div class="toolbar-content-label">
                        <span>لبه بالا</span>
                      </div>
                      <div class="toolbar-content-field">
                        <input
                          type="text"
                          class="input-form-control"
                          v-model="locals.selectedElement.options.styles.borderTop"
                          aria-label="Small"
                          aria-describedby="inputGroup-sizing-sm"
                        />
                      </div>
                    </div>
                    <div class="toolbar-content-row">
                      <div class="toolbar-content-label">
                        <span>لبه راست</span>
                      </div>
                      <div class="toolbar-content-field">
                        <input
                          type="text"
                          class="input-form-control"
                          v-model="locals.selectedElement.options.styles.borderRight"
                          aria-label="Small"
                          aria-describedby="inputGroup-sizing-sm"
                        />
                      </div>
                    </div>
                    <div class="toolbar-content-row">
                      <div class="toolbar-content-label">
                        <span>لبه پایین</span>
                      </div>
                      <div class="toolbar-content-field">
                        <input
                          type="text"
                          class="input-form-control"
                          v-model="locals.selectedElement.options.styles.borderBottom"
                          aria-label="Small"
                          aria-describedby="inputGroup-sizing-sm"
                        />
                      </div>
                    </div>
                    <div class="toolbar-content-row">
                      <div class="toolbar-content-label">
                        <span>لبه چپ</span>
                      </div>
                      <div class="toolbar-content-field">
                        <input
                          type="text"
                          class="input-form-control"
                          v-model="locals.selectedElement.options.styles.borderLeft"
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
                    <div>
                      <input
                        class="form-check-input"
                        type="radio"
                        name="elementDirections"
                        id="elementDirections"
                        value="rtl"
                        v-model="locals.selectedElement.options.styles.direction"
                      />
                      <label class="form-check-label" for="elementDirections">راست به چپ</label>
                    </div>
                    <div>
                      <input
                        class="form-check-input"
                        type="radio"
                        name="elementDirections"
                        id="elementDirections2"
                        value="ltr"
                        v-model="locals.selectedElement.options.styles.direction"
                      />
                      <label class="form-check-label" for="elementDirections2">چپ به راست</label>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
            </div>
          </div>

          <!-- Section 2 (Template)-->
          <div style="overflow: auto;">
            <div
              :style="{'height': settings.defaultHeightOfPaper + 'in', 'width': settings.defaultWidthOfPaper + 'in'}"
              class="template"
              @click="deSelectAll"
            >
              <div
                :style="{'height': settings.pageHeaderSize + 'in',
              'min-height': '0.15in'}"
                id="headerTemplate"
                class="section header"
                ref="headerTemplate"
                @drop="droppedElementOnHeader()"
                @dragenter.prevent
                @dragover.prevent
              >
                <component
                  v-for="element in settings.headerElements"
                  :key="element"
                  :is="element.type"
                  :options="element.options"
                  @clickedOnElement="clickedOnElement(element)"
                  @finishedEditingElement="finishedEditingElement(element)"
                />
              </div>
              <div id="bodyTemplate">
                <div class="watermark">بدنه چاپ</div>
                <p>محتویات بدنه چاپ به صورت خودکار پر می شود.</p>
              </div>
              <div
                :style="{'height': settings.pageFooterSize + 'in',
              'min-height': '0.15in'}"
                id="footerTemplate"
                class="section footer"
                ref="footerTemplate"
                @drop="droppedElementOnFooter()"
                @dragenter.prevent
                @dragover.prevent
              >
                <component
                  v-for="element in settings.footerElements"
                  :key="element"
                  :is="element.type"
                  :options="element.options"
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
</template>

<script>
import TextElement from "./elements/TextElement.vue";
import DateTime from "./elements/DateTime.vue";
import BindingObject from "./elements/BindingObject.vue";
import PageCounter from "./elements/PageCounter.vue";
import ImageElement from "./elements/ImageElement.vue";
export default {
  name: "TemplateBuilder",
  props: {
    options: Object,
  },
  components: {
    textelement: TextElement,
    datetime: DateTime,
    pagecounter: PageCounter,
    imageelement: ImageElement,
    bindingObject: BindingObject,
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
        bordersAllDirections: true,
        isClicked: false,
        classType: "",
        selectedElement: {
          type: {},
          options: {
            id: 0,
            configs: {},
            styles: {},
          },
        },
      },
      settings: {
        pageHeaderSize: 0.5,
        pageFooterSize: 0.5,
        defaultHeightOfPaper: 11.7, // Standard Height of the chosen paper in inch
        defaultWidthOfPaper: 8.26, // Standard Width of the chosen paper in inch
        totalHeightOfAPaper: 10.4, // Useable height for body tag
        fileName: "nikan",
        isFooterRepeatable: true,
        isHeaderRepeatable: true,
        orientation: "portrait",
        pageSize: "a4",
        pageDirections: "rtl",
        headerElements: [],
        footerElements: [],
        bindingObject: {},
      },
    };
  },
  watch: {
    options: {
      deep: true,
      immediate: true,
      handler(val) {
        Object.assign(this.settings, val);
      },
    },
  },
  mounted() {
    this.modalFunc("templateBuilderModal", "TemplateBuilderModalCloseBtn");
  },
  methods: {
    /**
     * Exports all the data to a single json
     */

    export2Json() {
      // Syncing headerElements with the user chagnes
      let headerElements = this.settings.headerElements;
      let footerElements = this.settings.footerElements;

      for (let index = 0; index < headerElements.length; index++) {
        let computedStyles = this.getCoordinates(
          headerElements[index].options.id
        );
        let elementStyles = headerElements[index].options.styles;
        Object.assign(elementStyles, computedStyles);
      }

      for (let index = 0; index < footerElements.length; index++) {
        let computedStyles = this.getCoordinates(
          footerElements[index].options.id
        );
        // computedStyles.top = -parseInt(computedStyles.top) + "px";
        let elementStyles = footerElements[index].options.styles;
        Object.assign(elementStyles, computedStyles);
      }

      let totalHeightOfAPaper =
        this.settings.defaultHeightOfPaper -
        this.settings.pageHeaderSize -
        this.settings.pageFooterSize;

      if (totalHeightOfAPaper < 0) {
        totalHeightOfAPaper = 1.7;
      }

      let tmp = {
        header: {
          isHeaderRepeatable: this.settings.isHeaderRepeatable,
          height: this.settings.pageHeaderSize,
          headerElements: this.settings.headerElements,
        },
        footer: {
          isFooterRepeatable: this.settings.isFooterRepeatable,
          height: this.settings.pageFooterSize,
          footerElements: this.settings.footerElements,
        },
        orientation: this.settings.orientation,
        pageSize: this.settings.pageSize,
        pageDirections: this.settings.pageDirections,
        totalHeightOfAPaper: totalHeightOfAPaper,
      };

      // Closing the template builder modal after save
      document.getElementById("templateBuilderModal").style.display = "none";

      if (this.settings.callback != undefined) {
        this.settings.callback(tmp);
      }
    },

    /**
     * converts given inch to pixel
     */

    convert2Pixels(inches) {
      return (inches * 96).toFixed(2);
    },

    /**
     * Calculate the sizes based upon the selected page orientation and format
     */

    calculateSizes() {
      // Subtracting this value to make the pages more accurate
      const errorValue = 0.2;

      // Gettings the default sizes from the base dic
      this.settings.defaultHeightOfPaper =
        this.locals.pageSizeDictionary[this.settings.orientation][
          this.settings.pageSize
        ]["height"];
      this.settings.totalHeightOfAPaper =
        this.settings.defaultHeightOfPaper -
        this.settings.pageFooterSize -
        this.settings.pageHeaderSize -
        errorValue;

      this.settings.defaultWidthOfPaper =
        this.locals.pageSizeDictionary[this.settings.orientation][
          this.settings.pageSize
        ]["width"];
    },

    /**
     * Initializing dragging settings
     */

    settingsInitFunc() {
      setTimeout(() => {
        this.headerBorderDragFunc();
        this.footerBorderDragFunc();
      }, 100);
    },

    /**
     * converts given pixel to inch
     */

    convert2Inches(pixels) {
      return (pixels / 96).toFixed(2);
    },
    /**
     * Adjust the section's height by dragging
     */

    headerBorderDragFunc() {
      var headerSection = document.getElementsByClassName("section header")[0]; // element to make resizable

      var resizer = document.createElement("div");
      resizer.className = "resizer";
      resizer.style.height = "10px";
      headerSection.appendChild(resizer);
      resizer.addEventListener("mousedown", initDrag, false);

      var startY, startHeight;

      let that = this; // Storing this value to that to be able to use it inside a function

      function initDrag(e) {
        startY = e.clientY;
        startHeight = parseInt(
          document.defaultView.getComputedStyle(headerSection).height,
          10
        );
        document.documentElement.addEventListener("mousemove", doDrag, false);
        document.documentElement.addEventListener("mouseup", stopDrag, false);
      }

      function doDrag(e) {
        that.settings.pageHeaderSize = that.convert2Inches(
          startHeight + e.clientY - startY
        );
      }

      function stopDrag(e) {
        document.documentElement.removeEventListener(
          "mousemove",
          doDrag,
          false
        );
        document.documentElement.removeEventListener(
          "mouseup",
          stopDrag,
          false
        );
      }
    },

    /**
     * Adjust the section's height by dragging
     */

    footerBorderDragFunc() {
      var footerSection = document.getElementsByClassName("section footer")[0]; // element to make resizable

      var resizer = document.createElement("div");
      resizer.className = "resizer";
      resizer.style.height = "10px";
      footerSection.appendChild(resizer);
      resizer.addEventListener("mousedown", initDrag, false);

      var startY, startHeight;

      let that = this; // Storing this value to that to be able to use it inside a function

      function initDrag(e) {
        startY = e.clientY;
        startHeight = parseInt(
          document.defaultView.getComputedStyle(footerSection).height,
          10
        );
        document.documentElement.addEventListener("mousemove", doDrag, false);
        document.documentElement.addEventListener("mouseup", stopDrag, false);
      }

      function doDrag(e) {
        that.settings.pageFooterSize = that.convert2Inches(
          startHeight - e.clientY + startY
        );
      }

      function stopDrag(e) {
        document.documentElement.removeEventListener(
          "mousemove",
          doDrag,
          false
        );
        document.documentElement.removeEventListener(
          "mouseup",
          stopDrag,
          false
        );
      }
    },
    /**
     * Deselect all selected elements
     */

    deSelectAll() {
      if (this.locals.isClicked) {
        this.locals.isClicked = false;
        return;
      }

      this.locals.selectedElement = {
        type: {},
        options: {
          configs: {},
          styles: {},
        },
      };
      let selectedElements =
        document.getElementsByClassName("element selected");
      for (let index = 0; index < selectedElements.length; index++) {
        selectedElements[index].classList.remove("selected");
      }
    },

    clickedOnElement(element) {
      this.locals.selectedElement = element;
      this.deletingElementOnPressingDeleteKey();
      this.locals.isClicked = true;
    },

    createElement(parent) {
      let classType = this.locals.classType;
      let tmp;
      if (classType == "textelement") {
        tmp = {
          type: classType,
          options: {
            id: this.idGenerator(5),
            configs: { text: "متن خود را وارد نمایید" },
            styles: {},
          },
        };
      } else if (classType == "datetime") {
        tmp = {
          type: classType,
          options: {
            id: this.idGenerator(5),
            configs: { hasDate: true, hasTime: true, persianDate: true },
            styles: {},
          },
        };
      } else if (classType == "pagecounter") {
        tmp = {
          type: classType,
          options: {
            id: this.idGenerator(5),
            configs: { counter: 1, persianNumbers: true },
            styles: {},
          },
        };
      } else if (classType == "imageelement") {
        tmp = {
          type: classType,
          options: {
            id: this.idGenerator(5),
            configs: { imageSrc: require("./elements/images/logo.png") },
            styles: {},
          },
        };
      } else if (classType == "bindingObject") {
        tmp = {
          type: classType,
          options: {
            id: this.idGenerator(5),
            configs: {
              field: "اتصال فیلد را انتخاب کنید",
              bindingObject: {},
            },
            styles: {},
          },
        };
      }
      if (parent.includes("header")) {
        this.settings.headerElements.push(tmp);
      } else if (parent.includes("footer")) {
        this.settings.footerElements.push(tmp);
      }
      this.locals.classType = "";
      return;
    },
    startDraggingElement(classType) {
      this.locals.classType = classType;
      let headerSection = this.$refs.headerTemplate;
      headerSection.className = headerSection.className + " dragged";
      let footerSection = this.$refs.footerTemplate;
      footerSection.className = footerSection.className + " dragged";
    },
    droppedElementOnHeader() {
      let parent = "header";
      this.createElement(parent);
    },
    droppedElementOnFooter() {
      let parent = "footer";
      this.createElement(parent);
    },
    finishedDraggingElement() {
      let headerSection = this.$refs.headerTemplate;
      headerSection.classList.remove("dragged");
      let footerSection = this.$refs.footerTemplate;
      footerSection.classList.remove("dragged");
    },
    onFileChange() {
      let image = document.getElementById("imageFileControl").files[0];
      this.toBase64(image).then((res) => {
        this.locals.selectedElement.options.configs.imageSrc = res;
      });
    },

    /**
     * Converts givven image to base64
     */

    toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },

    /**
     * Generate a n digit uinique id
     */

    idGenerator(n) {
      return Math.random().toString(36).substr(2, n);
    },

    /** Adds an event listenner on delete button and then removes the element */

    deletingElementOnPressingDeleteKey() {
      let headerElements = this.settings.headerElements;
      let footerElements = this.settings.footerElements;
      document.addEventListener("keydown", deleteElement, false);
      document.removeEventListener("keyup", deleteElement, false);

      let that = this; // Storing the value of this to be able to use it inside of the function

      function deleteElement(e) {
        let id = that.locals.selectedElement.options.id;
        if (e.code == "Delete") {
          for (let index = 0; index < headerElements.length; index++) {
            if (headerElements[index].options.id == id) {
              headerElements.splice(index, index + 1);
            }
          }
          for (let index = 0; index < footerElements.length; index++) {
            if (footerElements[index].options.id == id) {
              footerElements.splice(index, inedx + 1);
            }
          }
          that.locals.selectedElement = {
            type: {},
            options: {
              configs: {},
              styles: {},
            },
          };
        }
      }
    },
    getCoordinates(id) {
      let tmp = document.getElementById(id);
      let compStyle = getComputedStyle(tmp);
      let top = compStyle.getPropertyValue("top");
      let left = compStyle.getPropertyValue("left");
      let height = compStyle.getPropertyValue("height");
      let width = compStyle.getPropertyValue("width");
      return {
        top: top,
        left: left,
        height: height,
        width: width,
      };
    },

    /**
     * JS functions for the modal
     */

    modalFunc(modalId, closeBtnId) {
      var modal = document.getElementById(modalId);

      // Get the <span> element that closes the modal
      var span = document.getElementById(closeBtnId);

      // When the user clicks on <span> (x), close the modal
      span.onclick = function () {
        modal.style.display = "none";
      };
    },
    showModal() {
      document.getElementById("templateBuilderModal").style.display = "block";
    },
    finishedEditingElement(element) {
      let tmp = this.settings.headerElements.find(
        (x) => x.options.id == element.options.id
      );
      if (tmp) {
        Object.assign(
          tmp.options.styles,
          this.getCoordinates(element.options.id)
        );
        return;
      }
      tmp = this.settings.footerElements.find(
        (x) => x.options.id == element.options.id
      );
      Object.assign(
        tmp.options.styles,
        this.getCoordinates(element.options.id)
      );
      return;
    },
  },
};
</script>

<style>
@import "./css/templateBuilder.css";
@import "./css/modal.css";
</style>