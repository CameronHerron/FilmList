<template>
    <div>
        <header>
            <!-- <h5><small class="text-muted">Search it</small></h5>
            <h3><small class="text-muted">Find it</small></h3>
            <h2><small class="text-muted">Watch it</small></h2>
            <h1 class="header display-1">StreamIt</h1> -->
            <h1 class="display-6 text-muted grid-item">Search it</h1>
            <h1 class="display-5 text-muted grid-item">Find it</h1>
            <h1 class="display-4 text-muted grid-item">Watch it</h1>
            <h1 class="display-1 grid-item">StreamIt</h1>
        </header>
        


        <div class="search-container">
            <input v-model="searchTerm">
            <div class="search-buttons">
                <button class="btn btn-primary" @click.prevent="searchForMovie(searchTerm)">Search</button>
                <button type="button" class="btn btn-primary advanced" data-bs-toggle="modal"
                    data-bs-target="#exampleModalCenter">
                    Advanced
                </button>
            </div>
        </div>

        <span class="chosen-options">
            <span class="badge rounded-pill bg-secondary" v-show="searchGenre != ''">Genre: {{ searchGenre.name }}
                <button class="btn-close btn-close-white" aria-hidden="true" @click="searchGenre = ''">&times;</button>
            </span>
            <span class="badge rounded-pill bg-secondary" v-show="searchStreamingService != ''">Streaming Service: {{
                searchStreamingService }}
                <button class="btn-close btn-close-white" aria-hidden="true"
                    @click="searchStreamingService = ''">&times;</button>
            </span>
            <span class="badge rounded-pill bg-secondary" v-show="searchShowType != ''">Show Type: {{ searchShowType }}
                <button class="btn-close btn-close-white" aria-hidden="true" @click="searchShowType = ''">&times;</button>
            </span>
            <span class="badge rounded-pill bg-secondary" v-show="searchKeyWord != ''">Keyword: {{ searchKeyWord }}
                <button class="btn-close btn-close-white" aria-hidden="true" @click="searchKeyWord = ''">&times;</button>
            </span>
        </span>

        <!-- Modal -->
        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
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
                        <select class="form-select" aria-label="Default select example" v-model="searchGenre"
                            v-on:click="getGenreIds()">
                            <option :value="{ id: genre.id, name: genre.name }" v-for="genre in genres" :key="genre.id">{{
                                genre.name }}</option>
                        </select>
                        Streaming Service:
                        <select class="form-select" aria-label="Default select example" v-model="searchStreamingService"
                            v-on:click="getStreamingServiceNames()">
                            <option :value="streamer.id" v-for="streamer in streamers" :key="streamer.id">{{ streamer.id }}
                            </option>
                        </select>
                        Show Type:
                        <select class="form-select" aria-label="Default select example" v-model="searchShowType">
                            <option>series</option>
                            <option>movie</option>
                            <option>all</option>
                        </select>
                        Keyword:
                        <div class="keyword-search">
                            <input v-model="searchKeyWord">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal"
                            @click="advancedSearch(searchGenre.id, searchStreamingService, searchShowType, searchKeyWord)">Search</button>
                    </div>
                </div>
            </div>
        </div>

        <body>
            <ul>
                <li class="movie-card" v-for="movie in movies" :key="movie.tmdbId">
                    <div class="card mb-3 h-100" style="max-width: 540px;">
                        <div class="row g-0">
                            <div class="col-md-4">
                                <img :src="movie.image" class="img-fluid rounded" alt="...">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">{{ movie.title }}</h5>
                                    <p class="movie-overview">{{ movie.overview }}</p>
                                    <p class="card-text">
                                    <ul class="streaming">
                                        <li v-for="streamer in movie.streamers" :key="streamer">
                                            <img class="streamer-logo" :src="streamer.logo" />
                                        </li>
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
let searchShowType = ref('');
let searchKeyWord = ref('');
// let advanced = false;

