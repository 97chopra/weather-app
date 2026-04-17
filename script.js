
// WEATHER APP 
// API KEY 
const API_KEY = '61bc1dd461d7e51bf8b8d01c15be9abd';

// BASE URLs 
// Current weather endpoint
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
// 3-hourly forecast endpoint (gives us hourly + 7-day data)
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

//DOM ELEMENTS 
const cityInput   = document.getElementById('city-input');
const searchBtn   = document.getElementById('search-btn');
const cityName    = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const condition   = document.getElementById('condition');
const humidity    = document.getElementById('humidity');
const wind        = document.getElementById('wind');
const alertBox    = document.getElementById('alert-box');   // used properly now
const hourlyList  = document.getElementById('hourly-list'); // hourly forecast container
const dailyList   = document.getElementById('daily-list');  // 7-day forecast container

// HELPER: Show an in-page error instead of browser alert()

function showError(message) {
  alertBox.textContent = message;
  alertBox.style.display = 'block';

  // Auto-hide the error after 4 seconds
  setTimeout(() => {
    alertBox.style.display = 'none';
  }, 4000);
}

// HELPER: Hide the error box when a search succeeds
function hideError() {
  alertBox.style.display = 'none';
}



// HELPER: Show a loading state so UI doesn't look broken
//         while data is being fetched from the API

function showLoading() {
  cityName.textContent    = 'Loading...';
  temperature.textContent = '--°C';
  condition.textContent   = '--';
  humidity.textContent    = 'H: --%';
  wind.textContent        = 'W: -- km/h';
  if (hourlyList) hourlyList.innerHTML = '';
  if (dailyList)  dailyList.innerHTML  = '';
}



// HELPER: Convert wind speed from m/s → km/h
//         OpenWeatherMap always returns wind in m/s,
//         NOT km/h — multiplying by 3.6 does the conversion

function msToKmh(ms) {
  return Math.round(ms * 3.6);
}



// HELPER: Convert a UTC timestamp + timezone offset
//         into a real local time string for that city
//         (fixes the "wrong time" bug)

function getLocalTime(utcTimestamp, timezoneOffsetSeconds) {
  // utcTimestamp = seconds since epoch (from API)
  // timezoneOffsetSeconds = city's UTC offset in seconds (from API)
  const localMs = (utcTimestamp + timezoneOffsetSeconds) * 1000;
  const localDate = new Date(localMs);

  // Format as "Mon, 3:45 PM"
  return localDate.toUTCString().replace(' GMT', ''); // strip GMT so it shows local
}



// HELPER: Format a forecast timestamp into a readable hour
//         e.g. "3 PM", "6 PM" — used in hourly forecast row

function formatHour(dtText, timezoneOffsetSeconds) {
  // dtText from forecast API looks like "2026-04-18 15:00:00"
  const utcMs = new Date(dtText + ' UTC').getTime();
  const localMs = utcMs + (timezoneOffsetSeconds * 1000);
  const d = new Date(localMs);
  const hours = d.getUTCHours();
  const ampm  = hours >= 12 ? 'PM' : 'AM';
  const h     = hours % 12 || 12;
  return `${h} ${ampm}`;
}



// HELPER: Format a forecast timestamp into a day name
//         e.g. "Mon", "Tue" — used in 7-day forecast row

function formatDay(dtText, timezoneOffsetSeconds) {
  const utcMs  = new Date(dtText + ' UTC').getTime();
  const localMs = utcMs + (timezoneOffsetSeconds * 1000);
  const d = new Date(localMs);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[d.getUTCDay()];
}

function getWeatherIcon(conditionMain) {
  const icons = {
    'Clear'        : '☀️',
    'Clouds'       : '☁️',
    'Rain'         : '🌧️',
    'Drizzle'      : '🌦️',
    'Thunderstorm' : '⛈️',
    'Snow'         : '❄️',
    'Mist'         : '🌫️',
    'Fog'          : '🌫️',
    'Haze'         : '🌫️',
    'Smoke'        : '🌫️',
    'Dust'         : '🌫️',
    'Sand'         : '🌫️',
    'Ash'          : '🌋',
    'Squall'       : '💨',
    'Tornado'      : '🌪️',
  };
  return icons[conditionMain] || '🌡️'; 
}


// FETCH 1: Get current weather for a city

async function getCurrentWeather(city) {
  
  const query = city.includes(',') ? city : city;

  const url = `${BASE_URL}?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=metric&lang=en`;

  
  const response = await fetch(url);
  if (!response.ok) {
    // 404 = city not found, 401 = bad API key, etc.
    throw new Error(`City not found (${response.status}). Please check the spelling and try again.`);
  }

  const data = await response.json();

  
  if (Number(data.cod) !== 200) {
    throw new Error(data.message || 'City not found. Please try again.');
  }

  return data;
}



