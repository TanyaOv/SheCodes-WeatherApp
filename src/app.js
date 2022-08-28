const apiKey = "d743afc6b8e9d42ff2b1cf896acc3bf6";

const now = new Date();
const dateTime = document.querySelector("#date-time");
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const day = days[now.getDay()];
let hours = now.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
dateTime.innerHTML = `${day}, ${hours}:${minutes}`;

const btnSearch = document.querySelector("#button-search");
const btnCurrent = document.querySelector("#button-current");
const linkUnitC = document.querySelector("#celcius-link");
const linkUnitF = document.querySelector("#fahrenheit-link");

const currentWeather = { tempC: 0, tempF: 0, cityName: "" };

function showTemperature(response) {
  const tempEl = document.querySelector("#temp");
  const cityNameH2 = document.querySelector("#cityName");
  const iconElement = document.querySelector("#icon");

  const temp = Math.round(response.data.main.temp);
  const cityName = response.data.name;

  document.querySelector("#humidity").innerText = response.data.main.humidity;
  document.querySelector("#wind").innerText = Math.round(
    response.data.wind.speed
  );
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  currentWeather.tempC = temp;
  currentWeather.tempF = Math.round((temp * 9) / 5 + 32);
  currentWeather.cityName = cityName;

  cityNameH2.innerText = cityName;
  tempEl.innerText = temp;
}

btnSearch.addEventListener("click", (event) => {
  event.preventDefault();
  const cityNameEl = document.querySelector("#city-name");
  const cityName = cityNameEl.value;

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric`;

  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemperature);
});

btnCurrent.addEventListener("click", (event) => {
  event.preventDefault();

  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric`;

    axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemperature);
  });
});

linkUnitC.addEventListener("click", (event) => {
  event.preventDefault();
  document.querySelector("#temp").innerText = currentWeather.tempC;
});

linkUnitF.addEventListener("click", (event) => {
  event.preventDefault();
  document.querySelector("#temp").innerText = currentWeather.tempF;
});
