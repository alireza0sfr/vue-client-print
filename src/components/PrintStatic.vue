<template>
<div id="page">
  <!--Buttons-->
  <i @click="convert2Image()" id="myBtn-final" type="button" class="fas fa-2x fa-eye"></i>

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
</template>

<script>
import TextElement from "./elements/TextElement.vue";
import DateTime from "./elements/DateTime.vue";
import BindingObjects from "./elements/BindingObjects.vue";
import PageCounter from "./elements/PageCounter.vue";
import ImageElement from "./elements/ImageElement.vue";
import domtoimage from "dom-to-image";
import html2pdf from "html2pdf.js";
export default {
  name: "PrintStatic",
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
        totalPages: 1, // Needs to be one for the v-for to make the basic template before preview is triggered
        defaultHeightOfPaper: 11.7, // Standard Height of the chosen paper in inch
        defaultWidthOfPaper: 8.26, // Standard Width of the chosen paper in inch
        totalPagesHeight: 0, // The total size of the given div to be printed in inch
        totalHeightOfAPaper: 10.4, // Useable height for body tag
      },
      settings: {
        fileName: "nikan",
        isFooterRepeatable: true,
        isHeaderRepeatable: true,
        orientation: "portrait",
        pageSize: "a4",
        pageDirections: "rtl",
        margin: 0,
        headerElements: [],
        footerElements: [],
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
      // this.calculateSizes(); // Calculate the requires sizes to export

      // Syncing headerElements with the user chagnes
      let headerElements = this.elements.headerElements;
      let footerElements = this.elements.footerElements;

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

      console.log(headerElements);
      console.log(footerElements);

      let tmp = {
        header: {
          isHeaderRepeatable: this.settings.isHeaderRepeatable,
          height: this.locals.pageHeaderSize,
          headerElements: this.elements.headerElements,
        },
        footer: {
          isFooterRepeatable: this.settings.isFooterRepeatable,
          height: this.locals.pageFooterSize,
          footerElements: this.elements.footerElements,
        },
        settings: {
          orientation: this.settings.orientation,
          pageSize: this.settings.pageSize,
          pageDirections: this.settings.pageDirections,
        },
      };

      // Closing the editWhileInPreview modal
      this.locals.settingsModalShow = !this.locals.settingsModalShow;

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

      // Gettings the default sizes from the base dic
      this.locals.defaultHeightOfPaper =
        this.locals.pageSizeDictionary[this.settings.orientation][
          this.settings.pageSize
        ]["height"];
      this.locals.totalHeightOfAPaper =
        this.locals.defaultHeightOfPaper -
        this.locals.pageFooterSize -
        this.locals.pageHeaderSize -
        errorValue;

      this.locals.defaultWidthOfPaper =
        this.locals.pageSizeDictionary[this.settings.orientation][
          this.settings.pageSize
        ]["width"];

      console.log("defaultWidthOfPaper: ", this.locals.defaultWidthOfPaper);
      console.log("defaultHeightOfPaper: ", this.locals.defaultHeightOfPaper);
      console.log("totalHeightOfAPaper: ", this.locals.totalHeightOfAPaper);
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
        that.locals.pageHeaderSize = that.convert2Inches(
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
        that.locals.pageFooterSize = that.convert2Inches(
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
     *  Triggering editWhileInPreview
     */

    editWhileInPreview() {
      let modal = document.getElementById("myModal-final");
      modal.style.display = "none";
      this.locals.settingsModalShow = !this.locals.settingsModalShow;
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
      let headerElements = this.elements.headerElements;
      let footerElements = this.elements.footerElements;
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
@import "./css/style.css";
</style>