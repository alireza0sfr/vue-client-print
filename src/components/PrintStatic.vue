<template>
<div id="printPage">
  <!--Buttons-->
  <i @click="convert2Image()" id="myBtn-final" type="button" class="fas fa-2x fa-eye"></i>
  

  <TemplateBuilder  ref="TemplateBuilder" :options="{}"/>

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
          :style="{'border': '1px solid black', 'border-bottom': '1px solid black', 'height': settings.defaultHeightOfPaper + 'in'}"
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
            <body class="converted" :style="{'height': settings.totalHeightOfAPaper + 'in'}"></body>
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
import TemplateBuilder from './TemplateBuilder.vue'
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
    TemplateBuilder
  },
  data() {
    return {
      locals: {
        totalPages: 1, // Needs to be one for the v-for to make the basic template before preview is triggered
        totalPagesHeight: 0, // The total size of the given div to be printed in inch
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
     * converts given inch to pixel
     */

    convert2Pixels(inches) {
      return (inches * 96).toFixed(2);
    },

    /**
     * Converts given base64 to canvas
     */

    canvasMaker(imgBase64, sy) {
      let img = new Image();
      let canvas = document.createElement("canvas");
      canvas.height = this.convert2Pixels(this.settings.totalHeightOfAPaper);
      canvas.width = this.convert2Pixels(this.settings.defaultWidthOfPaper);
      let context = canvas.getContext("2d");
      img.src = imgBase64;
      img.onload = () => {
        context.drawImage(
          img,
          0,
          sy,
          this.convert2Pixels(this.settings.defaultWidthOfPaper),
          this.convert2Pixels(this.settings.totalHeightOfAPaper),
          0,
          0,
          this.convert2Pixels(this.settings.defaultWidthOfPaper),
          this.convert2Pixels(this.settings.totalHeightOfAPaper)
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
          this.locals.totalPagesHeight / this.settings.totalHeightOfAPaper
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
              index * this.convert2Pixels(this.settings.totalHeightOfAPaper);
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
     *  Triggering editWhileInPreview
     */

    editWhileInPreview() {
      let modal = document.getElementById("myModal-final");
      modal.style.display = "none";
      this.locals.settingsModalShow = !this.locals.settingsModalShow;
    },
  },
};
</script>

<style>
@import "./css/style.css";
</style>