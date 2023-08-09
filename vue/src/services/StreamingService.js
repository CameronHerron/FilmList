import axios from "axios";
import STORED_API_KEY from "/API_KEYS.txt";

const API_KEY = STORED_API_KEY;

let baseUrl = "https://streaming-availability.p.rapidapi.com/v2/";
export default{

    getMovieDetailsByName(searchTerm){
        const options = {
            method: 'GET',
            url: baseUrl + 'search/title',
            params: {
              title: searchTerm,
              country: 'us',
              show_type: 'movie',
              output_language: 'en'
            },
            headers: {
              'X-RapidAPI-Key': API_KEY,
              'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
            }
        };
        
        return axios.request(options); 
    },

  getGenreIds(){
    const options = {
      method: 'GET',
      url: baseUrl + 'genres',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
      }
    };

    return axios.request(options);
  },

  getStreamingServices(){
    const options = {
      method: 'GET',
      url: baseUrl + 'services',
      headers:{
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
      }
    };

    return axios.request(options);
  },

  advancedSearch(genre = null, streamer = null, showType = 'all', keyword = null){
    const options = {
      method: 'GET',
      url: baseUrl + 'search/basic',
      params:{
        country: 'us'
      },
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
      }
    };

    if(genre != null && genre != ''){
      options.params.genre = genre;
    }
    if(showType != null && showType != ''){
      options.params.show_type = showType;
    }
    if(keyword != null && keyword != ''){
      options.params.keyword = keyword;
    }

    if(streamer != null && streamer != ''){
      options.params.services = streamer;
    }else{
      options.params.services = 'netflix, prime, hulu';
    }

    return axios.request(options);
  }
}

