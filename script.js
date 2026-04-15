// API Key
const API_KEY = '61bc1dd461d7e51bf8b8d01c15be9abd';

// Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const cityName  = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const condition = document.getElementById('condition');
const humidity  = document.getElementById('humidity');
const wind      = document.getElementById('wind');
const alertBox  = document.getElementById('alert-box');
// Fetch current weather
async function getWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    if (data.cod !== 200) {
      alert('City not found! Please try again.');
      return;
    }

    // Update the page with real data
    cityName.textContent = data.name + ', ' + data.sys.country;
    temperature.textContent = Math.round(data.main.temp) + '°C';
    condition.textContent = data.weather[0].main;
    humidity.textContent = 'H: ' + data.main.humidity + '%';
    wind.textContent = 'W: ' + Math.round(data.wind.speed) + ' km/h';

  } catch (error) {
    alert('Something went wrong. Please try again.');
  }
}

// Search button click
searchBtn.addEventListener('click', function() {
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  }
});

// Enter key press
cityInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    const city = cityInput.value.trim();
    if (city) {
      getWeather(city);
    }
  }
});