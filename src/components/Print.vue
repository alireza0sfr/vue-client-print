<template>
  <div id="printPage">
    <TemplateBuilder
      ref="TemplateBuilder"
      :options="locals.templateBuilderData"
    />

    <!-- Data Slots -->
    <div class="slotWrapper">
      <div
        :style="{
          width: settings.defaultWidthOfPaper + 'in',
          padding: settings.pagePadding,
        }"
      >
        <div id="toBeConverted">
          <slot class="printData" name="printData"></slot>
        </div>
      </div>
    </div>

    <!-- Print Preview Modal-->

    <div id="printModal" class="print-modal">
      <div
        class="print-modal-content"
        :style="{ width: settings.defaultWidthOfPaper + 0.5 + 'in' }"
      >
        <div class="print-modal-header">
          <div>
            <span id="printModalCloseBtn" class="close-btn">&times;</span>
          </div>
          <div>
            <h3 class="title">پیش نمایش چاپ</h3>
          </div>
          <div style="display: flex">
            <a
              @click="editWhileInPreview()"
              title="ویرایش"
              class="modal-icon"
              href="#"
            >
              <img src="./elements/images/edit.png" />
            </a>
            <a href="#" @click="printForm()" title="چاپ" class="modal-icon">
              <img src="./elements/images/printer.png" />
            </a>
          </div>
        </div>
        <div id="printForm">
          <div
            class="mainLoop"
            :style="{
              height: settings.defaultheightofpaper + 'in',
              width: settings.defaultWidthOfPaper + 'in',
            }"
            v-for="index in locals.totalPages"
            :key="index"
          >
            <div
              :style="{
                width: 'auto',
                border: settings.pageBorder,
                margin: settings.pagePadding,
              }"
              class="pages"
            >
              <div
                class="fixedHeaderCondition"
                v-if="settings.header.isHeaderRepeatable || index == 1"
              >
                <header
                  :style="{ height: settings.header.height + 'in' }"
                  class="mainHeader"
                >
                  <component
                    v-for="element in settings.header.headerElements"
                    :key="element.options.id"
                    :is="element.type"
                    :options="
                      prepareComponentsOptions(
                        element.options,
                        element.type,
                        index
                      )
                    "
                  />
                </header>
              </div>
              <div
                class="converted"
                :style="{ height: settings.totalHeightOfAPaper + 'in' }"
              ></div>
              <div
                class="fixedFooterCondition"
                v-if="settings.footer.isFooterRepeatable || index == 1"
              >
                <footer
                  :style="{ height: settings.footer.height + 'in' }"
                  class="mainFooter"
                >
                  <component
                    v-for="element in settings.footer.footerElements"
                    :key="element.options.id"
                    :is="element.type"
                    :options="
                      prepareComponentsOptions(
                        element.options,
                        element.type,
                        index
                      )
                    "
                  />
                  <!-- <div>{{ index }}</div> -->
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
import TemplateBuilder from "./TemplateBuilder.vue";
import TextPattern from "./elements/TextPattern.vue";
import TextElement from "./elements/TextElement.vue";
import DateTime from "./elements/DateTime.vue";
import BindingObject from "./elements/BindingObject.vue";
import PageCounter from "./elements/PageCounter.vue";
import ImageElement from "./elements/ImageElement.vue";
import domtoimage from "dom-to-image";
import html2pdf from "html2pdf.js";
export default {
  name: "Print",
  props: {
    options: Object,
    bindingObject: Object,
  },
  components: {
    textelement: TextElement,
    datetime: DateTime,
    pagecounter: PageCounter,
    imageelement: ImageElement,
    bindingObject: BindingObject,
    textpattern: TextPattern,
    TemplateBuilder,
  },
  data() {
    return {
      locals: {
        totalPages: 1, // Needs to be one for the v-for to make the basic template before preview is triggered
        totalPagesHeight: 0, // The total size of the given div to be printed in inch
        templateBuilderData: {},
      },
      settings: {
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
        fileName: "nikan",
        orientation: "portrait",
        pageSize: "a4",
        pageDirections: "rtl",
        bindingObject: {},
        pagePadding: "5px",
        pageBorder: "0px",
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
    this.modalFunc("printModal", "printModalCloseBtn");
  },
  methods: {
    printForm() {
      let pages = document.getElementsByClassName("pages");
      let opt = {
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
      domtoimage.toPng(document.getElementById("toBeConverted")).then((res) => {
        let compStyles = window.getComputedStyle(
          document.getElementById("toBeConverted")
        );
        let imgHeight = compStyles.getPropertyValue("height");

        this.locals.totalPagesHeight = this.convert2Inches(parseInt(imgHeight));

        this.locals.totalPages = Math.ceil(
          this.locals.totalPagesHeight / this.settings.totalHeightOfAPaper
        );

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
        });
      });
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

    /**
     * By Triggering this func template builder modal will be displayed
     */

    templateBuilder(json, callback) {
      json.callback = callback;
      this.locals.templateBuilderData = json;
      let tmp = JSON.parse(JSON.stringify(this.bindingObject));
      for (let item in tmp) {
        tmp[item] = null;
      }
      this.locals.templateBuilderData.bindingObject = tmp;
      this.$refs.TemplateBuilder.settingsInitFunc();
      this.$refs.TemplateBuilder.showModal();
    },

    /**
     * By Triggering this func Print Preview modal will be displayed
     */

    printPreview() {
      document.getElementById("printModal").style.display = "block";
      this.convert2Image();
    },

    /**
     *  Triggering editWhileInPreview
     */

    editWhileInPreview() {
      let printModal = document.getElementById("printModal");
      printModal.style.display = "none";
      this.templateBuilder(this.settings, (val) => {
        Object.assign(this.settings, val);
        this.printPreview();
      });
    },
    prepareComponentsOptions(options, type, index) {
      if (type == "pagecounter") {
        options.configs.counter = index;
      } else if (type == "bindingObject") {
        let key = options.configs.field;
        options.configs.value = this.bindingObject[key];
      } else if (type == "textpattern") {
        let matches = [], // an array to collect the strings that are matches
          types = [],
          regex = /{([^{]*?\w)(?=\})}/gim,
          text = options.configs.text,
          curMatch;

        while ((curMatch = regex.exec(text))) {
          types.push(curMatch[1]);
          matches.push(curMatch[0]);
        }

        for (let index = 0; index < types.length; index++) {
          text = text.replace(
            "{" + types[index] + "}",
            this.bindingObject[types[index]]
          );
        }
        options.configs.value = text;
      }
      return JSON.parse(JSON.stringify(options));
    },
  },
};
</script>

<style>
@import "./css/print.css";
@import "./css/modal.css";
</style>