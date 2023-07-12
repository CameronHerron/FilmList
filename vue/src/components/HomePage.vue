<template>
    <div>
        <h1 class="header">
            Search by Title
        </h1>

        <form @submit.prevent="searchForMovie(searchTerm)">
            <input v-model="searchTerm">
            <button>Search</button>
        </form>
        <body>
            <ul>
                <li class="movie-card" v-for="movie in movies" :key="movie.tmdbId">
                    <div>{{ movie.title }}</div>
                    <img :src="movie.image">
                    <!-- <p>{{ movie.overview }}</p> -->
                </li>
            </ul>
        </body>
        
        
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
                movies.value.push({
                    title: m.title,
                    tmdbId: m.tmdbId,
                    streamers: Object.hasOwn(m.streamingInfo, 'us') ? Object.keys(m.streamingInfo.us) : null
                    // getStreamerDetails(m.streamingInfo)
                    ,
                    image: m.posterURLs.original
                });
            });
        })
        return movies;
 }

//  function getStreamerDetails(json){
//     let streamerDetails = [];
//     if(Object.hasOwn(json, 'us')){
//             Object.keys(json.us).forEach(streamer =>{
//                 if(streamer.type == "free" || streamer.type == "subscription"){
//                     streamerDetails.push({
//                         streamerName: streamer,
//                         type: streamer.type
//                     })
//                 }
//             })
//     }
//     return streamerDetails;
//  }




</script>

<style>
    body{
        display: flex;
        justify-content: center;
    }
    ul{
        display: flex;
        flex-wrap: wrap;
    }
    .movie-card{
        list-style-type: none;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        border: 2px solid black;
        border-radius: 10px;
        height: 50vh;
        width:50vh;
        padding: 10px;
        margin: 20px;
    }
    img{
        max-height:60%
    }

</style>