<template>
    <div>
    <header id="header-box">
        <h1 class="display-1" @click="reloadPage()">StreamIt</h1>

        <div class="search-container">
          <form @submit.prevent="searchForMovie(searchTerm)">
            <input v-model="searchTerm">
          </form>
            <div class="search-buttons">
                <button class="btn btn-primary me-1 basic-button"
                    @click.prevent="searchForMovie(searchTerm)">Search</button>
                <button type="button" class="btn btn-primary advanced" data-bs-toggle="modal"
                    data-bs-target="#exampleModalCenter">
                    Advanced
                </button>
            </div>
        </div>

        <span class="chosen-options">
            <span class="badge rounded-pill" v-show="searchGenre != ''">Genre: {{ searchGenre.name }}
                <button class="btn-close btn-close-white" aria-hidden="true" @click="searchGenre = ''">&times;</button>
            </span>
            <span class="badge rounded-pill" v-show="searchStreamingService != ''">Streaming Service: {{
                searchStreamingService }}
                <button class="btn-close btn-close-white" aria-hidden="true"
                    @click="searchStreamingService = ''">&times;</button>
            </span>
            <span class="badge rounded-pill" v-show="searchShowType != ''">Show Type: {{ searchShowType }}
                <button class="btn-close btn-close-white" aria-hidden="true" @click="searchShowType = ''">&times;</button>
            </span>
            <span class="badge rounded-pill" v-show="searchKeyWord != ''">Keyword: {{ searchKeyWord }}
                <button class="btn-close btn-close-white" aria-hidden="true" @click="searchKeyWord = ''">&times;</button>
            </span>
        </span>
    </header>

    <body>
        <ul class="card-list">
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
                            </div>
                            <p class="card-text streaming-logos">
                            <ul class="streaming">
                                <li v-for="streamer in movie.streamers" :key="streamer">
                                    <img class="streamer-logo" :src="streamer.logo" />
                                </li>
                            </ul>
                            </p>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </body>
    <!-- Modal -->
    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">Advanced Search</h5>
                    <button class="close btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Genre:
                    <select class="form-select" v-model="searchGenre"
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
</div>
</template>

<script setup>
import { ref } from "vue";
import StreamingService from "../services/StreamingService.js";

const movies = ref([]);
let searchTerm = ref("");
let searchGenre = ref("");
let searchStreamingService = ref("");
let searchShowType = ref("");
let searchKeyWord = ref("");

function searchForMovie(searchTerm) {
  StreamingService.getMovieDetailsByName(searchTerm).then((response) => {
    let movieList = response.data.result;
    movies.value.length = 0;
    movieList.forEach((m) => {
      if (Object.hasOwn(m.streamingInfo, "us")) {
        for (var key in m.streamingInfo.us) {
          for (var type in m.streamingInfo.us[key]) {
            if (
              m.streamingInfo.us[key][type].type == "free" ||
              m.streamingInfo.us[key][type].type == "subscription"
            ) {
              movies.value.push({
                title: m.title,
                tmdbId: m.tmdbId,
                streamers: getStreamerDetails(m.streamingInfo),
                image: m.posterURLs.original,
                overview: m.overview,
              });
            }
          }
        }
      }
    });
  });
  return movies;
}

function advancedSearch(
  searchGenre,
  searchStreamingService,
  searchShowType,
  searchKeyWord
) {
  StreamingService.advancedSearch(
    searchGenre,
    searchStreamingService,
    searchShowType,
    searchKeyWord
  ).then((response) => {
    let movieList = response.data.result;
    movies.value.length = 0;
    movieList.forEach((m) => {
      if (Object.hasOwn(m.streamingInfo, "us")) {
        for (var key in m.streamingInfo.us) {
          for (var type in m.streamingInfo.us[key]) {
            if (m.streamingInfo.us[key][type].type == "subscription") {
              const found = movies.value.some((x) => x.title === m.title);
              if (!found) {
                movies.value.push({
                  title: m.title,
                  tmdbId: m.tmdbId,
                  streamers: getStreamerDetails(m.streamingInfo),
                  image: m.posterURLs.original,
                  overview: m.overview,
                });
              }
            }
          }
        }
      }
    });
  });
  return movies;
}

