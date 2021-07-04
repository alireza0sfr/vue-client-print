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
            <h1>صفحه ساز</h1>
          </div>
          <div>
            <img
              @click="export2Json()"
              src="./elements/images/floppy-disk.png"
              alt="ذخیره"
              class="icon"
            />
          </div>
        </div>

        <!-- Section 1 (Template Builder) -->
        <div class="template-builder-container">
          <div
            :style="{'height': settings.defaultHeightOfPaper + 'in',
        }"
            class="toolbar-container"
          >
            <div class="toolbar-header">
              <span>تنظیمات پرینت</span>
            </div>
            <div class="toolbar-content">
              <div class="toolbar-content-wrapper" id="printConfigsMenu">
                <div style="width:100%" class="toolbar-content-row">
                  <div style="width: 50%; padding:5px;">
                    <label for="pageSizeControl">نوع صفحه</label>
                  </div>
                  <div style="width:50%">
                    <select
                      class="toolbar-content-select input-form-control"
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
                <div style="width:100%" class="toolbar-content-row">
                  <div style="width: 50%; padding: 5px;">
                    <label for="pageOrientiationsControl">حالت صفحه</label>
                  </div>
                  <div style="width:50%">
                    <select
                      class="toolbar-content-select input-form-control"
                      @change="calculateSizes()"
                      v-model="settings.orientation"
                      id="pageOrientiationsControl"
                    >
                      <option value="portrait">عمودی</option>
                      <option value="landscape">افقی</option>
                    </select>
                  </div>
                </div>
                <div style="width:100%" class="toolbar-content-row">
                  <div style="width: 50%; padding: 5px;">
                    <span style="width: 50%;">اسم فایل</span>
                  </div>
                  <div style="width:50%; height:70%;">
                    <input
                      type="text"
                      v-model="settings.fileName"
                      style="width:70%"
                      class="toolbar-content-select input-form-control"
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                </div>
                <div style="width:100%" class="toolbar-content-row">
                  <div style="width: 50%; padding: 5px;">
                    <label style="width: 40%;" for="repeatableHeaderControl">تکرار هدر</label>
                  </div>
                  <div style="width:50%">
                    <input
                      style="width: 15px; height: 15px; border-radius: .25em;"
                      class="toolbar-content-select input-form-control"
                      type="checkbox"
                      v-model="settings.isHeaderRepeatable"
                      id="repeatableHeaderControl"
                    />
                  </div>
                </div>
                <div style="width:100%" class="toolbar-content-row">
                  <div style="width: 50%; padding: 5px;">
                    <label style="width: 40%;" for="repeatableFooterControl">تکرار فوتر</label>
                  </div>
                  <div style="width:50%">
                    <input
                      style="width: 15px; height: 15px; border-radius: .25em;"
                      class="toolbar-content-select input-form-control"
                      type="checkbox"
                      v-model="settings.isFooterRepeatable"
                      id="repeatableFooterControl"
                    />
                  </div>
                </div>
                <div style="width:100%; margin-bottom: 15px" class="toolbar-content-row">
                  <div style="width: 50%; padding: 5px;">
                    <span>جهت صفحه</span>
                  </div>
                  <div style="width:25%">
                    <input
                      type="radio"
                      name="pageDirections"
                      id="pageDirections"
                      value="rtl"
                      v-model="settings.pageDirections"
                    />
                    <label for="pageDirections">راست</label>
                  </div>
                  <div style="width:25%;">
                    <input
                      type="radio"
                      name="pageDirections"
                      id="pageDirections2"
                      value="ltr"
                      v-model="settings.pageDirections"
                    />
                    <label for="pageDirections2">چپ</label>
                  </div>
                </div>
              </div>
              <div class="toolbar-header">
                <span>المنت ها</span>
              </div>
              <div class="toolbar-content-wrapper" style="flex-direction: row;" id="elementsMenu">
                <div style="width:50%" class="toolbar-content-row">
                  <div style="width: 100%; padding:5px;">
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
                <div style="width:50%" class="toolbar-content-row">
                  <div style="width: 100%; padding:5px;">
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
                <div style="width:50%" class="toolbar-content-row">
                  <div style="width: 100%; padding:5px;">
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
                <div style="width:50%" class="toolbar-content-row">
                  <div style="width: 100%; padding:5px;">
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
                <div style="width:50%" class="toolbar-content-row">
                  <div style="width: 100%; padding:5px;">
                    <span
                      draggable="true"
                      @dragstart="startDraggingElement('bindingobjects')"
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
                <span class="fs-5">تنظیمات المنت ها</span>
              </div>
              <div class="toolbar-content-wrapper">
                <div
                  v-if="locals.selectedElement.type == 'textelement'"
                  style="width:100%"
                  class="toolbar-content-row"
                >
                  <span style="width: 50%; padding: 8px">متن</span>
                  <div style="width:50%;">
                    <input
                      type="text"
                      style="height: 60%; margin-left: 2px;"
                      v-model="locals.selectedElement.options.configs.text"
                      class="toolbar-content-select input-form-control"
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                </div>
                <div
                  style="width:100%"
                  class="toolbar-content-row"
                  v-if="locals.selectedElement.type == 'datetime'"
                >
                  <div style="width: 50%; padding: 5px;">
                    <label style="width: 40%;" for="hasDateControl">تاریخ</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      v-model="locals.selectedElement.options.configs.hasDate"
                      id="hasDateControl"
                    />
                  </div>
                </div>
                <div
                  style="width:100%"
                  class="toolbar-content-row"
                  v-if="locals.selectedElement.type == 'datetime'"
                >
                  <div style="width: 50%; padding: 5px;">
                    <label style="width: 40%;" for="hasTimeControl">ساعت</label>
                  </div>
                  <div>
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="locals.selectedElement.options.configs.hasTime"
                      id="hasTimeControl"
                    />
                  </div>
                </div>
                <div
                  style="width:100%"
                  class="toolbar-content-row"
                  v-if="locals.selectedElement.type == 'datetime'"
                >
                  <div style="width: 50%; padding: 5px;">
                    <label style="width: 40%;" for="persiaDateControl">تاریخ شمسی</label>
                  </div>
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="locals.selectedElement.options.configs.persianDate"
                    id="persiaDateControl"
                  />
                </div>
                <div
                  style="width:100%"
                  class="toolbar-content-row"
                  v-if="locals.selectedElement.type == 'pagecounter'"
                >
                  <div style="width: 50%; padding: 5px;">
                    <label style="width: 40%;" for="persianNumbersControl">اعداد فارسی</label>
                  </div>
                  <input
                    type="checkbox"
                    v-model="locals.selectedElement.options.configs.persianNumbers"
                    id="persianNumbersControl"
                  />
                </div>
                <div
                  style="width:100%"
                  class="toolbar-content-row"
                  v-if="locals.selectedElement.type == 'imageelement'"
                >
                  <div style="width: 30%; padding: 5px;">
                    <label for="imageFileControl">فایل تصویر</label>
                  </div>
                  <div style="width: 70%;">
                    <input
                      style="width:100%;"
                      type="file"
                      @change="onFileChange()"
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                      id="imageFileControl"
                    />
                  </div>
                </div>
                <div
                  style="width:100%"
                  class="toolbar-content-row"
                  v-if="locals.selectedElement.type == 'imageelement'"
                >
                  <div style="width: 50%; padding: 5px;">
                    <span>طول</span>
                  </div>
                  <div style="width:50%;">
                    <input
                      type="text"
                      class="toolbar-content-select input-form-control"
                      style="height: 60%; margin-left: 8px; width:70%"
                      v-model="locals.selectedElement.options.styles.height"
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                </div>
                <div
                  style="width:100%"
                  class="toolbar-content-row"
                  v-if="locals.selectedElement.type == 'imageelement'"
                >
                  <div style="width: 50%; padding: 5px;">
                    <span style="width: 50%;" class="p-2">عرض</span>
                  </div>
                  <div style="width:50%;" class="input-group input-group-sm">
                    <input
                      type="text"
                      class="toolbar-content-select input-form-control"
                      style="height: 60%; margin-left: 8px; width:70%"
                      v-model="locals.selectedElement.options.styles.width"
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                </div>
                <div
                  style="width:100%"
                  class="toolbar-content-row"
                  v-if="locals.selectedElement.type == 'bindingobjects'"
                >
                  <div style="width: 50%; padding: 5px;">
                    <label style="width: 50%;" class="p-2" for="bindingObjectsControl">نوع داده</label>
                  </div>
                  <div style="width:50%">
                    <select
                      style="height: 60%; margin-left: 8px; width:70%"
                      class="toolbar-content-select input-form-control"
                      v-model="locals.selectedElement.options.configs.field"
                      id="bindingObjectsControl"
                    >
                      <option
                        v-for="option in Object.keys(locals.selectedElement.options.configs.bindingObjects)"
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
                <div style="width:100%" class="toolbar-content-row">
                  <div style="width: 50%; padding:5px;">
                    <label for="elementTextAlignControl">مکان نوشته</label>
                  </div>
                  <div style="width:50%">
                    <select
                      v-model="locals.selectedElement.options.styles.textAlign"
                      class="toolbar-content-select input-form-control"
                      id="elementTextAlignControl"
                    >
                      <option value="right">راست</option>
                      <option value="center">وسط</option>
                      <option value="left">چپ</option>
                    </select>
                  </div>
                </div>
                <div style="width:100%" class="toolbar-content-row">
                  <div style="width: 50%; padding:5px;">
                    <span style="width: 50%;" class="p-2">رنگ نوشته</span>
                  </div>
                  <div style="width:40%">
                    <input
                      type="color"
                      class="toolbar-content-select input-form-control"
                      v-model="locals.selectedElement.options.styles.color"
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                </div>
                <div style="width:100%; margin-top: 25px;" class="toolbar-content-row">
                  <div style="width: 50%; padding:5px;">
                    <span>اندازه فونت</span>
                  </div>
                  <div style="width:50%">
                    <input
                      type="text"
                      class="toolbar-content-select input-form-control"
                      style="height: 60%; width: 70%; margin-left: 8px"
                      v-model="locals.selectedElement.options.styles.fontSize"
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                </div>
                <div style="width:100%" class="toolbar-content-row">
                  <div style="width: 50%; padding:5px;">
                    <span>حاشیه</span>
                  </div>
                  <div style="width:50%;">
                    <input
                      class="toolbar-content-select input-form-control"
                      type="text"
                      style="height: 60%; width: 70%;"
                      v-model="locals.selectedElement.options.styles.border"
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                </div>
                <div style="width:100%" class="toolbar-content-row">
                  <div style="width: 50%; padding:5px;">
                    <span style="width: 40%;" class="d-sm-inline p-2 me-2">جهت نوشته</span>
                  </div>
                  <div>
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

          <div
            :style="{'height': settings.defaultHeightOfPaper + 'in', 'width': settings.defaultWidthOfPaper + 'in',
            'background-color': '#F1F5F8'}"
            class="template"
            @click="deSelectAll"
          >
            <div
              :style="{'height': settings.pageHeaderSize + 'in',
              'min-height': '0.6in'}"
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
                @click="element2ToolbarBind(element)"
                @clickedOnElement="clickedOnElement()"
              />
            </div>
            <div id="bodyTemplate">
              <div>Body</div>
            </div>
            <div
              :style="{'height': settings.pageFooterSize + 'in',
              'min-height': '0.6in'}"
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
                @click="element2ToolbarBind(element)"
                @clickedOnElement="clickedOnElement()"
              />
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
import BindingObjects from "./elements/BindingObjects.vue";
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
    bindingobjects: BindingObjects,
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
        pageHeaderSize: 0,
        pageFooterSize: 0,
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
        let elementStyles = footerElements[index].options.styles;
        Object.assign(elementStyles, computedStyles);
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
        settings: {
          orientation: this.settings.orientation,
          pageSize: this.settings.pageSize,
          pageDirections: this.settings.pageDirections,
        },
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
      console.log("=======Calculating Sizes=======");
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

      console.log("defaultWidthOfPaper: ", this.settings.defaultWidthOfPaper);
      console.log("defaultHeightOfPaper: ", this.settings.defaultHeightOfPaper);
      console.log("totalHeightOfAPaper: ", this.settings.totalHeightOfAPaper);
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

    clickedOnElement() {
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
            configs: { text: "Enter Your Text" },
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
      } else if (classType == "bindingobjects") {
        tmp = {
          type: classType,
          options: {
            id: this.idGenerator(5),
            configs: {
              field: "داده اتصالی",
              bindingObjects: {
                code: 124164,
                date: "2021/30/6",
              },
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
    element2ToolbarBind(element) {
      this.locals.selectedElement = element;
      this.deletingElementOnPressingDeleteKey();
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
      let id = this.locals.selectedElement.options.id;
      let headerElements = this.settings.headerElements;
      let footerElements = this.settings.footerElements;
      document.addEventListener("keydown", deleteElement, false);
      document.removeEventListener("keyup", deleteElement, false);

      function deleteElement(e) {
        if (e.code == "Delete") {
          for (let index = 0; index < headerElements.length; index++) {
            if (headerElements[index].options.id == id) {
              headerElements.pop(headerElements[index]);
            }
          }
          for (let index = 0; index < footerElements.length; index++) {
            if (footerElements[index].options.id == id) {
              footerElements.pop(footerElements[index]);
            }
          }
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

      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function (event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      };
    },
    showModal() {
      document.getElementById("templateBuilderModal").style.display = "block";
    },
  },
};
</script>

<style>
@import "./css/templateBuilder.css";
@import "./css/modal.css";
</style>