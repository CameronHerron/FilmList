<template>
    <div>
        <h1 class="header">
            Find on Streaming
        </h1>

        <form @submit.prevent="searchForMovie(searchTerm)">
            <input v-model="searchTerm">
            <button>Search</button>
        </form>

        <ul>
            <li v-for="movie in movies" :key="movie.tmdbId">{{ movie.title }}</li>
        </ul>
        
    </div>
</template>

<script setup>
  import { ref } from "vue";
  import StreamingService from "../services/StreamingService.js";

    const movies = ref([]);
    let searchTerm = ref('');

    function searchForMovie(searchTerm){
        StreamingService.getMovieDetailsByName(searchTerm).then((response) => {
            let movieList = response.data.result;
            movies.value.length = 0;
            movieList.forEach(m => {
                movies.value.push(m)
            });
        })
        return movies;
 }




</script>

<style>

</style>