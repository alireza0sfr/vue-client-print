<template>
    <div id="page" :dir="settings.R2L">
        <button @click="convert2Canvas()" id="myBtn" type="button" class="btn btn-sm btn-secondary">Preview</button>
        <div id="myModal" class="modal card">
            <div class="modal-content">
                <div class="card-header">
                    <span class="close">&times;</span>
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
                                        Custom Header {{customHeader}}
                                    </div>
                                    <div class="logo">
                                        <img :src="settings.logoURL" alt="Logo" height="42" width="42">
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
                                            Custom Header {{customHeader}}
                                        </div>
                                        <div class="logo">
                                            <img :src="settings.logoURL" alt="Logo" height="42" width="42">
                                        </div>
                                    </div>
                                </header>
                        </div>
                        <body class="body">
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem fugiat hic ducimus iste, facere laudantium perferendis? Impedit suscipit ipsam, recusandae hic eos odit animi laboriosam, accusamus molestias vel quia consequatur. Alias nihil dolorum expedita culpa temporibus recusandae assumenda ullam cum ad neque ratione sed eum odio reiciendis, excepturi nisi officiis placeat quos praesentium corporis accusantium! Sapiente tempora dignissimos eum perferendis, quisquam magnam error hic. Expedita ea a nesciunt ipsam quae. Excepturi beatae illum optio omnis, iste consequatur quos eligendi sed pariatur provident. Voluptatum a, ab tempora minima aliquid voluptatem dolores autem porro quos, unde, nemo totam labore sapiente deserunt ratione nesciunt dicta. Est laboriosam sapiente earum pariatur quas possimus aut, beatae molestiae ipsum sed temporibus illum maiores veritatis ipsa. Iure sapiente atque impedit, magnam quia reiciendis, blanditiis quasi enim optio eaque, fugiat dolores! Laboriosam nulla quasi nesciunt ducimus laborum nemo tempore repudiandae optio eius, harum dolorum pariatur consectetur alias quae sapiente consequuntur maiores? Reiciendis rerum numquam doloribus, laboriosam error illum quos quo ad tenetur ipsa eius eligendi modi. Nihil repellendus eum recusandae alias nobis eveniet esse nam id ad ab veniam totam animi sint tenetur praesentium, sed minima, ducimus amet ea laborum, laboriosam ut saepe quidem error. Tempore dolor, asperiores cumque nulla blanditiis omnis impedit explicabo nostrum possimus ipsum dolorum nobis quas fugit iure magnam culpa harum magni. Dolorem veniam voluptatum incidunt nostrum sint ad veritatis aliquid quis dolores, aspernatur nobis tenetur ut eveniet id dolor, neque at provident ipsa, illum nulla doloribus dicta voluptate! Provident rerum consectetur atque error vero nihil earum quibusdam harum iure, cum hic? Excepturi quae natus architecto sint accusantium, ducimus, ab repudiandae autem numquam officia nesciunt exercitationem? Error ducimus corrupti soluta quas laborum excepturi dolores dolor tempore veniam doloribus. Earum rerum rem nisi veniam molestias reiciendis cupiditate magni asperiores repellat dolores. Fugiat libero ipsa quas facilis! Et, non modi quae dolore eaque quos ea. Ipsum veniam soluta sit asperiores labore provident illo a iste. Fugiat possimus eum, nihil fuga quos porro. In, deserunt. Molestiae nobis velit aut aspernatur quam dolore animi mollitia sunt reprehenderit repellat, adipisci impedit magni quaerat repellendus corporis. Fugiat, sed non earum cum exercitationem nemo quasi illo sapiente facere vitae repellendus, excepturi nobis quis qui. Aliquam vel quo voluptate recusandae, dicta architecto, harum asperiores autem est dolore voluptatibus amet, atque animi ipsam saepe. Nobis quasi optio, omnis voluptatem quam voluptates cum quas! Laborum est esse architecto dolorem tenetur ea repellendus veritatis doloremque consequatur distinctio. Provident obcaecati nesciunt exercitationem alias sequi qui eligendi accusamus aliquid, eaque minus illum harum ducimus facere blanditiis dolorum earum eveniet. Esse eum veniam dolorem ab aperiam cum culpa iste laborum, blanditiis reprehenderit voluptatum sunt numquam illum natus voluptas impedit! Fuga, nam facere? Quaerat quibusdam ipsum enim recusandae dolores reprehenderit minus perferendis, alias iure excepturi dicta, dolore quia libero consectetur dolor magni temporibus sunt omnis maxime id nam. Aut a quisquam, nulla repudiandae officiis voluptas aperiam eius dolorum architecto distinctio modi? Dolores iusto, aliquam magnam officia, doloremque aliquid incidunt veniam repudiandae ab odio dolore voluptas sint tempora asperiores recusandae ipsum modi maxime illo, praesentium suscipit quaerat nostrum. Ex architecto id error perferendis sequi debitis officiis nam dicta quos? Architecto quaerat asperiores excepturi voluptates at consectetur temporibus commodi quidem harum sapiente, nam in. Et omnis quaerat cupiditate! Earum nemo asperiores repellat, harum voluptates rerum totam molestiae ab quibusdam provident architecto praesentium consequuntur cupiditate, officia odio numquam ipsam ratione inventore magnam unde possimus expedita consectetur? Vel maxime autem a nemo ratione qui rem repudiandae, quam odit earum doloremque voluptates corrupti non ullam recusandae error labore voluptatem, dolore culpa laboriosam ipsam! Culpa et inventore ipsa similique sapiente, ipsam reprehenderit animi dignissimos id corrupti? Harum possimus expedita ab saepe, suscipit id assumenda accusantium? Dolor, praesentium at minima reiciendis est soluta. Magnam, magni dolores illo optio beatae ut voluptatum quam rem. Quae odio facilis a consequatur explicabo, officia cumque. Laboriosam adipisci possimus libero, labore tempora totam corrupti repudiandae mollitia ad praesentium exercitationem, omnis iure facilis doloremque nam, natus vel quasi architecto soluta. Doloribus iusto illo quisquam magnam numquam deleniti voluptas vel laboriosam commodi quibusdam maxime dicta velit voluptatum, delectus animi labore saepe odio? Commodi cupiditate sunt quam explicabo repellendus eaque cum sed quasi reiciendis, aut amet? Quod neque vero, deserunt expedita consequuntur veritatis accusamus?</p>
                        </body>
                        <div class="fixedFooterCondition" v-if="settings.isFixedFooter == true">
                            <footer id="break">
                                {{customFooter}}
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
                margin: 0
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
        },
        convert2Canvas() {
            
        }
    },
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