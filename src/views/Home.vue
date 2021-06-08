<template>
  <div class="home">
    <div>
      <h1>Hello</h1>
    </div>
    <PrintStatic />
  </div>
</template>

<script>
import PrintStatic from '../components/PrintStatic.vue'
export default {
  name: 'Home',
  components: {
    PrintStatic
  }
}
</script>
