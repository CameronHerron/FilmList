<template>
  <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  <TitleSearch />
</template>

<script>

import TitleSearch from './components/TitleSearch.vue';


export default {
  name: 'App',
  components: {
    // HelloWorld,
    TitleSearch
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
