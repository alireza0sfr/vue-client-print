<template>
<div id="page" :dir="settings.R2L">
  <button
    @click="convert2Canvas()"
    id="myBtn-final"
    type="button"
    class="btn btn-sm btn-secondary"
  >Preview Final</button>
  <div v-show="true">
    <div
      :style="{'width': settings.defaultWidthOfPaper + 'in', 'margin-right': '200px', 'margin-left': '200px'}"
      id="toBeConverted"
    >
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
  <div id="myModal-final" class="modal card">
    <div class="modal-content">
      <div class="card-header">
        <span class="close-final">&times;</span>
        <i @click="printForm()" class="fas fa-print"></i>
      </div>
      <div id="printForm">
        <div
          :style="{'border': '1px solid black', 'border-bottom': '1px solid black', 'height': settings.defaultHeightOfPaper + 'in'}"
          class="mainLoop"
          v-for="index in settings.totalPages"
          :key="index"
        >
          <div
            class="fixedHeaderCondition"
            v-if="settings.hasHeader && settings.isHeaderRepeatable || index == 1"
          >
            <header style="height: 60px" class="MainHeader">
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
          <body
            :style="{
          'height': settings.totalHeightOfAPaper + 'in'}"
            class="converted"
          ></body>
          <div
            class="fixedFooterCondition"
            v-if="settings.hasFooter && settings.isFooterRepeatable || index == 1"
          >
            <footer class="MainFooter" id="break">
              {{settings.customFooter}}
              <br />
              <div
                v-if="settings.isPageCounter == true"
                :style="{ 'text-align': settings.pageCounterPosition }"
              >{{ index }}</div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