// FETCH 2: Get 5-day / 3-hourly forecast for a city

async function getForecast(city) {
  const url = `${FORECAST_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=en`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Forecast not available (${response.status}).`);
  }

  const data = await response.json();

  if (Number(data.cod) !== 200) {
    throw new Error(data.message || 'Forecast not available.');
  }

  return data;
}



// RENDER: Update the current weather card on the page

function renderCurrentWeather(data) {
  // data.timezone = offset in seconds from UTC for this city
  const localTime = getLocalTime(data.dt, data.timezone);

  cityName.textContent    = `${data.name}, ${data.sys.country}`;
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  condition.textContent   = `${getWeatherIcon(data.weather[0].main)} ${data.weather[0].description}`;

  humidity.textContent    = `H: ${data.main.humidity}%`;

  // Convert m/s → km/h (was showing wrong values before)
  wind.textContent        = `W: ${msToKmh(data.wind.speed)} km/h`;

  // Optional: show local time if you have an element for it
  const timeEl = document.getElementById('local-time');
  if (timeEl) timeEl.textContent = localTime;
}



// RENDER: Build the hourly forecast row from forecast data
//         The /forecast endpoint returns data every 3 hours —

function renderHourlyForecast(forecastData, timezoneOffset) {
  if (!hourlyList) return; // skip if element doesn't exist in HTML

  // forecastData.list = array of 3-hourly entries
  // We only want the next 4 entries (now, +3h, +6h, +9h)
  const next4 = forecastData.list.slice(0, 4);

  hourlyList.innerHTML = next4.map((entry, index) => {
    const label = index === 0 ? 'Now' : formatHour(entry.dt_txt, timezoneOffset);
    const temp  = Math.round(entry.main.temp);
    const icon  = getWeatherIcon(entry.weather[0].main);

    return `
      <div class="hour-item">
        <span class="hour-time">${label}</span>
        <span class="hour-icon">${icon}</span>
        <span class="hour-temp">${temp}°</span>
      </div>
    `;
  }).join('');
}



// RENDER: Build the 7-day forecast section
//         The /forecast endpoint gives 3-hourly data for 5 days.


function renderDailyForecast(forecastData, timezoneOffset) {
  if (!dailyList) return; // skip if element doesn't exist in HTML

  const list = forecastData.list;

  // Group entries by day, pick the one closest to 12:00
  const byDay = {};
  list.forEach(entry => {
    // dt_txt looks like "2026-04-18 15:00:00"
    const dateKey = entry.dt_txt.split(' ')[0]; // "2026-04-18"
    const hour    = parseInt(entry.dt_txt.split(' ')[1]); // 15

    // Keep the entry closest to noon for each day
    if (!byDay[dateKey] || Math.abs(hour - 12) < Math.abs(byDay[dateKey].hour - 12)) {
      byDay[dateKey] = { entry, hour };
    }
  });

  // Convert to array and skip today (index 0) since current card covers it
  const days = Object.values(byDay).slice(1, 8);

  dailyList.innerHTML = days.map(({ entry }) => {
    const dayName = formatDay(entry.dt_txt, timezoneOffset);
    const high    = Math.round(entry.main.temp_max);
    const low     = Math.round(entry.main.temp_min);
    const icon    = getWeatherIcon(entry.weather[0].main);
    const desc    = entry.weather[0].main;

    return `
      <div class="day-item">
        <span class="day-name">${dayName}</span>
        <span class="day-icon">${icon}</span>
        <span class="day-desc">${desc}</span>
        <span class="day-high">${high}°</span>
        <span class="day-low">${low}°</span>
      </div>
    `;
  }).join('');
}



// MAIN: Orchestrates both fetches and all rendering

async function loadWeather(city) {
  // Show loading state immediately so UI isn't blank/stale
  showLoading();
  hideError();

  try {
    // Run both API calls at the same time for speed
    const [currentData, forecastData] = await Promise.all([
      getCurrentWeather(city),
      getForecast(city)
    ]);

    // Timezone offset (seconds) — same for both since same city
    const tzOffset = currentData.timezone;

    // Render all three sections
    renderCurrentWeather(currentData);
    renderHourlyForecast(forecastData, tzOffset);
    renderDailyForecast(forecastData, tzOffset);

  } catch (error) {
    // FIX: Log the real error for debugging, show friendly message to user
    console.error('Weather load failed:', error);
    showError(error.message || 'Something went wrong. Please try again.');
    showLoading(); // reset UI back to blank dashes
  }
}



// Single handleSearch function — no duplicate logic

function handleSearch() {
  const city = cityInput.value.trim();
  if (!city) {
    showError('Please enter a city name.');
    return;
  }
  loadWeather(city);
}

// Attach to button click
searchBtn.addEventListener('click', handleSearch);

// Attach to Enter key inside the input
cityInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') handleSearch();
});

loadWeather('Auckland,NZ');