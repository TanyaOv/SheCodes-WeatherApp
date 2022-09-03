const apiKey = "d743afc6b8e9d42ff2b1cf896acc3bf6";
const weather = {
  tempFormat: "C",
  current: {},
  daily: [],
};

function fmtDayTime(date = new Date()) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
}

function fmtShortDay(date = new Date()) {
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

function convertToF(celsius) {
  return Math.round((celsius * 9) / 5 + 32);
}

function prepareCurrentWeather(data) {
  return {
    cityName: data.name,
    coord: data.coord,
    humidity: data.main.humidity,
    icon: data.weather[0].icon,
    temp: { C: Math.round(data.main.temp), F: convertToF(data.main.temp) },
    windSpeed: Math.round(data.wind.speed),
    dayTime: fmtDayTime(new Date(data.dt * 1000)),
  };
}

function prepareDailyForecast(dailyForecast) {
  return dailyForecast.slice(0, 6).map((day) => ({
    day: fmtShortDay(new Date(day.dt * 1000)),
    icon: day.weather[0].icon,
    maxTemp: { C: Math.round(day.temp.max), F: convertToF(day.temp.max) },
    minTemp: { C: Math.round(day.temp.min), F: convertToF(day.temp.min) },
  }));
}

function displayForcast() {
  const cityNameEl = document.querySelector("#cityName");
  const forecastEl = document.querySelector("#forecast");
  const humidityEl = document.querySelector("#humidity");
  const iconEl = document.querySelector("#icon");
  const tempEl = document.querySelector("#temp");
  const windEl = document.querySelector("#wind");
  const dateEl = document.querySelector("#date-time");

  const tempFormat = weather.tempFormat;
  const iconUrl = `http://openweathermap.org/img/wn/${weather.current.icon}@2x.png`;

  dateEl.innerHTML = weather.current.dayTime;
  humidityEl.innerText = weather.current.humidity;
  windEl.innerText = weather.current.windSpeed;
  cityNameEl.innerText = weather.current.cityName;
  tempEl.innerText = weather.current.temp[tempFormat];
  iconEl.setAttribute("src", iconUrl);

  const dailyHTML = weather.daily
    .map((day) => {
      return `
        <div class="col-2">
          <div class="weather-forecast-date">${day.day}</div>
          <img src="http://openweathermap.org/img/wn/${day.icon}@2x.png" alt="" width="42"/>
          <div class="weather-forecast-temperatures">
            <span class="weather-forecast-temperature-max"> ${day.maxTemp[tempFormat]}° </span>
            <span class="weather-forecast-temperature-min"> ${day.minTemp[tempFormat]}° </span>
          </div>
        </div>`;
    })
    .join("");

  forecastEl.innerHTML = `<div class="row">${dailyHTML}</div>`;
}

function search(q = "", lat = 0, lon = 0) {
  getCurrentWeather(q, lat, lon)
    .then((currentWeather) => {
      weather.current = currentWeather;

      return getForecast(weather.current.coord.lat, weather.current.coord.lon);
    })
    .then((dailyForecast) => {
      weather.daily = dailyForecast;
    })
    .then(() => {
      displayForcast();
    });
}

function getForecast(lat, lon) {
  return axios
    .get(`https://api.openweathermap.org/data/2.5/onecall`, {
      params: {
        units: "metric",
        appid: apiKey,
        lon,
        lat,
        exclude: "current,minutely,hourly,alerts",
      },
    })
    .then(({ data }) => data.daily)
    .then(prepareDailyForecast);
}

function getCurrentWeather(q = "", lat = 0, lon = 0) {
  return axios
    .get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: { units: "metric", appid: apiKey, q, lon, lat },
    })
    .then(({ data }) => data)
    .then(prepareCurrentWeather);
}

function handleSubmit(event) {
  event.preventDefault();

  const cityName = document.querySelector("#city-name").value;

  search(cityName);
}

function handleGeolocation(event) {
  event.preventDefault();

  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;

    document.querySelector("#city-name").value = "";

    search("", latitude, longitude);
  });
}

document.querySelector("#search-form").addEventListener("submit", handleSubmit);
document.querySelector("#button-geo").addEventListener("click", handleGeolocation);

document.querySelector("#celcius-link").addEventListener("click", (event) => {
  event.preventDefault();

  weather.tempFormat = "C";

  displayForcast();
});

document.querySelector("#fahrenheit-link").addEventListener("click", (event) => {
  event.preventDefault();

  weather.tempFormat = "F";

  displayForcast();
});

search("Cherkasy");