export default {
  name: "PrintStatic",
  props: {
    options: Object,
  },
  data() {
    return {
      dateToday: new Date()
        .toLocaleDateString("fa-IR")
        .replace(/([۰-۹])/g, (token) =>
          String.fromCharCode(token.charCodeAt(0) - 1728)
        ),
      timeToday:
        new Date().getHours() +
        ":" +
        new Date().getMinutes() +
        ":" +
        new Date().getSeconds(),
      settings: {
        isPageCounter: true,
        fileName: "nikan.pdf",
        pageCounterPosition: "center",
        hasHeader: true,
        hasFooter: true,
        isFooterRepeatable: true,
        isHeaderRepeatable: true,
        isFixedDateAndTime: true,
        orientation: "portrait",
        pageSize: "a4",
        customHeader: "",
        customFooter: "",
        logoURL: "",
        R2L: "rtl",
        totalPages: 1, // Needs to be one for the v-for to make the basic template before preview is triggered
        margin: 0,
        defaultHeightOfPaper: 0, // Standard Height of the chosen paper in inch
        defaultWidthOfPaper: 0, // Standard Width of the chosen paper in inch
        totalPagesHeight: 0, // The total size of the given div to be printed in inch
        totalHeightOfAPaper: 0, // Useable height for body tag
        marginTop: 0, // computed marginTop for canvas positioning
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
      },
    };
  },
  watch: {
    options: function (val) {
      this.settings = val;
    },
  },
  mounted() {
    this.modalFinalFunc();
    this.getHeight();
  },
  methods: {
    printForm() {
      let element = document.getElementById("printForm");
      let opt = {
        margin: this.settings.margin,
        filename: this.settings.fileName,
        pagebreak: { mode: "avoid-all", after: "#break" },
        image: { type: "jpeg", quality: 1 },
        html2canvas: { dpi: 300, width: 1430 },
        jsPDF: {
          unit: "px",
          format: this.settings.pageSize,
          orientation: this.settings.orientation,
        },
      };
      html2pdf().set(opt).from(element).save();
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
     * Clone the given canvas with the same sizes
     */

    cloneCanvas(oldCanvas) {
      //create a new canvas
      var newCanvas = document.createElement("canvas");
      var context = newCanvas.getContext("2d");

      //set dimensions
      newCanvas.width = oldCanvas.width;
      newCanvas.height = oldCanvas.height;

      //apply the old canvas to the new one
      context.drawImage(oldCanvas, 0, 0);

      //return the new canvas
      return newCanvas;
    },

    /**
     * converted given pixel to inch
     */

    convert2Inches(pixels) {
      return pixels / 96;
    },

    /**
     * Calculate the Sizes based upon the selected page orientation and format
     */

    calculateSizes() {
      // Calculating the footer size in inches
      let footerPage = document.getElementsByClassName("MainFooter")[0];
      let compStyles = window.getComputedStyle(footerPage);
      let pageFooterSize = this.convert2Inches(
        parseInt(compStyles.getPropertyValue("line-height"))
      );
      console.log("pagefootersize: ", pageFooterSize);

      // Calculating the header size in inches
      let headerPage = document.getElementsByClassName("MainHeader")[0];
      compStyles = window.getComputedStyle(headerPage);
      let pageHeaderSize = this.convert2Inches(
        parseInt(compStyles.getPropertyValue("line-height"))
      );
      console.log("pageheadersize: ", pageHeaderSize);

      // Gettings the default sizes from the base dic
      this.settings.defaultHeightOfPaper =
        this.settings.pageSizeDictionary[this.settings.orientation][
          this.settings.pageSize
        ]["height"];
      this.settings.totalHeightOfAPaper =
        this.settings.defaultHeightOfPaper - pageFooterSize - pageHeaderSize;

      this.settings.defaultWidthOfPaper =
        this.settings.pageSizeDictionary[this.settings.orientation][
          this.settings.pageSize
        ]["width"];

      // set the marginTop to opposite of the height to push every page up

      this.settings.marginTop = -this.settings.totalHeightOfAPaper;

      console.log("defaultWidthOfPaper: ", this.settings.defaultWidthOfPaper);
      console.log("defaultHeightOfPaper: ", this.settings.defaultHeightOfPaper);
      console.log("totalHeightOfAPaper: ", this.settings.totalHeightOfAPaper);
      console.log("marginTop: ", this.settings.marginTop);
    },

    /**
     * Converts the given html to canvas and append it to the body tag
     */

    convert2Canvas() {
      html2canvas(document.getElementById("toBeConverted")).then((canvas) => {
        this.settings.totalPagesHeight = this.convert2Inches(canvas.height);
        this.settings.totalPagesHeight =
          this.settings.totalPagesHeight.toFixed(2);
        console.log("totalPagesHeight", this.settings.totalPagesHeight);

        this.settings.totalPages = Math.ceil(
          this.settings.totalPagesHeight / this.settings.totalHeightOfAPaper
        );
        console.log("totalPages", this.settings.totalPages);

        // Element that children will be appended to
        let convertedElement = document.getElementsByClassName("converted");

        // Waits till the base template is generated and then appends the children
        this.$nextTick(() => {
          for (let index = 0; index < convertedElement.length; index++) {

            // Removing the existing canvas
            this.removeAllChildNodes(convertedElement[index]);
          }

          for (let index = 0; index < convertedElement.length; index++) {
            let clnCanvas = this.cloneCanvas(canvas);

            // Adding the marginTop to the canvas for the positioning of the body tag
            clnCanvas.style.marginTop = index * this.settings.marginTop + "in";

            convertedElement[index].appendChild(clnCanvas);
          }
          console.log(
            `Successfully appended ${convertedElement.length} children`
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
    modalRawFunc() {
      var modal = document.getElementById("myModal-raw");

      // Get the button that opens the modal
      var btn = document.getElementById("myBtn-raw");

      // Get the <span> element that closes the modal
      var span = document.getElementsByClassName("close-raw")[0];

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
  },
};
</script>

<style>
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
.converted canvas {
  width: 8.26in;
  margin-top: 24px;
  margin-bottom: 24px;
  /* margin-right: 950px; */
}
.MainFooter {
  margin-top: 7px;
  margin-bottom: 14px;
}
</style>