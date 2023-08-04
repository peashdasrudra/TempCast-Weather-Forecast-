function getWeatherByCoords(latitude, longitude) {
  // API KEY
  const APIKey = "e35a2dd1fca0e0c9832e24f5939ea1f6";

  // Fetching weather
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${APIKey}`
  )
    .then((response) => response.json())
    .then((json) => {
      if (json.cod === "404") {
        const container = document.querySelector(".container");
        const weatherBox = document.querySelector(".weather-box");
        const weatherDetails = document.querySelector(".weather-details");
        const error404 = document.querySelector(".not-found");

        container.style.height = "400px";
        weatherBox.style.display = "none";
        weatherDetails.style.display = "none";
        error404.style.display = "block";
        error404.classList.add("fadeIn");
        return;
      }

      const error404 = document.querySelector(".not-found");
      error404.style.display = "none";
      error404.classList.remove("fadeIn");

      const image = document.querySelector(".weather-box img");
      const temperature = document.querySelector(".weather-box .temperature");
      const description = document.querySelector(".weather-box .description");
      const humidity = document.querySelector(
        ".weather-details .humidity span"
      );
      const wind = document.querySelector(".weather-details .wind span");
      const dewPoint = document.querySelector(
        ".weather-details .dew-point span"
      );
      const visibility = document.querySelector(
        ".weather-details .visibility span"
      );

      switch (json.weather[0].main) {
        case "Clear":
          image.src = "images/clear.png";
          break;
        case "Rain":
          image.src = "images/rain.png";
          break;
        case "Snow":
          image.src = "images/snow.png";
          break;
        case "Clouds":
          image.src = "images/cloud.jpeg";
          break;
        case "Haze":
          image.src = "images/mist.png";
          break;
        default:
          image.src = "";
      }

      temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
      description.innerHTML = `${json.weather[0].description}`;
      humidity.innerHTML = `Humidity: ${json.main.humidity}%`;
      wind.innerHTML = `Wind Speed: ${parseInt(json.wind.speed)} Km/h`;
      dewPoint.innerHTML = `Dew Point: ${json.main.temp}°C`;
      visibility.innerHTML = `Visibility: ${json.visibility / 1000} km`;

      const locationName = document.querySelector(".location-name");
      locationName.textContent = json.name;
      const currentLocation = document.querySelector(".current-location");
      currentLocation.style.display = "block";

      const container = document.querySelector(".container");
      const weatherBox = document.querySelector(".weather-box");
      const weatherDetails = document.querySelector(".weather-details");
      container.style.height = "590px";
      weatherBox.classList.add("fadeIn");
      weatherDetails.classList.add("fadeIn");
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}

function getCurrentLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        getWeatherByCoords(latitude, longitude);
      },
      (error) => {
        console.error("Error getting current location:", error);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }

  getWeatherByCoords(latitude, longitude);
}

const container = document.querySelector(".container");
const searchInput = document.querySelector(".search-box input");
const searchButton = document.querySelector(".search-box button");

function showWeatherData(json) {
  const error404 = document.querySelector(".not-found");
  error404.style.display = "none";
  error404.classList.remove("fadeIn");

  const latitude = json.coord.lat;
  const longitude = json.coord.lon;
  getWeatherByCoords(latitude, longitude);
}

function showError() {
  const weatherBox = document.querySelector(".weather-box");
  const weatherDetails = document.querySelector(".weather-details");
  const error404 = document.querySelector(".not-found");

  container.style.height = "400px";
  weatherBox.style.display = "none";
  weatherDetails.style.display = "none";
  error404.style.display = "block";
  error404.classList.add("fadeIn");

  // Clear the input field
  searchInput.value = "";
}

function searchWeather() {
  const APIKey = "e35a2dd1fca0e0c9832e24f5939ea1f6";
  const city = searchInput.value.trim();

  if (city === "") return;

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then((json) => {
      showWeatherData(json);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      showError();
    });
}

searchButton.addEventListener("click", searchWeather);

searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchWeather();
  }
});
