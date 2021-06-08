<template>
    <div id="page" :dir="settings.R2L">
        <button id="myBtn" type="button" class="btn btn-sm btn-secondary">Preview</button>
        <div id="myModal" class="modal card">
            <div class="modal-content">
                <div class="card-header">
                    <span class="close">&times;</span>
                    <i @click="printForm()" class="fas fa-print"></i>
                </div>
                <div id="printForm">
                    <header>
                        <div class="header card-body">
                            <div class="dateAndTimeToday">
                                {{dateToday}}
                                <br>
                                {{timeToday}}
                            </div>
                            <div class="customHeader">
                                Custom Header {{customHeader}}
                            </div>
                            <div class="logo">
                                <img :src="settings.logoURL" alt="Logo" height="42" width="42">
                            </div>
                        </div>
                    </header>
                    <body>

                    </body>
                    <footer>
                        {{customFooter}}
                        <br>
                        <div v-if="settings.isPageCounter == true" :style="{ 'text-align': settings.pageCounterPosition }">
                            {{ settings.pageCounter }}
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import html2pdf from 'html2pdf.js'
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
                pageCounter: 1,
                isPageCounter: true,
                fileName: 'nikan.pdf',
                pageCounterPosition: 'center',
                isFixedHeader: true,
                isFixedDateAndTime: true,
                orientation: 'portrait',
                pageSize: 'a4',
                customHeader: '',
                customFooter: '',
                logoURL: '',
                R2L: 'rtl'
            },
        }
    },
    watch : {
        options:function(val) {
        this.settings = val;
        },
    },
    mounted() {
        this.modalFunc()
    },
    methods: {
        increasePageCounter() {
            this.pageCounter += 1
        },
        printForm() {

            let element = document.getElementById('printForm');
            let opt = {
            margin:       0,
            filename:     this.fileName,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: this.pageSize, orientation: this.orientation}
            };
            html2pdf().set(opt).from(element).save();
        },
        modalFunc() {
            var modal = document.getElementById("myModal");

            // Get the button that opens the modal
            var btn = document.getElementById("myBtn");

            // Get the <span> element that closes the modal
            var span = document.getElementsByClassName("close")[0];

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
        }
    },
}
</script>

<style>
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
.close {
  width: 60px;
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>