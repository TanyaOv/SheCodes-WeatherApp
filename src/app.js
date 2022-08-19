const apiKey = "d743afc6b8e9d42ff2b1cf896acc3bf6";

const now = new Date();
const h4 = document.querySelector("h4");
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
const hours = now.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
const minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
h4.innerHTML = `${day}, ${hours}:${minutes}`;

const btnSearch = document.querySelector("#button-search");
const btnCurrent = document.querySelector("#button-current");
const linkUnitC = document.querySelector("#celcius-link");
const linkUnitF = document.querySelector("#fahrenheit-link");

const currentWeather = { tempC: 0, tempF: 0, cityName: "" };

function showTemperature(response) {
  const tempEl = document.querySelector("#temp");
  const cityNameH3 = document.querySelector("h3");

  const temp = Math.round(response.data.main.temp);
  const cityName = response.data.name;

  document.querySelector("#humidity").innerText = response.data.main.humidity;
  document.querySelector("#wind").innerText = Math.round(
    response.data.wind.speed
  );

  currentWeather.tempC = temp;
  currentWeather.tempF = (temp * 9) / 5 + 32;
  currentWeather.cityName = cityName;

  cityNameH3.innerText = cityName;
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
