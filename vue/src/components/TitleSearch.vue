<template>
    <div>
        <h1 class="header">
            Find On Streaming
        </h1>

        <form @submit.prevent="searchForMovie(searchTerm)">
            <input v-model="searchTerm">
            <button>Search</button>
            <button v-on:click="getGenreIds()">Show advanced search options</button>
            <div class="advanced-search" v-show="advanced">
                <ul>
                    <li class="genre-button" v-for="genre in genres" :key="genre.id">
                        <button>{{ genre.name }}</button>
                    </li>
                </ul>
            </div>

            <!-- <div class="dropdown" v-show="advanced">
                <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Genres
                </button>
                <ul class="dropdown-menu">
                    <li class="genre-button" v-for="genre in genres" :key="genre.id"><a class="dropdown-item" href="#">{{ genre.name }}</a></li>
                </ul>
            </div> -->
        </form>
        <body>
            <ul>
                <li class="movie-card" v-for="movie in movies" :key="movie.tmdbId">
                    <div class="card mb-3" style="max-width: 540px;">
                        <div class="row g-0">
                            <div class="col-md-4">
                                <img :src="movie.image" class="img-fluid rounded-start" alt="...">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">{{ movie.title }}</h5>
                                    <p class="card-text">
                                        <ul class="streaming">
                                            <li v-for="streamer in movie.streamers" :key="streamer">{{ streamer.streamerName }} : {{ streamer.type }}</li>
                                        </ul>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
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
        padding: 5px;
        margin: 10px;
    }
    .streaming{
        display: flex;
        align-items: space-between;
    }
    .streaming li{
        margin: 2px;
    }

</style>