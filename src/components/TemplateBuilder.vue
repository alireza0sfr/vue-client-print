<template>
  <div id="templateBuilderPage" :dir="settings.pageDirections">
    <!--Buttons-->
    <i
      v-if="locals.settingsModalShow == false"
      @click="settingsInitFunc()"
      class="fas fa-2x fa-cog"
    ></i>
    <i v-if="locals.settingsModalShow" @click="export2Json()" class="fas fa-2x fa-check-circle"></i>

    <!-- Section 1 (Template Builder) -->
    <div v-if="locals.settingsModalShow" class="template-builder container-fluid">
      <div class="row flex-nowrap">
        <div
          :style="{'height': settings.defaultHeightOfPaper + 'in',
        'overflow': 'hidden',
        'width': '300px',
        'padding':'0px',
        'overflow-y': 'scroll',
        'border-left': '1px ridge black'}"
          class="bg-white shadow"
        >
          <div class="text-decoration-none mb-3 toolbar header">
            <span class="fs-5">تنظیمات پرینت</span>
          </div>
          <div
            style="color: black;"
            class="d-flex flex-column text-align-start justify-content-start min-vh-100"
          >
            <ul class="nav nav-pills flex-column align-items-start" id="printConfigsMenu">
              <li style="width:100%" class="d-flex">
                <label style="width: 50%;" class="p-2" for="pageSizeControl">نوع صفحه</label>
                <select
                  style="height:25%; width:50%; margin-left: 8px"
                  class="flex-grow-2 form-control mb-3 me-3"
                  v-model="settings.pageSize"
                  @change="calculateSizes()"
                  id="pageSizeControl"
                >
                  <option>a3</option>
                  <option>a4</option>
                  <option>a5</option>
                </select>
              </li>
              <li style="width:100%" class="d-flex">
                <label style="width: 50%;" class="p-2" for="pageOrientiationsControl">حالت صفحه</label>
                <select
                  @change="calculateSizes()"
                  style="height:25%; width:50%; margin-left: 8px"
                  class="flex-grow-2 form-control mb-3 me-3"
                  v-model="settings.orientation"
                  id="pageOrientiationsControl"
                >
                  <option>portrait</option>
                  <option>landscape</option>
                </select>
              </li>
              <li style="width:100%" class="d-flex">
                <span style="width: 50%;" class="p-2">اسم فایل</span>
                <div style="width:50%;" class="input-group input-group-sm">
                  <input
                    type="text"
                    style="height: 80%;"
                    v-model="settings.fileName"
                    class="flex-grow-2 form-control mb-3 ms-2"
                    aria-label="Small"
                    aria-describedby="inputGroup-sizing-sm"
                  />
                </div>
              </li>
              <li style="width:100%" class="d-flex mt-2">
                <label
                  style="width: 40%;"
                  class="form-check-label p-2 me-3"
                  for="repeatableHeaderControl"
                >تکرار هدر</label>
                <div style="width:20%" class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="settings.isHeaderRepeatable"
                    id="repeatableHeaderControl"
                  />
                </div>
              </li>
              <li style="width:100%" class="d-flex mt-2">
                <label
                  style="width: 40%;"
                  class="form-check-label p-2 me-3"
                  for="repeatableFooterControl"
                >تکرار فوتر</label>
                <div style="width:20%" class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="settings.isFooterRepeatable"
                    id="repeatableFooterControl"
                  />
                </div>
              </li>
              <li style="width:100%" class="d-flex mt-2">
                <span style="width: 40%;" class="d-sm-inline p-2 me-3">جهت صفحه</span>
                <div style="width:22%" class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="pageDirections"
                    id="pageDirections"
                    value="rtl"
                    v-model="settings.pageDirections"
                  />
                  <label class="form-check-label" for="pageDirections">راست</label>
                </div>
                <div style="width:22%; margin-right:10px" class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="pageDirections"
                    id="pageDirections2"
                    value="ltr"
                    v-model="settings.pageDirections"
                  />
                  <label class="form-check-label" for="pageDirections2">چپ</label>
                </div>
              </li>
            </ul>
            <div class="text-decoration-none mb-3 toolbar header">
              <span class="fs-5">المنت ها</span>
            </div>
            <ul class="nav nav-pills d-flex flex-row" id="elementsMenu">
              <li style="width:50%; margin: 10px 0;">
                <span
                  draggable="true"
                  @dragstart="startDraggingElement('textelement')"
                  @dragend="finishedDraggingElement()"
                  class="d-sm-inline"
                >
                  <img src="./elements/images/text.png" />
                  <div class="element-title">متن</div>
                </span>
              </li>
              <li style="width:50%; margin: 10px 0;">
                <span
                  class="d-sm-inline"
                  draggable="true"
                  @dragstart="startDraggingElement('datetime')"
                  @dragend="finishedDraggingElement()"
                >
                  <img src="./elements/images/timetable.png" />
                  <div class="element-title">تاریخ و ساعت</div>
                </span>
              </li>
              <li style="width:50%; margin: 10px 0;">
                <span
                  class="d-sm-inline"
                  draggable="true"
                  @dragstart="startDraggingElement('pagecounter')"
                  @dragend="finishedDraggingElement()"
                >
                  <img src="./elements/images/pages.png" />
                  <div class="element-title">شماره صفحه</div>
                </span>
              </li>
              <li style="width:50%; margin: 10px 0;">
                <span
                  class="d-sm-inline"
                  draggable="true"
                  @dragstart="startDraggingElement('imageelement')"
                  @dragend="finishedDraggingElement()"
                >
                  <img src="./elements/images/image.png" />
                  <div class="element-title">عکس</div>
                </span>
              </li>
              <li style="width:50%; margin: 10px 0;">
                <span
                  draggable="true"
                  @dragstart="startDraggingElement('bindingobjects')"
                  @dragend="finishedDraggingElement()"
                  class="d-sm-inline"
                >
                  <img src="./elements/images/binding.png" />
                  <div class="element-title">اتصال داده</div>
                </span>
              </li>
            </ul>
            <div class="text-decoration-none mb-3 toolbar header">
              <span class="fs-5">تنظیمات المنت ها</span>
            </div>
            <ul
              class="nav nav-pills flex-column align-items-start align-items-sm-start"
              id="elementConfigsMenu"
            >
              <li
                v-if="locals.selectedElement.type == 'textelement'"
                style="width:100%"
                class="d-flex"
              >
                <span style="width: 50%;" class="p-2">متن</span>
                <div style="width:50%;" class="input-group input-group-sm">
                  <input
                    type="text"
                    style="height: 80%; margin-left: 2px"
                    v-model="locals.selectedElement.options.configs.text"
                    class="flex-grow-2 form-control mb-3 ms-2"
                    aria-label="Small"
                    aria-describedby="inputGroup-sizing-sm"
                  />
                </div>
              </li>
              <li
                style="width:100%"
                class="d-flex"
                v-if="locals.selectedElement.type == 'datetime'"
              >
                <label style="width: 40%;" class="form-check-label p-2 me-2" for="hasDateControl">تاریخ</label>
                <div style="width:20%" class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="locals.selectedElement.options.configs.hasDate"
                    id="hasDateControl"
                  />
                </div>
              </li>
              <li
                style="width:100%"
                class="d-flex mt-2"
                v-if="locals.selectedElement.type == 'datetime'"
              >
                <label style="width: 40%;" class="form-check-label p-2 me-2" for="hasTimeControl">ساعت</label>
                <div style="width:20%" class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="locals.selectedElement.options.configs.hasTime"
                    id="hasTimeControl"
                  />
                </div>
              </li>
              <li
                style="width:100%"
                class="d-flex mt-2"
                v-if="locals.selectedElement.type == 'datetime'"
              >
                <label
                  style="width: 40%;"
                  class="form-check-label p-2 me-2"
                  for="persiaDateControl"
                >تاریخ شمسی</label>
                <div style="width:20%" class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="locals.selectedElement.options.configs.persianDate"
                    id="persiaDateControl"
                  />
                </div>
              </li>
              <li
                style="width:100%"
                class="d-flex mb-2"
                v-if="locals.selectedElement.type == 'pagecounter'"
              >
                <label
                  style="width: 40%;"
                  class="form-check-label p-2 me-3"
                  for="persianNumbersControl"
                >اعداد فارسی</label>
                <div style="width:20%" class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="locals.selectedElement.options.configs.persianNumbers"
                    id="persianNumbersControl"
                  />
                </div>
              </li>
              <li
                style="width:100%"
                class="d-flex"
                v-if="locals.selectedElement.type == 'imageelement'"
              >
                <label style="width: 50%;" class="p-2" for="imageFileControl">فایل تصویر</label>
                <div style="width:50%;" class="input-group input-group-sm">
                  <input
                    type="file"
                    @change="onFileChange()"
                    style="margin-left: 2px"
                    class="flex-grow-2 form-control mb-3 ms-2"
                    aria-label="Small"
                    aria-describedby="inputGroup-sizing-sm"
                    id="imageFileControl"
                  />
                </div>
              </li>
              <li
                style="width:100%"
                class="d-flex"
                v-if="locals.selectedElement.type == 'imageelement'"
              >
                <span style="width: 50%;" class="p-2">طول</span>
                <div style="width:50%;" class="input-group input-group-sm">
                  <input
                    type="text"
                    class="flex-grow-2 form-control mb-3"
                    style="height: 80%; margin-left: 8px"
                    v-model="locals.selectedElement.options.styles.height"
                    aria-label="Small"
                    aria-describedby="inputGroup-sizing-sm"
                  />
                </div>
              </li>
              <li
                style="width:100%"
                class="d-flex"
                v-if="locals.selectedElement.type == 'imageelement'"
              >
                <span style="width: 50%;" class="p-2">عرض</span>
                <div style="width:50%;" class="input-group input-group-sm">
                  <input
                    type="text"
                    class="flex-grow-2 form-control mb-3"
                    style="height: 80%; margin-left: 8px"
                    v-model="locals.selectedElement.options.styles.width"
                    aria-label="Small"
                    aria-describedby="inputGroup-sizing-sm"
                  />
                </div>
              </li>
              <li
                style="width:100%"
                class="d-flex"
                v-if="locals.selectedElement.type == 'bindingobjects'"
              >
                <label style="width: 50%;" class="p-2" for="bindingObjectsControl">نوع داده</label>
                <select
                  style="height:25%; width:50%; margin-left: 8px"
                  class="flex-grow-2 form-control mb-3"
                  v-model="locals.selectedElement.options.configs.field"
                  id="bindingObjectsControl"
                >
                  <option
                    v-for="option in Object.keys(locals.selectedElement.options.configs.bindingObjects)"
                    :key="option"
                  >{{option}}</option>
                </select>
              </li>
            </ul>
            <div class="text-decoration-none mb-3 toolbar header">
              <span class="fs-5">استایل المنت ها</span>
            </div>
            <ul
              class="nav nav-pills flex-column align-items-center align-items-sm-start"
              id="elementStylesMenu"
            >
              <li style="width:100%" class="d-flex">
                <label style="width: 50%;" class="p-2" for="elementTextAlignControl">مکان نوشته</label>
                <select
                  v-model="locals.selectedElement.options.styles.textAlign"
                  style="height:25%; width:50%; margin-left: 8px"
                  class="flex-grow-2 form-control mb-3"
                  id="elementTextAlignControl"
                >
                  <option value="right">راست</option>
                  <option value="center">وسط</option>
                  <option value="left">چپ</option>
                </select>
              </li>
              <li style="width:100%" class="d-flex">
                <span style="width: 50%;" class="p-2">رنگ نوشته</span>
                <div style="width:50%" class="input-group input-group-sm">
                  <input
                    type="color"
                    class="flex-grow-2 form-control mb-3"
                    style="height: 80%; margin-left: 8px"
                    v-model="locals.selectedElement.options.styles.color"
                    aria-label="Small"
                    aria-describedby="inputGroup-sizing-sm"
                  />
                </div>
              </li>
              <li style="width:100%" class="d-flex mt-2">
                <span style="width: 50%;" class="p-2">اندازه فونت</span>
                <div style="width:50%;" class="input-group input-group-sm">
                  <input
                    type="text"
                    class="flex-grow-2 form-control mb-3"
                    style="height: 80%; margin-left: 8px"
                    v-model="locals.selectedElement.options.styles.fontSize"
                    aria-label="Small"
                    aria-describedby="inputGroup-sizing-sm"
                  />
                </div>
              </li>
              <li style="width:100%" class="d-flex mt-2">
                <span style="width: 40%;" class="p-2 me-2">حاشیه</span>
                <div style="width:10%"></div>
                <div style="width:50%;" class="input-group input-group-sm">
                  <input
                    type="text"
                    class="flex-grow-2 form-control mb-3"
                    style="height: 80%; margin-left: 8px"
                    v-model="locals.selectedElement.options.styles.border"
                    aria-label="Small"
                    aria-describedby="inputGroup-sizing-sm"
                  />
                </div>
              </li>
              <li style="width:100%" class="d-flex mt-2">
                <span style="width: 40%;" class="d-sm-inline p-2 me-2">جهت نوشته</span>
                <div style="width:22%" class="form-check">
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
                <div style="width:22%; margin-right:10px" class="form-check">
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
              </li>
            </ul>
            <hr />
          </div>
        </div>

        <!-- Section 2 (Template)-->

        <div
          v-if="locals.settingsModalShow"
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
        settingsModalShow: false,
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

      // Closing the editWhileInPreview modal
      this.locals.settingsModalShow = !this.locals.settingsModalShow;

      return tmp;
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
      this.locals.settingsModalShow = !this.locals.settingsModalShow;
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
  },
};
</script>

<style>
</style>