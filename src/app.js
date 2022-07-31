let weather = {
  paris: {
    temp: 19.7,
    humidity: 80,
  },
  tokyo: {
    temp: 17.3,
    humidity: 50,
  },
  lisbon: {
    temp: 30.2,
    humidity: 20,
  },
  "san francisco": {
    temp: 20.9,
    humidity: 100,
  },
  oslo: {
    temp: -5,
    humidity: 20,
  },
};

// write your code here
let cityName = prompt("Enter a City");
cityName = cityName.toLowerCase();
const city = weather[cityName];
if (city !== undefined) {
  const temp = Math.round(city.temp);
  const ftemp = Math.round((temp * 9) / 5 + 32);
  alert(
    `It is currently ${temp}°C / ${ftemp}°F in ${cityName} with a humidity of ${city.humidity}%`
  );
} else {
  alert(
    `Sorry, we don't know the weather for this city, try going to https://www.google.com/search?q=weather+${cityName}`
  );
}
