<template>
<div id="page" :dir="settings.R2L">
  <!--Buttons-->

  <i @click="convert2Image()" id="myBtn-final" type="button" class="fas fa-2x fa-eye"></i>
  <i v-if="locals.settingsModalShow == false" @click="settingsInitFunc()" class="fas fa-2x fa-cog"></i>
  <i v-if="locals.settingsModalShow" @click="calculateSizes()" class="fas fa-2x fa-check-circle"></i>
  <!-- Main Wrapper and Sections-->

  <div class="wrapper">
    <!-- Section 1 (Slidebar) -->
    <div v-if="locals.settingsModalShow" class="section1 container-fluid">
      <div class="row flex-nowrap">
        <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
          <div
            class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100"
          >
            <a
              href="/"
              class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none"
            >
              <span class="fs-5 d-none d-sm-inline">Menu</span>
            </a>
            <ul
              class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
              id="menu"
            >
              <li class="nav-item">
                <a href="#" class="nav-link align-middle px-0">
                  <i class="fs-4 bi-house"></i>
                  <span class="ms-1 d-none d-sm-inline">Home</span>
                </a>
              </li>
              <li>
                <a href="#submenu1" data-bs-toggle="collapse" class="nav-link px-0 align-middle">
                  <i class="fs-4 bi-speedometer2"></i>
                  <span class="ms-1 d-none d-sm-inline">Dashboard</span>
                </a>
                <ul class="collapse show nav flex-column ms-1" id="submenu1" data-bs-parent="#menu">
                  <li class="w-100">
                    <a href="#" class="nav-link px-0">
                      <span class="d-none d-sm-inline">Item</span> 1
                    </a>
                  </li>
                  <li>
                    <a href="#" class="nav-link px-0">
                      <span class="d-none d-sm-inline">Item</span> 2
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#" class="nav-link px-0 align-middle">
                  <i class="fs-4 bi-table"></i>
                  <span class="ms-1 d-none d-sm-inline">Orders</span>
                </a>
              </li>
              <li>
                <a href="#submenu2" data-bs-toggle="collapse" class="nav-link px-0 align-middle">
                  <i class="fs-4 bi-bootstrap"></i>
                  <span class="ms-1 d-none d-sm-inline">Bootstrap</span>
                </a>
                <ul class="collapse nav flex-column ms-1" id="submenu2" data-bs-parent="#menu">
                  <li class="w-100">
                    <a href="#" class="nav-link px-0">
                      <span class="d-none d-sm-inline">Item</span> 1
                    </a>
                  </li>
                  <li>
                    <a href="#" class="nav-link px-0">
                      <span class="d-none d-sm-inline">Item</span> 2
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#submenu3" data-bs-toggle="collapse" class="nav-link px-0 align-middle">
                  <i class="fs-4 bi-grid"></i>
                  <span class="ms-1 d-none d-sm-inline">Products</span>
                </a>
                <ul class="collapse nav flex-column ms-1" id="submenu3" data-bs-parent="#menu">
                  <li class="w-100">
                    <a href="#" class="nav-link px-0">
                      <span class="d-none d-sm-inline">Product</span> 1
                    </a>
                  </li>
                  <li>
                    <a href="#" class="nav-link px-0">
                      <span class="d-none d-sm-inline">Product</span> 2
                    </a>
                  </li>
                  <li>
                    <a href="#" class="nav-link px-0">
                      <span class="d-none d-sm-inline">Product</span> 3
                    </a>
                  </li>
                  <li>
                    <a href="#" class="nav-link px-0">
                      <span class="d-none d-sm-inline">Product</span> 4
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#" class="nav-link px-0 align-middle">
                  <i class="fs-4 bi-people"></i>
                  <span class="ms-1 d-none d-sm-inline">Customers</span>
                </a>
              </li>
            </ul>
            <hr />
          </div>
        </div>

        <!-- Section 2 (Paper clone)-->

        <div>
          <div
            v-if="locals.settingsModalShow"
            :style="{'height': locals.defaultHeightOfPaper + 'in', 'width': locals.defaultWidthOfPaper + 'in'}"
            class="section2"
          >
            <div
              :style="{'height': locals.pageHeaderSize + 'in'}"
              id="headerSection2"
              class="resizableHeader"
            >
              <p class="textInput">Header</p>
            </div>
            <div id="bodySection2">
              <p>Body</p>
            </div>
            <div
              :style="{'height': locals.pageFooterSize + 'in'}"
              id="footerSection2"
              class="resizableFooter"
            >
              <p class="textInput">Footer</p>
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
          <i @click="edit()" class="fas fa-2x fa-edit"></i>
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
  </div>
</div>
</template>

