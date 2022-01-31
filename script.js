import {key} from "./config.js";

const searchCity = document.querySelector("#searchCity");
const search = document.querySelector("button");
const pInstruction = document.querySelector(".instruction");
const cityNameDisplay = document.querySelector("#cityName");
const forecastContainer = document.querySelector(".forecast-container");
const chartSection = document.querySelector("#chart-section");

chartSection.style.display = "none";        //chart section is initially not visible

const resetForecastSection = () => {
    forecastContainer.innerHTML = "";
};

const displayCityName = (weatherData) => {
    let cityName = weatherData.city.name;
    cityNameDisplay.innerHTML = cityName;
};

const getWeather = (event) => {
    event.preventDefault();

    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + searchCity.value + "&units=metric&appid=" + key)
    .then(response => response.json())
    .then(weatherData =>  {
        resetForecastSection();
        const lat = weatherData.city.coord.lat; //get latitude of user input
        const long = weatherData.city.coord.lon; //get longitude of user input
        displayCityName(weatherData);
        pInstruction.style.display = 'none';  //hide the instruction for user in forecast
        chartSection.style.display = "block";

        const xHours = [];            //labels for chart
        const temperature = [];         //data for chart

        fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=minutely&units=metric&appid=" + key)
        .then(response => response.json())
        .then(data => {

            for(let i = 0; i < 5; i++) {        //the length of daily is 5 days instead of 8
                addCard(data, i);
            }
        
            updateChartArray(data, xHours, temperature);
            updateChartByMutating(myChart, xHours, temperature);
        })
    })
};
search.addEventListener("click", getWeather);   //when user starts search we fetch necessary info


const addCard = (data, i) => {
    const dailyData = data.daily[i];
    const forecastCard = document.createElement('article');
    forecastCard.className = "forecast-article";
    forecastContainer.appendChild(forecastCard);

    getDayName(dailyData);
    const forecastDay = document.createElement("h3");
    forecastDay.innerHTML = getDayName(dailyData);               //gives us day of the week
    forecastCard.appendChild(forecastDay);

    const weatherIconURL = document.createElement("img");
    weatherIconURL.className = "weather-icon"
    const weatherIcon= dailyData.weather[0].icon;            //gets icon that goes with description
    weatherIconURL.src =  "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png"; //gets image of icon
    forecastCard.appendChild(weatherIconURL);

    const mainInfoContainer = document.createElement("div");
    mainInfoContainer.className = "main-info"
    forecastCard.appendChild(mainInfoContainer);

        const temperature = document.createElement("span");
        temperature.className = "temperature";
        temperature.innerHTML = Math.round(dailyData.temp.day) + "&deg;";   //round the number to nearest integer
        mainInfoContainer.appendChild(temperature);

        const description = document.createElement("span");
        description.className = "description";
        description.innerHTML = dailyData.weather[0].description;
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
            pop.innerHTML = Math.round(dailyData.pop*100) + "\u0025";
        popContainer.appendChild(pop);
    iconContainer.appendChild(popContainer);

        const humidityContainer = document.createElement("span");
        humidityContainer.className = "humidity";
            const humidityImg = document.createElement("img");
            humidityImg.src = "./img/humidity.png";
            humidityImg.className = "icon";
            humidityContainer.appendChild(humidityImg);
            const humidity = document.createElement("span");
            humidity.innerHTML = dailyData.humidity + "\u0025";
        humidityContainer.appendChild(humidity);
    iconContainer.appendChild(humidityContainer);

        const windContainer = document.createElement("span");
        windContainer.className = "wind";
            const windImg = document.createElement("img");
            windImg.src = "./img/wind.png";
            windImg.className = "icon";
        windContainer.appendChild(windImg);
            const wind = document.createElement("span");
            wind.innerHTML = Math.round(dailyData.wind_speed) + "km/h";
        windContainer.appendChild(wind);
    iconContainer.appendChild(windContainer);
}

const getDayName = (dailyData) => { 
    const unixTime = dailyData.dt;                 //will convert date into a day name
    const date = new Date(unixTime * 1000).toLocaleString("en-US", { weekday: 'long' } );
    return date;       
}

const updateChartArray = (data, xHours, temperature) => {
    for (let j = 0; j < 24; j++) {
        const hourlyData = data.hourly[j];
        const unixTime = hourlyData.dt*1000;            //get unixtime in miliseconds
        const date = new Date(unixTime).toLocaleString("en-US", {hour: "numeric"}); //converts miliseconds to hours
        xHours.push(date);
        const temp = Math.round(hourlyData.temp);
        temperature.push(temp);
    }
};

const updateChartByMutating = (chart, xHours, temperature) => {
    chart.data.labels = xHours;
    chart.data.datasets.forEach((dataset) => {      //cause datasets is an array
        dataset.data = temperature;
    });
    chart.update();
}

const ctx = document.getElementById('myChart').getContext('2d');

Chart.defaults.font.family = "'Nunito', sans-serif";
Chart.defaults.color = "#035f86";
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: "",
        datasets: [{
            label: 'Temperature in' + " " + "\u00B0C",
            data: "",
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
        maintainAspectRatio: false,
        scales: {
            y: {
                suggestedMax: 20,
                suggestedMin: 0,
                ticks: {
                    padding: 10,
                    callback: function(value, index, ticks) {
                        return value + '\u00B0C';       //the values will have degrees C behind it
                    },
                    font: {
                        weight: "bold"
                    }
                }
            },
            x: {
                ticks: {
                    padding: 10,
                    font: {
                        weight: "bold"
                    }
                },
                grid: {
                    display: false,
                    tickBorderDash: 10
                }
            }
        },
        elements: {
            line: {
                tension: 0.3,
                borderJoinStyle: "round"
            }
        },
        plugins: {
            title: {
                display: true,
                text: "24h Temperature Overview",
                padding: 20,
                font: {
                    size: 20
                }
            },
            tooltip: {
                intersect: false
            },
            legend: {
                display: false
            }
        }
    }
});
