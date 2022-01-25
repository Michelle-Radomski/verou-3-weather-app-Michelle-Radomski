import {key} from "./config.js";

const searchCity = document.querySelector("#searchCity");
const search = document.querySelector("button");
const pInstruction = document.querySelector("#instruction")
const cityNameDisplay = document.querySelector("#cityName");
const forecastContainer = document.querySelector(".forecast-container");

search.addEventListener("click", getWeather);

function getWeather(event) {
    event.preventDefault();
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + searchCity.value + "&units=metric&appid=" + key)
    .then(response => response.json())
    .then(data =>  {
        console.log(data);
        pInstruction.style.display = 'none';        //hide the instruction for user in forecast
        let cityName = data.city.name;
        cityNameDisplay.innerHTML = cityName;

        const forecastCard = document.createElement('article');
        forecastCard.className = "forecast-article";
        forecastContainer.appendChild(forecastCard);

        //convert date and hours into a day of the week
        const dateTxt = data.list[0].dt_txt;                    //gives us date of today
        const dateStr = dateTxt;

        function getDayName(dateStr, locale) {                  //will convert date into a day name
            const date = new Date(dateStr);
            return date.toLocaleDateString(locale, { weekday: 'long' });        
        }
        const forecastDay = document.createElement("h3");
        forecastDay.innerHTML = getDayName(dateStr, "en-US");               //gives us day of the week
        forecastCard.appendChild(forecastDay);

        const weatherIconURL = document.createElement("img");
        const weatherIcon= data.list[0].weather[0].icon;                        //gets icon that goes with description
        weatherIconURL.src =  "http://openweathermap.org/img/wn/" + weatherIcon + ".png"; //gets image of icon
        forecastCard.appendChild(weatherIconURL);

        const temperature = document.createElement("span");
        temperature.innerHTML = Math.round(data.list[0].main.temp) + "&deg;";   //round the number to nearest integer
        forecastCard.appendChild(temperature);


        const iconContainer = document.createElement("div");
        iconContainer.className = "icon-container";
        forecastCard.appendChild(iconContainer);

        const popContainer = document.createElement("span"); //pop = chance of rain or probability of precipitation
        popContainer.className = "pop";
        const popImg = document.createElement("img");
        popImg.src = "./img/rain.png";
        popImg.className = "icon";
        popContainer.appendChild(popImg);
        const pop = document.createElement("span");
        pop.innerHTML = Math.round(data.list[0].pop) + "\u0025";
        popContainer.appendChild(pop);
        iconContainer.appendChild(popContainer);
        
        const humidityContainer = document.createElement("span");
        humidityContainer.className = "humidity";
        const humidityImg = document.createElement("img");
        humidityImg.src = "./img/humidity.png";
        humidityImg.className = "icon";
        humidityContainer.appendChild(humidityImg);
        const humidity = document.createElement("span");
        humidity.innerHTML = data.list[0].main.humidity + "\u0025";
        humidityContainer.appendChild(humidity);
        iconContainer.appendChild(humidityContainer);

        const windContainer = document.createElement("span");
        windContainer.className = "wind";
        const windImg = document.createElement("img");
        windImg.src = "./img/wind.png";
        windImg.className = "icon";
        windContainer.appendChild(windImg);
        const wind = document.createElement("span");
        wind.innerHTML = Math.round(data.list[0].wind.speed) + "km/h";
        windContainer.appendChild(wind);
        iconContainer.appendChild(windContainer);
   });
}
