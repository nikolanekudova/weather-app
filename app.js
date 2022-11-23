const btnSubmit = document.getElementById("submit-city");
const cityInput = document.getElementById("input-city");
const btnLocation = document.getElementById("icon-location");

btnSubmit.addEventListener("click", main);
cityInput.addEventListener("keypress", function (event) {
    if (event.key == "Enter") {
        main();
    }
});
btnLocation.addEventListener("click", mainForGeolocation);

getBrnoData();

async function getWeatherAPI(url) {
    try {
        displayLoading();

        const response = await fetch(url, { mode: "cors" });

        hideLoading();

        if (!response.ok) return null;

        return response.json();
    } catch (error) {
        //server neexistuje nebo nefunguje
        const errorDiv = document.getElementById("error-div");

        errorDiv.style.display = "flex";
        errorDiv.style.visibility = "visible";
        alert(error);
    }
}

async function getPositionAPI(city) {
    const url =
        "https://api.openweathermap.org/geo/1.0/direct?q=" +
        city +
        "&limit=1&appid=3a34280f1b1a64c644af7807824fed30";

    try {
        displayLoading();

        await sleep(500);
        const response = await fetch(url, { mode: "cors" });

        hideLoading();

        if (!response.ok) return null;

        return response.json();
    } catch (error) {
        //server neexistuje nebo nefunguje
        const errorDiv = document.getElementById("error-div");
        errorDiv.style.display = "flex";
        errorDiv.style.visibility = "visible";

        alert(error);
    }
}

function positionOfCityIntoURL(positionData) {
    if (positionData.length == 0) {
        const errorDiv = document.getElementById("error-div");

        errorDiv.style.display = "flex";
        errorDiv.style.visibility = "visible";
    }

    const latitude = positionData[0].lat;
    const longitude = positionData[0].lon;
    const cityURL =
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
        latitude +
        "&lon=" +
        longitude +
        "&appid=3a34280f1b1a64c644af7807824fed30&units=metric";

    return cityURL;
}

function displayLoading() {
    const loader = document.getElementById("loader");

    loader.style.display = "block";
}

function hideLoading() {
    const loader = document.getElementById("loader");

    loader.style.display = "none";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const city = getCustomCity();

    if (city == "") {
        alert("Please enter city.");

        return;
    }

    const positionData = await getPositionAPI(city);
    const cityURL = positionOfCityIntoURL(positionData);
    const weatherData = await getWeatherAPI(cityURL);
    const errorDiv = document.getElementById("error-div");

    if (!weatherData) {
        const errorDiv = document.getElementById("error-div");

        errorDiv.style.display = "flex";
        errorDiv.style.visibility = "visible";

        return;
    }

    errorDiv.style.visibility = "hidden";
    showDataInPage(weatherData);
    deleteCityInput();
    deleteWeatherIcon();
    changeWeatherIcon(weatherData);
}

async function mainForGeolocation() {
    const geolocationURL = await getCurrentLocation();
    const weatherData = await getWeatherAPI(geolocationURL);

    if (!weatherData) {
        alert("No data found");
        return;
    }

    showDataInPage(weatherData);
    deleteWeatherIcon();
    changeWeatherIcon(weatherData);
}

function showDataInPage(weatherData) {
    const cityName = getCustomCity();
    const cityNameUpperCase = cityName.toUpperCase();
    const temperature = weatherData.main.temp;
    const temperatureRounded = Math.round(temperature * 10) / 10;
    const feelsLike = weatherData.main.feels_like;
    const feelsLikeRounded = Math.round(feelsLike * 10) / 10;

    const cityNameDiv = document.getElementById("city");
    const weatherDiv = document.getElementById("current-weather-text");
    const temperatureDiv = document.getElementById("temperature");
    const feelsLikeDiv = document.getElementById("feels-like");
    const humidityDiv = document.getElementById("humidity");
    const cloudCoverDiv = document.getElementById("cloud-cover");
    const windSpeedDiv = document.getElementById("wind-speed");

    if (cityName == "") {
        cityNameDiv.innerHTML = "YOUR LOCATION";
    } else {
        cityNameDiv.innerHTML = cityNameUpperCase;
    }

    weatherDiv.innerHTML = weatherData.weather[0].description.toUpperCase();
    temperatureDiv.innerHTML = temperatureRounded;
    feelsLikeDiv.innerHTML = `Feels like: ${feelsLikeRounded} °C`;
    humidityDiv.innerHTML = `Humidity: ${weatherData.main.humidity} %`;
    cloudCoverDiv.innerHTML = `Cloud cover: ${weatherData.clouds.all} %`;
    windSpeedDiv.innerHTML = "Wind speed: " + weatherData.wind.speed + " km/h";
}