<script>
import domtoimage from "dom-to-image";
import html2pdf from "html2pdf.js";
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
      },
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
        margin: 0,
      },
    };
  },
  watch: {
    options: function (val) {
      this.settings = val;
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
        filename: this.settings.fileName,
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
          isPageCounter: this.settings.isPageCounter,
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
          R2L: this.settings.R2L,
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
      let footerPage = document.getElementById("footerSection2");
      let pageFooterSize = this.convert2Inches(
        parseInt(footerPage.offsetHeight)
      );
      this.locals.pageFooterSize = pageFooterSize;
      console.log("pageFooterSize: ", pageFooterSize);

      // Calculating the header size in inches
      let headerPage = document.getElementById("headerSection2");
      let pageHeaderSize = this.convert2Inches(headerPage.offsetHeight);
      this.locals.pageFooterSize = pageFooterSize;
      console.log("pageheadersize: ", pageHeaderSize);

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

      // Closing the edit modal
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
        this.textInputHeader();
        this.textInputFooter();
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
     * Adjust the borders height by dragging
     */

    headerBorderDragFunc() {
      var headerSection = document.getElementsByClassName("resizableHeader")[0]; // element to make resizable

      var resizer = document.createElement("div");
      resizer.className = "resizerHeader resizer";
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
     * Adjust the borders height by dragging
     */

    footerBorderDragFunc() {
      var footerSection = document.getElementsByClassName("resizableFooter")[0]; // element to make resizable

      var resizer = document.createElement("div");
      resizer.className = "resizerFooter resizer";
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
     *  Triggering edit
     */

    edit() {
      let modal = document.getElementById("myModal-final");
      modal.style.display = "none";
      this.locals.settingsModalShow = !this.locals.settingsModalShow;
    },

    /**
     * Editing the text in paper clone
     */

    textInputHeader() {
      // Making the text area at click
      let n = 0;
      let headerSection = document.getElementsByClassName("textInput")[0];
      headerSection.addEventListener("mousedown", initEditHeader, false);

      function initEditHeader() {
        if (n < 1) {
          headerSection.removeChild(headerSection.firstChild);
          let inputField = document.createElement("TEXTAREA");
          inputField.id = "inputField";
          inputField.setAttribute("type", "text");
          inputField.setAttribute("placeholder", "Type Your Header");
          headerSection.appendChild(inputField);
          headerSection.addEventListener("mouseenter", hoverEditHeader, false);
          n += 1;
        }

        // active border on hover
      }
      function hoverEditHeader() {
        console.log("hover");
        let textInput = document.getElementById("inputField");
        textInput.className = "inputFieldOn";
        headerSection.addEventListener("mouseleave", HoverEditHeaderOff, false);
      }
      function HoverEditHeaderOff() {
        console.log("hoveroff");
        let textInput = document.getElementById("inputField");
        textInput.className = "inputFieldOff";
      }
    },
    textInputFooter() {
      // Making the text area at click
      let i = 0;
      let footerSection = document.getElementsByClassName("textInput")[1];
      footerSection.addEventListener("mousedown", initEditFooter, false);
      function initEditFooter() {
        if (i < 1) {
          footerSection.removeChild(footerSection.firstChild);
          let inputField = document.createElement("TEXTAREA");
          inputField.id = "inputFieldFooter";
          inputField.setAttribute("type", "text");
          inputField.setAttribute("placeholder", "Type Your Header");
          footerSection.appendChild(inputField);
          footerSection.addEventListener("mouseenter", hoverEditFooter, false);
          i += 1;
        }
      }
      function hoverEditFooter() {
        console.log("hover");
        let textInput = document.getElementById("inputFieldFooter");
        textInput.className = "inputFieldOn";
        footerSection.addEventListener("mouseleave", HoverEditFooterOff, false);
      }
      function HoverEditFooterOff() {
        let textInput = document.getElementById("inputFieldFooter");
        textInput.className = "inputFieldOff";
      }
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
.section2 {
  overflow: hidden;
  border: 1px black ridge;
  display: flex;
  flex-direction: column;
}

#bodySection2 {
  flex-grow: 2;
}
.resizableHeader {
  border-bottom: 1px #aaa ridge;
  position: relative;
  touch-action: none;
  user-select: none;
  /* This makes things *much* easier */
  box-sizing: border-box;
}
.resizableFooter {
  border-top: 1px ridge #aaa;
  position: relative;
  color: black;
  touch-action: none;
  user-select: none;
  /* This makes things *much* easier */
  box-sizing: border-box;
}
.resizer:hover {
  cursor: n-resize;
}
.resizer:active {
  cursor: n-resize;
}
.section1 {
  border: 1px black ridge;
}
.resizerHeader {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
}
.resizerFooter {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}
.fas:hover {
  cursor: pointer;
}
.inputFieldOff {
  height: 100%;
  text-align: center;
  width: 60%;
  border-radius: 0px;
  border: 0px;
}
.inputFieldOn {
  height: 100%;
  text-align: center;
  width: 60%;
}
</style>