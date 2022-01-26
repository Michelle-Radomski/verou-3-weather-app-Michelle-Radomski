import {key} from "./config.js";

const searchCity = document.querySelector("#searchCity");
const search = document.querySelector("button");
const pInstruction = document.querySelector("#instruction")
const cityNameDisplay = document.querySelector("#cityName");
const forecastContainer = document.querySelector(".forecast-container");

search.addEventListener("click", getWeather);   //when user starts search we fetch necessary info

function getWeather(event) {
    event.preventDefault();
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + searchCity.value + "&units=metric&appid=" + key)
    .then(response => response.json())
    .then(weatherData =>  {
        forecastContainer.innerHTML = "";
        const lat = weatherData.city.coord.lat; //get latitude of user input
        const long = weatherData.city.coord.lon; //get longitude of user input
        let cityName = weatherData.city.name;
        cityNameDisplay.innerHTML = cityName;
        fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=minutely&units=metric&appid=" + key)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            pInstruction.style.display = 'none';        //hide the instruction for user in forecast

            const fiveDays = data.daily.length = 5;             //the length of daily is 5 days instead of 8
            for(let i = 0; i < fiveDays; i++) {
                const forecastCard = document.createElement('article');
                forecastCard.className = "forecast-article";
                forecastContainer.appendChild(forecastCard);

                //convert date and hours into a day of the week          
                const dateStr = data.daily[i].dt; //gives us daily date

                function getDayName(dateStr, locale) {                  //will convert date into a day name
                    const date = new Date(dateStr * 1000);
                    return date.toLocaleDateString(locale, { weekday: 'long' });        
                }
                const forecastDay = document.createElement("h3");
                forecastDay.innerHTML = getDayName(dateStr, "en-US");               //gives us day of the week
                forecastCard.appendChild(forecastDay);

                const weatherIconURL = document.createElement("img");
                weatherIconURL.className = "weather-icon"
                const weatherIcon= data.daily[i].weather[0].icon;            //gets icon that goes with description
                weatherIconURL.src =  "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png"; //gets image of icon
                forecastCard.appendChild(weatherIconURL);

                const mainInfoContainer = document.createElement("div");
                mainInfoContainer.className = "main-info"
                forecastCard.appendChild(mainInfoContainer);

                    const temperature = document.createElement("span");
                    temperature.className = "temperature";
                    temperature.innerHTML = Math.round(data.daily[i].temp.day) + "&deg;";   //round the number to nearest integer
                    mainInfoContainer.appendChild(temperature);

                    const description = document.createElement("span");
                    description.className = "description";
                    description.innerHTML = data.daily[i].weather[0].description;
                    mainInfoContainer.appendChild(description);
                
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
                        pop.innerHTML = Math.round(data.daily[i].pop*100) + "\u0025";
                    popContainer.appendChild(pop);
                iconContainer.appendChild(popContainer);

                    const humidityContainer = document.createElement("span");
                    humidityContainer.className = "humidity";
                        const humidityImg = document.createElement("img");
                        humidityImg.src = "./img/humidity.png";
                        humidityImg.className = "icon";
                        humidityContainer.appendChild(humidityImg);
                        const humidity = document.createElement("span");
                        humidity.innerHTML = data.daily[0].humidity + "\u0025";
                    humidityContainer.appendChild(humidity);
                iconContainer.appendChild(humidityContainer);

                    const windContainer = document.createElement("span");
                    windContainer.className = "wind";
                        const windImg = document.createElement("img");
                        windImg.src = "./img/wind.png";
                        windImg.className = "icon";
                    windContainer.appendChild(windImg);
                        const wind = document.createElement("span");
                        wind.innerHTML = Math.round(data.daily[i].wind_speed) + "km/h";
                    windContainer.appendChild(wind);
                iconContainer.appendChild(windContainer);
            }
        })
    })
};