function getCustomCity() {
    const cityInput = document.getElementById("input-city");
    const city = cityInput.value;

    return city;
}

function getCityURL(city) {
    const encodedCity = encodeURIComponent(city);
    const cityURL =
        "https://www.meteosource.com/api/v1/free/point?place_id=" +
        encodedCity +
        "&sections=current&timezone=auto&language=en&units=metric&key=ndbx63hxc973xalpfbp80rmx557w5igaui2uzc82";

    return cityURL;
}

async function getBrnoData() {
    const city = "brno";
    const positionData = await getPositionAPI(city);
    const cityURL = positionOfCityIntoURL(positionData);
    const weatherData = await getWeatherAPI(cityURL);
    const temperature = weatherData.main.temp;
    const temperatureRounded = Math.round(temperature * 10) / 10;
    const feelsLike = weatherData.main.feels_like;
    const feelsLikeRounded = Math.round(feelsLike * 10) / 10;

    //show in page
    const cityNameUpperCase = city.toUpperCase();
    const cityNameDiv = document.getElementById("city");
    const weatherDiv = document.getElementById("current-weather-text");
    const temperatureDiv = document.getElementById("temperature");
    const feelsLikeDiv = document.getElementById("feels-like");
    const humidityDiv = document.getElementById("humidity");
    const cloudCoverDiv = document.getElementById("cloud-cover");
    const windSpeedDiv = document.getElementById("wind-speed");

    cityNameDiv.innerHTML = cityNameUpperCase;
    weatherDiv.innerHTML = weatherData.weather[0].description.toUpperCase();
    temperatureDiv.innerHTML = temperatureRounded;
    feelsLikeDiv.innerHTML = `Feels like: ${feelsLikeRounded} °C`;
    humidityDiv.innerHTML = `Humidity: ${weatherData.main.humidity} %`;
    cloudCoverDiv.innerHTML = `Cloud cover: ${weatherData.clouds.all} %`;
    windSpeedDiv.innerHTML = "Wind speed: " + weatherData.wind.speed + " km/h";

    changeWeatherIcon(weatherData);
}

function deleteCityInput() {
    const cityInput = document.getElementById("input-city");

    cityInput.value = "";
}

function changeWeatherIcon(data) {
    const divForIcon = document.getElementById("icon-wrapper");
    const weatherData = data;
    const iconNumber = weatherData.weather[0].icon;
    const iconURL =
        "https://openweathermap.org/img/wn/" + iconNumber + "@2x.png";

    const icon = document.createElement("img");
    icon.src = iconURL;
    divForIcon.appendChild(icon);
}

function deleteWeatherIcon() {
    const divForIcon = document.getElementById("icon-wrapper");

    while (divForIcon.firstChild) {
        divForIcon.firstChild.remove();
    }
}

async function getCurrentLocation() {
    try {
        const currentPosition = await getPosition();
        const latitude = currentPosition.coords.latitude;
        const longitude = currentPosition.coords.longitude;
        const geolocationURL = getGeolocationURL(latitude, longitude);

        return geolocationURL;
    } catch (err) {
        alert(err);
        return null;
    }
}

function getGeolocationURL(latitude, longitude) {
    const geolocationURL =
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
        latitude +
        "&lon=" +
        longitude +
        "&appid=3a34280f1b1a64c644af7807824fed30&units=metric";

    return geolocationURL;
}

function getPosition(options) {
    return new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
    );
}
