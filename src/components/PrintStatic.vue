<template>
<div id="page" :dir="settings.pageDirections">
  <!--Buttons-->

  <i @click="convert2Image()" id="myBtn-final" type="button" class="fas fa-2x fa-eye"></i>
  <i v-if="locals.settingsModalShow == false" @click="settingsInitFunc()" class="fas fa-2x fa-cog"></i>
  <i v-if="locals.settingsModalShow" @click="calculateSizes()" class="fas fa-2x fa-check-circle"></i>
  <!-- Main Wrapper and Sections-->

  <div class="wrapper">
    <!-- Section 1 (Template Builder) -->
    <div
      v-if="locals.settingsModalShow"
      :style="{'height': locals.defaultHeightOfPaper + 'in'}"
      class="template-builder container-fluid"
    >
      <div class="row flex-nowrap">
        <div
          :style="{'height': locals.defaultHeightOfPaper + 'in',
        'overflow': 'hidden',
        'width': '27%',
        'padding':'0px',
        'overflow-y': 'scroll',
        'border-left': '1px ridge black'}"
          class="col-auto col-md-3 col-xl-2 bg-white shadow"
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
                <label style="width: 40%;" class="p-2" for="pageSizeControl">نوع صفحه</label>
                <div style="width:10%"></div>
                <select
                  style="height:25%; width:50%; margin-left: 8px"
                  class="flex-grow-2 form-control mb-3"
                  v-model="settings.pageSize"
                  id="pageSizeControl"
                >
                  <option>a3</option>
                  <option>a4</option>
                  <option>a5</option>
                </select>
              </li>
              <li style="width:100%" class="d-flex">
                <label style="width: 40%;" class="p-2" for="pageOrientiationsControl">حالت صفحه</label>
                <div style="width:10%"></div>
                <select
                  style="height:25%; width:50%; margin-left: 8px"
                  class="flex-grow-2 form-control mb-3"
                  v-model="settings.orientation"
                  id="pageOrientiationsControl"
                >
                  <option>portrait</option>
                  <option>landscape</option>
                </select>
              </li>
              <li style="width:100%" class="d-flex">
                <span style="width: 38%;" class="p-2">اسم فایل</span>
                <div style="width:10%"></div>
                <div style="width:50%;" class="input-group input-group-sm">
                  <input
                    type="text"
                    style="height: 80%; margin-left: 2px"
                    v-model="settings.fileName"
                    class="flex-grow-2 form-control mb-3"
                    aria-label="Small"
                    aria-describedby="inputGroup-sizing-sm"
                  />
                </div>
              </li>
              <li style="width:100%" class="d-flex">
                <label
                  style="width: 40%;"
                  class="form-check-label p-2"
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
              <li style="width:100%" class="d-flex">
                <label
                  style="width: 40%;"
                  class="form-check-label p-2"
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
              <li style="width:100%" class="d-flex">
                <span style="width: 40%;" class="d-none d-sm-inline p-2">جهت صفحه</span>
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
                  class="d-none d-sm-inline"
                >
                  <img src="./elements/images/text.png" />
                  <div class="element-title">متن</div>
                </span>
              </li>
              <li style="width:50%; margin: 10px 0;">
                <span
                  class="d-none d-sm-inline"
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
                  class="d-none d-sm-inline"
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
                  class="d-none d-sm-inline"
                  draggable="true"
                  @dragstart="startDraggingElement('imageelement')"
                  @dragend="finishedDraggingElement()"
                >
                  <img src="./elements/images/image.png" />
                  <div class="element-title">عکس</div>
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
                <span style="width: 38%;" class="p-2">متن</span>
                <div style="width:10%"></div>
                <div style="width:50%;" class="input-group input-group-sm">
                  <input
                    type="text"
                    style="height: 80%; margin-left: 2px"
                    v-model="locals.selectedElement.options.configs.text"
                    class="flex-grow-2 form-control mb-3"
                    aria-label="Small"
                    aria-describedby="inputGroup-sizing-sm"
                  />
                </div>
              </li>
              {{locals.selectedElement}}
              <li
                style="width:100%"
                class="d-flex"
                v-if="locals.selectedElement.type == 'datetime'"
              >
                <label style="width: 40%;" class="form-check-label p-2" for="hasDateControl">تاریخ</label>
                <div style="width:20%" class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="locals.selectedElement.options.hasDate"
                    id="hasDateControl"
                  />
                </div>
              </li>
              <li
                style="width:100%"
                class="d-flex"
                v-if="locals.selectedElement.type == 'datetime'"
              >
                <label style="width: 40%;" class="form-check-label p-2" for="hasTimeControl">ساعت</label>
                <div style="width:20%" class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="locals.selectedElement.options.hasTime"
                    id="hasTimeControl"
                  />
                </div>
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
                <label style="width: 43%;" class="p-2" for="elementTextAlignControl">مکان نوشته</label>
                <div style="width:10%"></div>
                <select
                  v-model="locals.selectedElement.options.styles.textAlign"
                  style="height:25%; width:50%; margin-left: 8px"
                  class="flex-grow-2 form-control mb-3"
                  id="elementTextAlignControl"
                >
                  <option>right</option>
                  <option>center</option>
                  <option>left</option>
                </select>
              </li>
              <li style="width:100%" class="d-flex">
                <span style="width: 40%;" class="p-2">رنگ نوشته</span>
                <div style="width:10%"></div>
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
              <li style="width:100%" class="d-flex">
                <span style="width: 40%;" class="p-2">اندازه فونت</span>
                <div style="width:10%"></div>
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
              <li style="width:100%" class="d-flex">
                <span style="width: 40%;" class="p-2">حاشیه متن</span>
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
              <li style="width:100%" class="d-flex">
                <span style="width: 40%;" class="d-none d-sm-inline p-2">مکان نوشته</span>
                <div style="width:22%" class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="elementDirections"
                    id="elementDirections"
                    value="rtl"
                    v-model="locals.selectedElement.options.styles.direction"
                  />
                  <label class="form-check-label" for="elementDirections">راست</label>
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
                  <label class="form-check-label" for="elementDirections2">چپ</label>
                </div>
              </li>
            </ul>
            <hr />
          </div>
        </div>

        <!-- Section 2 (Template)-->

        <div>
          <div
            v-if="locals.settingsModalShow"
            :style="{'height': locals.defaultHeightOfPaper + 'in', 'width': locals.defaultWidthOfPaper + 'in',
            'background-color': '#F1F5F8'}"
            class="template"
            @click="deSelectAll"
          >
            <div
              :style="{'height': locals.pageHeaderSize + 'in',
              'min-height': '0.6in'}"
              id="headerTemplate"
              class="section header"
              ref="headerTemplate"
              @drop="droppedEleemntOnHeader()"
              @dragenter.prevent
              @dragover.prevent
            >
              <component
                v-for="element in elements.headerElements"
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
              :style="{'height': locals.pageFooterSize + 'in',
              'min-height': '0.6in'}"
              id="footerTemplate"
              class="section footer"
              ref="footerTemplate"
              @drop="droppedEleemntOnFooter()"
              @dragenter.prevent
              @dragover.prevent
            >
              <component
                v-for="element in elements.footerElements"
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

    <!-- Section 3 (DATA)-->

    <div class="section3">
      <div :style="{'width': locals.defaultWidthOfPaper + 'in'}" id="toBeConverted">
        <table style="width: 100%">
          <thead>
            <tr>
              <th>ستون ۱</th>
              <th>ستون ۲</th>
              <th>ستون ۳</th>
              <th>ستون ۴</th>
              <th>ستون ۵</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="index in 100" :key="index">
              <td>{{index}}</td>
              <td>ردیف تست</td>
              <td>ردیف تست</td>
              <td>ردیف تست</td>
              <td>ردیف تست</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Preview Modal-->

    <div id="myModal-final" class="modal card">
      <div class="modal-content">
        <div class="card-header">
          <span class="close-final">&times;</span>
          <i @click="printForm()" class="fas fa-2x fa-file-pdf"></i>
          <i @click="editWhileInPreview()" class="fas fa-2x fa-edit"></i>
        </div>
        <div id="printForm">
          <div
            :style="{'border': '1px solid black', 'border-bottom': '1px solid black', 'height': locals.defaultHeightOfPaper + 'in'}"
            class="mainLoop"
            v-for="index in locals.totalPages"
            :key="index"
          >
            <div class="pages">
              <div
                class="fixedHeaderCondition"
                v-if="settings.hasHeader && settings.isHeaderRepeatable || index == 1"
              >
                <header style="height: 60px" class="mainHeader">
                  <div class="header card-body">
                    <div class="dateAndTimeToday" v-if="settings.isFixedDateAndTime == true">
                      {{dateToday}}
                      <br />
                      {{timeToday}}
                    </div>
                    <div class="customHeader">Custom Header {{settings.customHeader}}</div>
                    <div class="logo">
                      <img
                        v-if="settings.logoURL != ''"
                        :src="settings.logoURL"
                        alt="Logo"
                        height="40"
                        width="40"
                      />
                    </div>
                  </div>
                </header>
              </div>
              <body class="converted" :style="{'height': locals.totalHeightOfAPaper + 'in'}"></body>
              <div
                class="fixedFooterCondition"
                v-if="settings.hasFooter && settings.isFooterRepeatable || index == 1"
              >
                <footer class="mainFooter break html2pdf__page-break">
                  {{settings.customFooter}}
                  <br />
                  <div
                    v-if="settings.hasPageCounter == true"
                    :style="{ 'text-align': settings.pageCounterPosition }"
                  >{{ index }}</div>
                </footer>
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
import TextElement from "./elements/TextElement.vue";
import DateTime from "./elements/DateTime.vue";
import domtoimage from "dom-to-image";
import html2pdf from "html2pdf.js";
import elementUtilities from "./elements/js/element-utilities";
export default {
  name: "PrintStatic",
  props: {
    options: Object,
  },
  components: {
    textelement: TextElement,
    datetime: DateTime,
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
        totalPages: 1, // Needs to be one for the v-for to make the basic template before preview is triggered
        defaultHeightOfPaper: 11.7, // Standard Height of the chosen paper in inch
        defaultWidthOfPaper: 8.26, // Standard Width of the chosen paper in inch
        totalPagesHeight: 0, // The total size of the given div to be printed in inch
        totalHeightOfAPaper: 10.4, // Useable height for body tag
        settingsModalShow: false,
        pageHeaderSize: 0.6,
        pageFooterSize: 0.6,
        isClicked: false,
        parent: "",
        classType: "",
        selectedElement: {
          type: {},
          options: {
            configs: {},
            styles: {},
          },
        },
      },
      settings: {
        hasPageCounter: true,
        fileName: "nikan",
        pageCounterPosition: "center",
        hasHeader: true,
        hasFooter: true,
        isFixedDateAndTime: true,
        isFooterRepeatable: true,
        isHeaderRepeatable: true,
        orientation: "portrait",
        pageSize: "a4",
        customHeader: "",
        customFooter: "",
        logoURL: "",
        pageDirections: "rtl",
        margin: 0,
      },
      elements: {
        headerElements: [
          {
            type: "textelement",
            options: {
              configs: {
                text: "Header Default Text 1",
              },
              styles: {},
            },
          },
          {
            type: "textelement",
            options: {
              configs: {
                text: "Header Default Text 2",
              },
              styles: {},
            },
          },
          {
            type: "datetime",
            options: {
              styles: {},
            },
          },
        ],
        footerElements: [
          {
            type: "textelement",
            options: {
              configs: {
                text: "Footer Default Text 1",
              },
              styles: {},
            },
          },
          {
            type: "textelement",
            options: {
              configs: {
                text: "Footer Default Text 1",
              },
              styles: {},
            },
          },
          {
            type: "datetime",
            options: {
              styles: {},
            },
          },
        ],
      },
    };
  },
  watch: {
    options: {
      immediate: true,
      handler(val) {
        Object.assign(this.settings, val);
      },
    },
  },
  mounted() {
    console.log("=======Nikan is Live=======");
    this.modalFinalFunc();
  },
  methods: {
    printForm() {
      console.log("=======Printing.....=======");
      let pages = document.getElementsByClassName("pages");
      let opt = {
        margin: this.settings.margin,
        filename: this.settings.fileName + ".pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: { dpi: 300, width: 1430 },
        jsPDF: {
          unit: "px",
          format: this.settings.pageSize,
          orientation: this.settings.orientation,
        },
      };
      var worker = html2pdf().set(opt).from(pages[0]).toPdf();
      let n = 0;
      pages.forEach(function (page) {
        console.log();
        worker = worker
          .get("pdf")
          .then(function (pdf) {
            if (n != 0) {
              pdf.addPage();
            }
            n += 1;
          })
          .from(page)
          .toContainer()
          .toCanvas()
          .toPdf();
      });
      worker = worker.save();

      console.log("=======Done=======");
    },

    /**
     * Removes all the previous children from the parent
     */

    removeAllChildNodes(parent) {
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
    },

    /**
     * converts given pixel to inch
     */

    convert2Inches(pixels) {
      return (pixels / 96).toFixed(2);
    },

    /**
     * Exports all the data to a single json
     */

    export2Json() {
      let tmp = {
        header: {
          customHeader: this.settings.customHeader,
          isFixedDateAndTime: this.settings.isFixedDateAndTime,
          isHeaderRepeatable: this.settings.isHeaderRepeatable,
          logoURL: this.settings.logoURL,
          height: this.locals.pageHeaderSize,
          styles: {
            margin: "0px",
          },
        },
        footer: {
          customFooter: this.settings.customFooter,
          hasPageCounter: this.settings.hasPageCounter,
          pageCounterPosition: this.settings.pageCounterPosition,
          isFooterRepeatable: this.settings.isFooterRepeatable,
          height: this.locals.pageFooterSize,
          styles: {
            margin: "0px",
          },
        },
        settings: {
          orientation: this.settings.orientation,
          pageSize: this.settings.pageSize,
          pageDirections: this.settings.pageDirections,
        },
      };
      console.log("json:", tmp);
      return tmp;
    },

    /**
     * Exports all the data to a single json
     */

    importFromJson(json) {
      Object.assign(this.settings, json);
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

      // Calculating the footer size in inches
      let footerPage = document.getElementsByClassName("section")[1];
      let pageFooterSize = this.convert2Inches(footerPage.offsetHeight);
      this.locals.pageFooterSize = pageFooterSize;
      console.log("pageFooterSize: ", pageFooterSize);

      // Calculating the header size in inches
      let headerPage = document.getElementsByClassName("section")[0];
      let pageHeaderSize = this.convert2Inches(headerPage.offsetHeight);
      this.locals.pageHeaderSize = pageHeaderSize;
      console.log("pageHeadersize: ", pageHeaderSize);

      // Gettings the default sizes from the base dic
      this.locals.defaultHeightOfPaper =
        this.locals.pageSizeDictionary[this.settings.orientation][
          this.settings.pageSize
        ]["height"];
      this.locals.totalHeightOfAPaper =
        this.locals.defaultHeightOfPaper -
        pageFooterSize -
        pageHeaderSize -
        errorValue;

      this.locals.defaultWidthOfPaper =
        this.locals.pageSizeDictionary[this.settings.orientation][
          this.settings.pageSize
        ]["width"];

      console.log("defaultWidthOfPaper: ", this.locals.defaultWidthOfPaper);
      console.log("defaultHeightOfPaper: ", this.locals.defaultHeightOfPaper);
      console.log("totalHeightOfAPaper: ", this.locals.totalHeightOfAPaper);

      // Closing the editWhileInPreview modal
      this.locals.settingsModalShow = !this.locals.settingsModalShow;

      // Making a json out of whole avaiable data
      this.export2Json();
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
     * Converts given base64 to canvas
     */

    canvasMaker(imgBase64, sy) {
      let img = new Image();
      let canvas = document.createElement("canvas");
      canvas.height = this.convert2Pixels(this.locals.totalHeightOfAPaper);
      canvas.width = this.convert2Pixels(this.locals.defaultWidthOfPaper);
      let context = canvas.getContext("2d");
      img.src = imgBase64;
      img.onload = () => {
        context.drawImage(
          img,
          0,
          sy,
          this.convert2Pixels(this.locals.defaultWidthOfPaper),
          this.convert2Pixels(this.locals.totalHeightOfAPaper),
          0,
          0,
          this.convert2Pixels(this.locals.defaultWidthOfPaper),
          this.convert2Pixels(this.locals.totalHeightOfAPaper)
        );
      };
      return canvas;
    },

    /**
     * Converts the given html to Image and append it to the body tag
     */

    convert2Image() {
      // Calculating the default sizes then previewing
      // this.calculateSizes();

      // Closing the modal
      // this.locals.settingsModalShow = !this.locals.settingsModalShow;

      console.log("=======Converting 2 Image=======");
      domtoimage.toPng(document.getElementById("toBeConverted")).then((res) => {
        let compStyles = window.getComputedStyle(
          document.getElementById("toBeConverted")
        );
        let imgHeight = compStyles.getPropertyValue("height");

        this.locals.totalPagesHeight = this.convert2Inches(parseInt(imgHeight));
        console.log("totalPagesHeight", this.locals.totalPagesHeight);

        this.locals.totalPages = Math.ceil(
          this.locals.totalPagesHeight / this.locals.totalHeightOfAPaper
        );
        console.log("totalPages", this.locals.totalPages);

        // Element that children will be appended to
        let convertedElement = document.getElementsByClassName("converted");

        // Waits till the base template is generated and then appends the children
        this.$nextTick(() => {
          for (let index = 0; index < convertedElement.length; index++) {
            // Removing the existing canvas
            this.removeAllChildNodes(convertedElement[index]);
          }

          // Appening the results to parents
          for (let index = 0; index < convertedElement.length; index++) {
            let computedSy =
              index * this.convert2Pixels(this.locals.totalHeightOfAPaper);
            let result = this.canvasMaker(res, computedSy);
            convertedElement[index].appendChild(result);
          }
          console.log(
            `successfully appended ${convertedElement.length} Children`
          );
        });
      });
    },

    /**
     * JS functions for the modal
     */

    modalFinalFunc() {
      var modal = document.getElementById("myModal-final");

      // Get the button that opens the modal
      var btn = document.getElementById("myBtn-final");

      // Get the <span> element that closes the modal
      var span = document.getElementsByClassName("close-final")[0];

      // When the user clicks on the button, open the modal
      btn.onclick = function () {
        modal.style.display = "block";
      };

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
        headerSection.style.height = startHeight + e.clientY - startY + "px";
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
        footerSection.style.height = startHeight - e.clientY + startY + "px";
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
     *  Triggering editWhileInPreview
     */

    editWhileInPreview() {
      let modal = document.getElementById("myModal-final");
      modal.style.display = "none";
      this.locals.settingsModalShow = !this.locals.settingsModalShow;
    },
    deSelectAll() {
      if (this.locals.isClicked) {
        this.locals.isClicked = false;
        return;
      }
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
      let tmp = {
        type: classType,
        options: {
          configs: { text: "Enter Your Text" },
          styles: {},
        },
      };
      if (parent.includes("header")) {
        this.elements.headerElements.push(tmp);
      } else if (parent.includes("footer")) {
        this.elements.footerElements.push(tmp);
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
    droppedEleemntOnHeader() {
      let parent = "header";
      this.createElement(parent);
    },
    droppedEleemntOnFooter() {
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
    },
  },
};
</script>

<style>
.toolbar.header {
  background-color: rgb(232, 235, 240);
  color: #484848;
  border-bottom: 3px solid #084298;
  padding: 9px;
}
shadow {
  box-shadow: -3px 4px 9px 0px #ddd;
}
input {
  text-align: center;
  text-align-last: center;
}
select {
  text-align: center;
  text-align-last: center;
  /* webkit*/
}
option {
  text-align: left;
  /* reset to left*/
}
ul {
  padding: 0px !important;
}
.mainLoop {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.converted {
  text-align: center;
  flex-grow: 2;
  overflow: hidden;
}
#printForm {
  border: 1px ridge black;
}
.fa-print {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
.dateAndTimeToday {
  text-align: left;
}
.customHeader {
  text-align: center;
  margin-top: -50px;
}
.logo {
  text-align: right;
}

/* The Modal (background) */
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

/* Modal Content/Box */
.modal-content {
  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  padding: 20px;
  width: 825px; /* Could be more or less, depending on screen size */
}

/* The Close Button */
.close-raw {
  width: 60px;
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}
.close-final {
  width: 60px;
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close-raw:hover,
.close-raw:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
.close-final:hover,
.close-final:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
table td,
table th {
  border: 1px black solid;
  border-bottom: 1px black solid;
}
.converted img {
  width: 8.26in;
  margin-top: 24px;
  margin-bottom: 24px;
  /* margin-right: 950px; */
}
.mainFooter {
  margin-top: 7px;
  margin-bottom: 14px;
}
.wrapper {
  display: flex;
  flex-direction: row;
}
#page {
  width: max-content;
}
.template {
  overflow: hidden;
  border: 1px black ridge;
  display: flex;
  flex-direction: column;
}

#bodyTemplate {
  flex-grow: 2;
}
.section {
  position: relative;
  touch-action: none;
  user-select: none;
  /* This makes things *much* easier */
  box-sizing: border-box;
  direction: ltr;
}
.section .resizer {
  position: absolute;
  right: 0;
  left: 0;
}
.section .resizer:hover,
.section .resizer:active {
  cursor: n-resize;
}
.section.header .resizer {
  bottom: 0;
}
.section.footer .resizer {
  top: 0;
}
.section.header {
  border-bottom: 1px #aaa solid;
}
.section.footer {
  border-top: 1px #aaa solid;
}
.section.header.dragged {
  border: 5px #aaa dashed;
}
.section.footer.dragged {
  border: 5px #aaa dashed;
}
.element.selected .resizer {
  border-top: none !important;
  position: absolute;
  bottom: 0;
  top: auto !important;
  right: -3px;
  left: auto;
  width: 16px;
  height: 16px;
  background-size: cover;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjA0MDgxNTZEMzNFMTFFQkI3OTdDNDBEQjIyNzg3RTgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjA0MDgxNTVEMzNFMTFFQkI3OTdDNDBEQjIyNzg3RTgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiBXaW5kb3dzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9IjFEMTE1RDY1RUU3RTA0MDA4QTM0QThEMTBFQjcxQjVDIiBzdFJlZjpkb2N1bWVudElEPSIxRDExNUQ2NUVFN0UwNDAwOEEzNEE4RDEwRUI3MUI1QyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pi4XKu0AAACWUExURVhYWI2NjZubm46Ojvv7+wQEBPz8/E5OTk1NTQMDA1lZWQEBAVdXV4yMjO3t7cTExBcXF7q6uoKCgpKSkv7+/tPT0/b29p+fn11dXYuLi1JSUsPDw35+flxcXBMTE0dHR4CAgOjo6Ofn58XFxVtbW+Li4p6enmVlZeHh4SUlJezs7CQkJAgICAICAv39/f///wAAAP///+M2NPIAAAAydFJOU/////////////////////////////////////////////////////////////////8ADVCY7wAAANlJREFUeNps0ucSgkAMBODYUFGsYO+94S3v/3KGwB3gHT8cZr7JZidCifNRk2tCbpnieXKSqqGLC7klxtYjp7RAX8cu1eA0FptYYvgsFpkZi/Qem4o09UciMuOthhUq0pptYEx/DfxceliSK63DbzdFlbS+zHQA1JXZJRftm7R60VAuWqSlkpPMUDlNU2lP24iQK20mNSqtswbJYBdweZbSDTJ5jYAD8RcSl26QzbDgTBudFu7Nng9LlNDjjYX8P2oNzKVbGKAVpQ2Pdy+/yDhQ+gMd8u9PgAEARXlsB1h8RU4AAAAASUVORK5CYII=);
}

.element .resizer:hover,
.element .resizer:active {
  cursor: nwse-resize;
}

.template-builder {
  border: 1px #aaa ridge;
}

.fas:hover {
  cursor: pointer;
}

.element {
  text-align: center;
  position: absolute;
  width: 100px;
  overflow: hidden;
  min-height: 20px;
  min-width: 20px;
}
.element.selected {
  width: 100px;
  border: 1px #aaa dashed;
  border-radius: 4px;
}
.element:hover {
  width: 100px;
  border: 1px #aaa dashed;
  border-radius: 4px;
  cursor: move;
}
.element:active {
  cursor: grabbing;
}
</style>