import {key} from "./config.js";
const apiKey = key;
const searchCity = document.querySelector("#searchCity");

fetch("api.openweathermap.org/data/2.5/weather?q=" + searchCity.innerHTML + "&appid=" + apiKey)
.then(response => response.json())
.then(data => console.log(data));