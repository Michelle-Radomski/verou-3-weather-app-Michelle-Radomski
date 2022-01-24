import {key} from "./config.js";
const apiKey = key;
const searchCity = document.querySelector("#searchCity");
const search = document.querySelector("button");


function getWeather(event) {
    event.preventDefault();
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + searchCity.value + "&appid=" + apiKey)
    .then(response => response.json())
    .then(data => console.log(data));
}

search.addEventListener("click", getWeather);