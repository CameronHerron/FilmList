<template>
  <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  <TitleSearch />
  <AdvancedSearch />
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import TitleSearch from './components/TitleSearch.vue';
import AdvancedSearch from './components/AdvancedSearch.vue';

export default {
  name: 'App',
  components: {
    // HelloWorld,
    TitleSearch,
    AdvancedSearch
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