function searchForMovie(searchTerm) {
    StreamingService.getMovieDetailsByName(searchTerm).then((response) => {
        let movieList = response.data.result;
        movies.value.length = 0;
        movieList.forEach(m => {
            if (Object.hasOwn(m.streamingInfo, 'us')) {
                for (var key in m.streamingInfo.us) {
                    for (var type in m.streamingInfo.us[key]) {
                        if (m.streamingInfo.us[key][type].type == "free" || m.streamingInfo.us[key][type].type == "subscription") {
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

function advancedSearch(searchGenre, searchStreamingService, searchShowType, searchKeyWord) {
    StreamingService.advancedSearch(searchGenre, searchStreamingService, searchShowType, searchKeyWord).then((response) => {
        let movieList = response.data.result;
        movies.value.length = 0;
        movieList.forEach(m => {
            if (Object.hasOwn(m.streamingInfo, 'us')) {
                for (var key in m.streamingInfo.us) {
                    for (var type in m.streamingInfo.us[key]) {
                        if (m.streamingInfo.us[key][type].type == "free" || m.streamingInfo.us[key][type].type == "subscription") {
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

const streamerLogos = {
    netflix: "https://www.edigitalagency.com.au/wp-content/uploads/netflix-logo-png-large.png",
    hbo: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Max_logo.svg",
    all4: "https://img.favpng.com/13/23/1/channel-4-all-4-logo-television-png-favpng-YrUfxYQY109ayyg7ercffmE9p.jpg",
    britbox: "https://download.logo.wine/logo/BritBox/BritBox-Logo.wine.png",
    crave: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/CraveTV_logo.svg/1280px-CraveTV_logo.svg.png",
    curiosity: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/CuriosityStreamBlack.svg/1200px-CuriosityStreamBlack.svg.png",
    disney: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/1041px-Disney%2B_logo.svg.png",
    hotstar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Disney%2B_Hotstar_logo.svg/2560px-Disney%2B_Hotstar_logo.svg.png",
    hulu: "https://download.logo.wine/logo/Hulu/Hulu-Logo.wine.png",
    iplayer: "https://upload.wikimedia.org/wikipedia/en/thumb/f/fd/BBC_iPlayer_logo_%282021%29.svg/2560px-BBC_iPlayer_logo_%282021%29.svg.png",
    mubi: "https://upload.wikimedia.org/wikipedia/commons/5/51/Mubi_logo.svg",
    now: "https://w7.pngwing.com/pngs/870/593/png-transparent-younow-streaming-media-live-streaming-broadcasting-livestream-now-television-text-logo.png",
    paramount: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Paramount%2B_logo.svg/2560px-Paramount%2B_logo.svg.png",
    peacock: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/NBCUniversal_Peacock_Logo.svg/2560px-NBCUniversal_Peacock_Logo.svg.png",
    prime: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Amazon_Prime_Video_logo.svg/2560px-Amazon_Prime_Video_logo.svg.png",
    showtime: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Showtime.svg/2560px-Showtime.svg.png",
    stan: "https://upload.wikimedia.org/wikipedia/commons/1/19/Stan_logo.png",
    starz: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Starz_2016.svg/2560px-Starz_2016.svg.png",
    wow: "https://www.tvhase.de/wp-content/uploads/2022/06/sky-WOW-logo.png",
    zee5: "https://1000logos.net/wp-content/uploads/2022/01/Zee5-Logo.png"
}

function getStreamerDetails(json) {
    let streamerDetails = [];
    if (Object.hasOwn(json, 'us')) {
        for (var key in json.us) {
            for (var type in json.us[key]) {
                if (json.us[key][type].type == "subscription") {
                    streamerDetails.push({
                        streamerName: key,
                        type: json.us[key][type].type,
                        logo: streamerLogos[key]
                    })
                }
            }
        }
    }
    return streamerDetails;
}


const genres = ref([]);

function getGenreIds() {
    if (genres.value.length == 0) {
        StreamingService.getGenreIds().then((response) => {
            let genreList = response.data.result;

            for (var key in genreList) {
                genres.value.push({
                    id: key,
                    name: genreList[key]
                })
            }
        })
    }
    return genres;
}

const streamers = ref([]);
function getStreamingServiceNames() {
    if (streamers.value.length == 0) {
        StreamingService.getStreamingServices().then((response) => {
            let streamerList = response.data.result;

            for (var key in streamerList) {
                streamers.value.push({
                    id: key,
                })
            }
        })
    }
}
</script>

<style>
body {
    display: flex;
    justify-content: center;
}

ul {
    display: flex;
    flex-wrap: wrap;
}

li {
    list-style-type: none;
}

.movie-card {
    padding: 5px;
    margin: 10px;
}

.streaming {
    display: flex;
    align-items: space-between;
}

.streaming li {
    margin: 2px;
}

form {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.advanced {
    margin: 5px;
}

.streamer-logo {
    max-width: 25%;
}

.chosen-options {
    margin: 5px;
}

.search-buttons {
    display: flex;
    justify-content: center;
    padding: 5px;
}
.search-container{
    justify-content: center;
}
header{
    display: grid;
    /* grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr; */
}
</style>