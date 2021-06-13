<template>
  <div class="home">
    <div>
      <h1>Hello</h1>
    </div>
    <PrintTest />
  </div>
</template>

<script>
// import PrintStatic from '../components/PrintStatic.vue'
import PrintTest from '../components/PrintTest.vue'
export default {
  name: 'Home',
  components: {
    PrintTest
  }
}
</script>
