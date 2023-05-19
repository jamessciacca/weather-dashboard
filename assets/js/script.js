// * * * Variables * * * //
var apiKey = "fd91f2afeb136edd367f1401e1aefc53";
var weatherIcon = document.querySelector("#weather-icon");
var searchForm = document.querySelector("#search-form");
var citySearch = document.querySelector("#city-search");
var currentHeading = document.querySelector("#current-heading");
var currentData = document.querySelector("#current-data");
var currentIcon = document.querySelector("#current-icon");
var clearButton = document.querySelector("#clear-btn");
var searchContainer = document.querySelector("#search-container");
var errorContainer = document.querySelector("#error-container");
var searchWeatherBtn = document.querySelector('#searchWeatherBtn');
var search = JSON.parse(localStorage.getItem('search') || "[]");
var cityList = JSON.parse(localStorage.getItem('lsCityList') || "[]");
cityList.forEach ((cityName) => {
    createCityButton(cityName);
})

//current weather function
function getCurrentWeather(eventObj, cityName) {
    if (eventObj) {
        eventObj.preventDefault();
    }

    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial&appid=' + apiKey)
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }
                response.json().then(function (data) {
                    console.log(data);
                    displayCurrentWeather(data);
                    saveSearch(data.name);
                });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}

searchForm.addEventListener('submit', (eventObj) => getCurrentWeather(eventObj, citySearch.value));



//display current weather function
function displayCurrentWeather(data) {
    var temp = document.querySelector("#temp");
    var wind = document.querySelector("#wind");
    var humid = document.querySelector("#humid");
    var cityName = document.querySelector('#city-name');

    var unixTimestamp = data.dt;
    var date = new Date(unixTimestamp * 1000);
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    var year = date.getFullYear();
    var month = months[date.getMonth()];
    var date = date.getDate();
    var formatTime = month + ' ' + date + ', ' + year;


    cityName.textContent = data.name + ' (' + formatTime + ')';
    temp.textContent = 'Temp: ' + data.main.temp + " 'F";
    wind.textContent = 'Wind: ' + data.wind.speed + ' mph';
    humid.textContent = 'Humidity: ' + data.main.humidity + '%';
    getForecast(data.name);
}



//get forecast function
function getForecast(cityName) {
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&units=imperial&appid=' + apiKey)
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }
                response.json().then(function (data) {
                    console.log(data);
                    displayForecast(data);
                });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}




//display forecast function
function displayForecast(data) {
    var forecastData = [data.list[5], data.list[13], data.list[22], data.list[30], data.list[38]]

    // currentHeading.innerHTML = citySearch.value + ' (' + data.list[0]['dt_txt'].split(' ')[0] + ')'
    document.getElementById('forcastContainer').innerHTML = ''

    for (var i = 0; i < forecastData.length; i++) {

        var section = document.createElement('section')
        var fiveDayDate = document.createElement('h5')
        var fiveDayImg = document.createElement('img')
        var fiveDayTemp = document.createElement('p')
        var fiveDayWind = document.createElement('p')
        var fiveDayHumid = document.createElement('p')

        section.setAttribute('class', 'text-center col-2 m-2 p-0 border border-primary')
        fiveDayDate.textContent = forecastData[i].dt_txt.split(' ')[0]
        fiveDayImg.setAttribute('src', 'http://openweathermap.org/img/w/' + forecastData[i].weather[0].icon + '.png')
        fiveDayTemp.textContent = 'Temp: ' + forecastData[i].main.temp + " 'F"
        fiveDayWind.textContent = 'Wind: ' + forecastData[i].wind.speed + ' mph'
        fiveDayHumid.textContent = 'Humidity: ' + forecastData[i].main.humidity + '%'

        section.append(fiveDayDate, fiveDayImg, fiveDayTemp, fiveDayWind, fiveDayHumid)
        document.getElementById('forcastContainer').append(section)
    }
}
//save history function
function saveSearch(cityName) {
    if (!cityList.includes(cityName)) {
        cityList.push(cityName);
        localStorage.setItem("lsCityList", JSON.stringify(cityList));
        createCityButton(cityName);
    }
}


function createCityButton (cityName) {
    var cityButton = document.createElement('button');
    cityButton.textContent = cityName;
    cityButton.onclick = () => {
        getCurrentWeather(undefined, cityName);
    }

    searchContainer.append(cityButton);
}