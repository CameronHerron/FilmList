<template>
    <div>
        <button v-on:click="getGenreIds()">Show advanced search options</button>
        <div class="advanced-search" v-show="advanced">
            <ul>
                <li class="genre-button" v-for="genre in genres" :key="genre.id">
                    <button>{{ genre.name }}</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
  import { ref } from "vue";
  import StreamingService from "../services/StreamingService.js";

  const genres = ref([]);
  let advanced = false;
  
  function getGenreIds(){
    genres.value.length = 0;
    advanced = !advanced;
    StreamingService.getGenreIds().then((response) =>{
        let genreList = response.data.result;
        
            for(var key in genreList){
                genres.value.push( {
                    id: key,
                    name: genreList[key]
                })
            }
    })
    return genres;
  }
</script>