const streamerLogos = {
  netflix:
    "https://www.edigitalagency.com.au/wp-content/uploads/netflix-logo-png-large.png",
  hbo: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Max_logo.svg",
  all4: "https://img.favpng.com/13/23/1/channel-4-all-4-logo-television-png-favpng-YrUfxYQY109ayyg7ercffmE9p.jpg",
  britbox: "https://download.logo.wine/logo/BritBox/BritBox-Logo.wine.png",
  crave:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/CraveTV_logo.svg/1280px-CraveTV_logo.svg.png",
  curiosity:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/CuriosityStreamBlack.svg/1200px-CuriosityStreamBlack.svg.png",
  disney:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/1041px-Disney%2B_logo.svg.png",
  hotstar:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Disney%2B_Hotstar_logo.svg/2560px-Disney%2B_Hotstar_logo.svg.png",
  hulu: "https://download.logo.wine/logo/Hulu/Hulu-Logo.wine.png",
  iplayer:
    "https://upload.wikimedia.org/wikipedia/en/thumb/f/fd/BBC_iPlayer_logo_%282021%29.svg/2560px-BBC_iPlayer_logo_%282021%29.svg.png",
  mubi: "https://upload.wikimedia.org/wikipedia/commons/5/51/Mubi_logo.svg",
  now: "https://w7.pngwing.com/pngs/870/593/png-transparent-younow-streaming-media-live-streaming-broadcasting-livestream-now-television-text-logo.png",
  paramount:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Paramount%2B_logo.svg/2560px-Paramount%2B_logo.svg.png",
  peacock:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/NBCUniversal_Peacock_Logo.svg/2560px-NBCUniversal_Peacock_Logo.svg.png",
  prime:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Amazon_Prime_Video_logo.svg/2560px-Amazon_Prime_Video_logo.svg.png",
  showtime:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Showtime.svg/2560px-Showtime.svg.png",
  stan: "https://upload.wikimedia.org/wikipedia/commons/1/19/Stan_logo.png",
  starz:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Starz_2016.svg/2560px-Starz_2016.svg.png",
  wow: "https://www.tvhase.de/wp-content/uploads/2022/06/sky-WOW-logo.png",
  zee5: "https://1000logos.net/wp-content/uploads/2022/01/Zee5-Logo.png",
};

function getStreamerDetails(json) {
  let streamerDetails = [];
  if (Object.hasOwn(json, "us")) {
    for (var key in json.us) {
      for (var type in json.us[key]) {
        if (json.us[key][type].type == "subscription") {
          const found = streamerDetails.some((x) => x.streamerName === key);
          if (!found) {
            streamerDetails.push({
              streamerName: key,
              type: json.us[key][type].type,
              logo: streamerLogos[key],
            });
          }
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
          name: genreList[key],
        });
      }
      genres.value.sort((a, b) => (a.name > b.name ? 1 : -1));
    });
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
        });
      }
    });
  }
}

function reloadPage() {
  window.location.reload();
}
</script>

<style>
body {
  display: flex;
  justify-content: center;
  background-color: #e5e7d9 !important;
}

.card-list {
  display: flex;
  flex-wrap: wrap;
  padding-left: 0px;
  justify-content: center;
}

li {
  list-style-type: none;
}

.movie-card {
  padding: 5px;
  margin: 10px;
}

.card {
  background-color: #f8f7f7 !important;
  font-family: "Quicksand", sans-serif !important;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}

.streaming {
  align-items: space-around;
  justify-self: flex-end;
}

.streaming li {
  margin: 2px;
  padding-bottom: 3px;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.advanced .basic-button {
  margin: 5px;
}

.streamer-logo {
  max-width: 28%;
}

.chosen-options span {
  margin: 3px;
}

.search-buttons {
  display: flex;
  justify-content: center;
  padding: 5px;
}

.search-container {
  justify-content: center;
}

header {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  background-color: #20152e;
  box-shadow: 0 4px 2px -2px gray;
  padding-bottom: 5px;
  align-self: flex-start;
}

header h1 {
  color: #e5e7d9 !important;
  font-family: "Bebas Neue", sans-serif;
  margin-bottom: -5px;
  cursor: pointer;
}

.btn {
  background-color: #b38cb6 !important;
  border-color: #b38cb6 !important;
  font-family: "Quicksand", sans-serif !important;
}

.rounded-pill {
  background-color: #63545b !important;
  font-family: "Quicksand", sans-serif !important;
}

.modal {
  font-family: "Quicksand", sans-serif !important;
}

.modal-footer,
.modal-header {
  background-color: #20152e !important;
  color: #e5e7d9 !important;
}

.modal-body {
  background-color: #e5e7d9 !important;
}

.col-md-8 {
  display: flex;
  flex-direction: column;
  height: 100% !important;
}

.streaming-logos {
  align-self: flex-end !important;
  margin-bottom: 5px;
}

.row {
  height: 100% !important;
}
</style>