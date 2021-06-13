2a3,5
>   <div v-show="true">
>     <p style="width: 600px;" id="toBeConverted">to be inserted</p>   => is a problem
>   </div>
9,11d11
<   <div v-show="true">
<     <p id="toBeConverted">lorem50000</p>
<   </div>
19c19
<         <div class="mainLoop" v-for="index in 3" :key="index"> => miare ba ykami tafavot miare => fqt to mainloop aval mirizatesh
---
>         <div class="mainLoop" v-for="index in settings.totalPages" :key="index">
116c116
<     // this.getHeight();
---
>     this.getHeight();
