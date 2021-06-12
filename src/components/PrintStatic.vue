<template>
    <div id="page" :dir="settings.R2L">
        <div v-show="true">
            <p style="width: 600px;" id="toBeConverted">to be inserted</p>
        </div>
        <button @click="convert2Canvas()" id="myBtn-final" type="button" class="btn btn-sm btn-secondary">Preview Final</button>
            <div id="myModal-final" class="modal card">
                <div class="modal-content">
                    <div class="card-header">
                        <span class="close-final">&times;</span>
                        <i @click="printForm()" class="fas fa-print"></i>
                    </div>
                    <div id="printForm">
                        <div class="mainLoop" v-for="index in settings.totalPages" :key="index"> 
                            <div class="fixedHeaderCondition" v-if="settings.isFixedHeader == true">
                                <header>
                                    <div class="header card-body">
                                        <div class="dateAndTimeToday">
                                            {{dateToday}}
                                            <br>
                                            {{timeToday}}
                                        </div>
                                        <div class="customHeader">
                                            Custom Header {{settings.customHeader}}
                                        </div>
                                        <div class="logo">
                                            <img :src="settings.logoURL" alt="Logo" height="40" width="40">
                                        </div>
                                    </div>
                                </header>
                                </div>
                            <div v-else class="fixedHeaderCondition">
                                    <header>
                                        <div class="header card-body">
                                            <div class="dateAndTimeToday">
                                                {{dateToday}}
                                                <br>
                                                {{timeToday}}
                                            </div>
                                            <div class="customHeader">
                                                Custom Header {{settings.customHeader}}
                                            </div>
                                            <div class="logo">
                                                <img :src="settings.logoURL" alt="Logo" height="42" width="42">
                                            </div>
                                        </div>
                                    </header>
                            </div>
                            <body class="converted">

                            </body>
                            <div class="fixedFooterCondition" v-if="settings.isFixedFooter == true">
                                <footer id="break">
                                    {{settings.customFooter}}
                                    <br>
                                    <div v-if="settings.isPageCounter == true" :style="{ 'text-align': settings.pageCounterPosition }">
                                        {{ index }}
                                    </div>
                                </footer>
                            </div>
                            <div v-else class="fixedFooterCondition">
                                <footer id="break">
                                    <div v-if="settings.isPageCounter == true" :style="{ 'text-align': settings.pageCounterPosition }">
                                        {{ index }}
                                    </div>
                                </footer>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import html2pdf from 'html2pdf.js'
import html2canvas from 'html2canvas'
export default {
    name: 'PrintStatic',
    props:{
        options: Object
    },
    data() {
        return {
            dateToday: new Date().toLocaleDateString('fa-IR').replace(/([۰-۹])/g, token => String.fromCharCode(token.charCodeAt(0) - 1728)),
            timeToday: new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds(),
            settings: {
                isPageCounter: true,
                fileName: 'nikan.pdf',
                pageCounterPosition: 'center',
                isFixedHeader: true,
                isFixedFooter: true,
                isFixedDateAndTime: true,
                orientation: 'portrait',
                pageSize: 'a4',
                customHeader: '',
                customFooter: '',
                logoURL: '',
                R2L: 'rtl',
                totalPages: 10,
                margin: 0,
                canvas: ''
            },
        }
    },
    watch : {
        options:function(val) {
        this.settings = val;
        },
    },
    mounted() {
        this.modalFinalFunc()
        // this.modalRawFunc()

    },
    methods: {
        printForm() {

            let element = document.getElementById('printForm');
            let opt = {
            margin:       this.settings.margin,
            filename:     this.settings.fileName,
            pagebreak: {mode: 'avoid-all', after: '#break'},
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'px', format: this.settings.pageSize, orientation: this.settings.orientation}
            };
            html2pdf().set(opt).from(element).save();
        },
        modalFinalFunc() {
            var modal = document.getElementById("myModal-final");

            // Get the button that opens the modal
            var btn = document.getElementById("myBtn-final");

            // Get the <span> element that closes the modal
            var span = document.getElementsByClassName("close-final")[0];

            // When the user clicks on the button, open the modal
            btn.onclick = function() {
            modal.style.display = "block";
            }

            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
            modal.style.display = "none";
            }

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
            }
        },
        modalRawFunc() {
            var modal = document.getElementById("myModal-raw");

            // Get the button that opens the modal
            var btn = document.getElementById("myBtn-raw");

            // Get the <span> element that closes the modal
            var span = document.getElementsByClassName("close-raw")[0];

            // When the user clicks on the button, open the modal
            btn.onclick = function() {
            modal.style.display = "block";
            }

            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
            modal.style.display = "none";
            }

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
            }
        },
        convert2Canvas() {
            function cloneCanvas(oldCanvas) {

            //create a new canvas
            var newCanvas = document.createElement('canvas');
            var context = newCanvas.getContext('2d');

            //set dimensions
            newCanvas.width = oldCanvas.width;
            newCanvas.height = oldCanvas.height;

            //apply the old canvas to the new one
            context.drawImage(oldCanvas, 0, 0);

            //return the new canvas
            return newCanvas;
        }
            html2canvas(document.getElementById('toBeConverted')).then(canvas => {
                let test = document.getElementsByClassName('converted')
                for (let index = 0; index < test.length; index++) {
                    let clnCanvas = cloneCanvas(canvas)
                    test[index].appendChild(clnCanvas)
                }
            })
    },
    }
}
</script>

<style>
.mainLoop {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.body {
    text-align: center;
    flex-grow: 2;
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
.modal{
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

/* Modal Content/Box */
.modal-content {
  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 80%; /* Could be more or less, depending on screen size */
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
</style>