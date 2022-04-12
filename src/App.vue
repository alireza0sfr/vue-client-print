<template>
  <div id="app">
      <Home />
  </div>
</template>

<script>
import Home from '~/views/Home.vue'
export default {
  name: 'App',
  components: {
    Home
  }
}
</script>

<style>
#app {
  scroll-behavior: smooth;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
