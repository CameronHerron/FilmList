<template>
    <div>
        <h1 class="header">
            Find On Streaming
        </h1>

        <form @submit.prevent="searchForMovie(searchTerm)">
            <div class="basic-search">
                <input v-model="searchTerm">
                <button class="btn btn-primary">Search</button>
            </div>
            <!-- <button v-on:click="getGenreIds(); advanced = !advanced">Show advanced search options</button> -->
            <span class="chosen-options">
                <p class="chosen-genre" v-show="searchGenre != ''">Genre: {{ searchGenre.name }}</p>
                <p class="chosen-streamer" v-show="searchStreamingService != ''">Streaming Service: {{ searchStreamingService}}</p>
            </span>
            <button type="button" class="btn btn-primary advanced" data-bs-toggle="modal" data-bs-target="#exampleModalCenter" >
                Show advanced search options
            </button>

            <!-- Modal -->
            <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">Advanced Search</h5>
                            <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            Genre:
                            <select class="form-select" aria-label="Default select example" v-model="searchGenre" v-on:click="getGenreIds()">
                                <option :value="{id: genre.id, name: genre.name}" v-for="genre in genres" :key="genre.id">{{ genre.name }}</option>
                            </select>
                            Streaming Service:
                            <select class="form-select" aria-label="Default select example" v-model="searchStreamingService" v-on:click="getStreamingServiceNames()">
                                <option :value="streamer.id" v-for="streamer in streamers" :key="streamer.id">{{ streamer.id }}</option>
                            </select>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- <select class="form-select" aria-label="Default select example" v-show="advanced" v-model="searchGenre">
                <option :value="genre.id" v-for="genre in genres" :key="genre.id">{{ genre.name }}</option>
            </select> -->
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
                                    <p class="card-text">{{ movie.overview }}</p>
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
    let searchGenre = ref('');
    let searchStreamingService = ref('');
    // let advanced = false;

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

  function getGenreIds(){
    genres.value.length = 0;
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

  const streamers = ref([]);
  function getStreamingServiceNames(){
    streamers.value.length = 0;
    StreamingService.getStreamingServices().then((response) =>{
        let streamerList = response.data.result;
        
        for(var key in streamerList){
                streamers.value.push( {
                    id: key,
                })
            }
    })
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
    form{
        display: flex;
        flex-direction: column;
    }
    .advanced{
        margin: 5px;
    }

</style>