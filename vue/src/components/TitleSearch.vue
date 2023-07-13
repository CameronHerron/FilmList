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
                    <h2>{{ movie.title }}</h2>
                    <img :src="movie.image">
                    <!-- <p>{{ movie.overview }}</p> -->
                    <p>Streaming on:</p>
                    <ul class="streaming">
                        <li v-for="streamer in movie.streamers" :key="streamer">{{ streamer.streamerName }} : {{ streamer.type }}</li>
                    </ul>
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
                if(Object.hasOwn(m.streamingInfo, 'us')){
                    for(var key in m.streamingInfo.us) {
                        for(var type in m.streamingInfo.us[key]) {
                            if(m.streamingInfo.us[key][type].type == "free" || m.streamingInfo.us[key][type].type == "subscription"){
                                movies.value.push({
                                title: m.title,
                                tmdbId: m.tmdbId,
                                streamers: getStreamerDetails(m.streamingInfo),
                                image: m.posterURLs.original,
                                overview: m.overview
                                });
                            }
                        }
                    }           
                }
            });
        })
        return movies;
 }

 function getStreamerDetails(json){
    let streamerDetails = [];
    if(Object.hasOwn(json, 'us')){
        for(var key in json.us) {
            for(var type in json.us[key]) {
                if(json.us[key][type].type == "free" || json.us[key][type].type == "subscription"){
                    streamerDetails.push({
                                streamerName: key,
                                type: json.us[key][type].type
                    })
                }
            }
        }           
        return streamerDetails;
    }
    return streamerDetails;
 }

 

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
    li{
        list-style-type: none;
    }
    .movie-card{
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
    .streaming{
        display: flex;
        align-items: space-between;
    }
    .streaming li{
        margin: 2px;
    }

</style>