import {key} from "./config.js";

const searchCity = document.querySelector("#searchCity");
const search = document.querySelector("button");
const pInstruction = document.querySelector(".instruction");
const cityNameDisplay = document.querySelector("#cityName");
const forecastContainer = document.querySelector(".forecast-container");
const chartSection = document.querySelector("#chart-section");

chartSection.style.display = "none";

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
        pInstruction.style.display = 'none';  //hide the instruction for user in forecast
        chartSection.style.display = "block";
        fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=minutely&units=metric&appid=" + key)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            for(let i = 0; i < 5; i++) {        //the length of daily is 5 days instead of 8
                const forecastCard = document.createElement('article');
                forecastCard.className = "forecast-article";
                forecastContainer.appendChild(forecastCard);

                //convert date and hours into a day of the week          
                const unixTime = data.daily[i].dt; //gives us daily date
                getDayName();               //call function
                const forecastDay = document.createElement("h3");
                forecastDay.innerHTML = getDayName(unixTime);               //gives us day of the week
                forecastCard.appendChild(forecastDay);

                const weatherIconURL = document.createElement("img");
                weatherIconURL.className = "weather-icon"
                const weatherIcon= data.daily[i].weather[0].icon;            //gets icon that goes with description
                weatherIconURL.src =  "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png"; //gets image of icon
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
        
            const ctx = document.getElementById('myChart').getContext('2d');
            const xHours = [];
            const temperature = [];
            for (let j = 0; j < 24; j++) {
                const unixTime = data.hourly[j].dt*1000;            //get unixtime in miliseconds
                const date = new Date(unixTime).toLocaleString("en-US", {hour: "numeric"}); //converts miliseconds to hours
                xHours.push(date);
                const temp = Math.round(data.hourly[j].temp);
                temperature.push(temp);
            }
            const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: xHours,
                    datasets: [{
                        label: 'Temperature in' + " " + "\u00B0C",
                        data: temperature,
                        backgroundColor: [
                            'rgba(247, 136, 18, 1)'
                        ],
                        borderColor: [
                            'rgb(247, 136, 18, 1)'
                        ],
                        borderWidth: 3
                    }]
                },
                options: {
                    scales: {
                        y: {
                            suggestedMax: 20,
                            suggestedMin: 0,
                            ticks: {
                                padding: 10,
                                callback: function(value, index, ticks) {
                                    return value + '\u00B0C';       //the values will have degrees C behind it
                                }
                            }
                        },
                        x: {
                            ticks: {
                                padding: 10
                            },
                            grid: {
                                display: false,
                                tickBorderDash: 10
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: "24h Temperature Overview"
                        }
                    }
                }
            }); 
        })
    })
};

function getDayName(unixTime) {                  //will convert date into a day name
    const date = new Date(unixTime * 1000).toLocaleString("en-US", { weekday: 'long' } );
    return date;       
}