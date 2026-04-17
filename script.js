
//  API KEY & BASE URLs 
const API_KEY      = '61bc1dd461d7e51bf8b8d01c15be9abd';
const BASE_URL     = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const GEO_URL      = 'https://api.openweathermap.org/geo/1.0/direct';


//DOM ELEMENTS 
const cityInput   = document.getElementById('city-input');
const searchBtn   = document.getElementById('search-btn');
const cityName    = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const condition   = document.getElementById('condition');
const humidity    = document.getElementById('humidity');
const wind        = document.getElementById('wind');
const alertBox    = document.getElementById('alert-box');
const hourlyList  = document.getElementById('hourly-list');
const dailyList   = document.getElementById('daily-list');



const COUNTRY_MAP = {
  'afghanistan': 'AF', 'albania': 'AL', 'algeria': 'DZ', 'argentina': 'AR',
  'australia': 'AU', 'austria': 'AT', 'bangladesh': 'BD', 'belgium': 'BE',
  'brazil': 'BR', 'canada': 'CA', 'chile': 'CL', 'china': 'CN',
  'colombia': 'CO', 'croatia': 'HR', 'czech republic': 'CZ', 'denmark': 'DK',
  'egypt': 'EG', 'ethiopia': 'ET', 'finland': 'FI', 'france': 'FR',
  'germany': 'DE', 'ghana': 'GH', 'greece': 'GR', 'hungary': 'HU',
  'india': 'IN', 'indonesia': 'ID', 'iran': 'IR', 'iraq': 'IQ',
  'ireland': 'IE', 'israel': 'IL', 'italy': 'IT', 'japan': 'JP',
  'jordan': 'JO', 'kenya': 'KE', 'malaysia': 'MY', 'mexico': 'MX',
  'morocco': 'MA', 'myanmar': 'MM', 'nepal': 'NP', 'netherlands': 'NL',
  'new zealand': 'NZ', 'nigeria': 'NG', 'norway': 'NO', 'pakistan': 'PK',
  'peru': 'PE', 'philippines': 'PH', 'poland': 'PL', 'portugal': 'PT',
  'romania': 'RO', 'russia': 'RU', 'saudi arabia': 'SA', 'serbia': 'RS',
  'singapore': 'SG', 'south africa': 'ZA', 'south korea': 'KR',
  'spain': 'ES', 'sri lanka': 'LK', 'sudan': 'SD', 'sweden': 'SE',
  'switzerland': 'CH', 'taiwan': 'TW', 'tanzania': 'TZ', 'thailand': 'TH',
  'turkey': 'TR', 'turkiye': 'TR', 'ukraine': 'UA',
  'united kingdom': 'GB', 'uk': 'GB', 'england': 'GB',
  'united states': 'US', 'usa': 'US', 'america': 'US',
  'uzbekistan': 'UZ', 'venezuela': 'VE', 'vietnam': 'VN', 'zimbabwe': 'ZW',
};



function parseInput(rawInput) {
  const parts = rawInput.split(',');

  if (parts.length >= 2) {
    
    const cityPart   = parts.slice(0, parts.length - 1).join(',').trim();
    const countryRaw = parts[parts.length - 1].trim().toLowerCase();

    
    if (countryRaw.length === 2) {
      return { cityPart, countryCode: countryRaw.toUpperCase() };
    }

    
    const mapped = COUNTRY_MAP[countryRaw];
    if (mapped) {
      return { cityPart, countryCode: mapped };
    }

    
    return { cityPart, countryCode: countryRaw.toUpperCase() };
  }

  
  return { cityPart: rawInput.trim(), countryCode: 'NZ' };
}



function showError(message) {
  alertBox.textContent  = message;
  alertBox.style.display = 'block';
  setTimeout(() => { alertBox.style.display = 'none'; }, 4000);
}



function hideError() {
  alertBox.style.display = 'none';
}



function showLoading() {
  cityName.textContent    = 'Loading...';
  temperature.textContent = '--°C';
  condition.textContent   = '--';
  humidity.textContent    = 'H: --%';
  wind.textContent        = 'W: -- km/h';
  if (hourlyList) hourlyList.innerHTML = '';
  if (dailyList)  dailyList.innerHTML  = '';
}



function msToKmh(ms) {
  return Math.round(ms * 3.6);
}



function getLocalTime(utcTimestamp, timezoneOffsetSeconds) {
  // utcTimestamp = seconds since Unix epoch (from API)
  // timezoneOffsetSeconds = city's offset from UTC in seconds
  const localMs   = (utcTimestamp + timezoneOffsetSeconds) * 1000;
  const localDate = new Date(localMs);

  
  return localDate.toUTCString().replace(' GMT', '');
}



function formatHour(dtText, timezoneOffsetSeconds) {
  
  const utcMs   = new Date(dtText + ' UTC').getTime();
  const localMs = utcMs + (timezoneOffsetSeconds * 1000);
  const d       = new Date(localMs);
  const hours   = d.getUTCHours();
  const ampm    = hours >= 12 ? 'PM' : 'AM';
  const h       = hours % 12 || 12;
  return `${h} ${ampm}`;
}



function formatDay(dtText, timezoneOffsetSeconds) {
  const utcMs   = new Date(dtText + ' UTC').getTime();
  const localMs = utcMs + (timezoneOffsetSeconds * 1000);
  const d       = new Date(localMs);
  const days    = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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



async function geocodeCity(rawInput) {
  const { cityPart, countryCode } = parseInput(rawInput);

  
  const query = countryCode
    ? `${cityPart},${countryCode}`
    : cityPart;

  
  const url = `${GEO_URL}?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Location not found. Try "Auckland" or add a country e.g. "Hamilton, AU"`);
  }

  const results = await response.json();

  
  if (!results || results.length === 0) {
    const fallbackUrl = `${GEO_URL}?q=${encodeURIComponent(cityPart)}&limit=5&appid=${API_KEY}`;
    const fallbackRes = await fetch(fallbackUrl);
    const fallbackData = await fallbackRes.json();

    if (!fallbackData || fallbackData.length === 0) {
      throw new Error(
        `"${cityPart}" not found. Try the nearest main city e.g. "Auckland", or add a country e.g. "Hamilton, AU".`
      );
    }

    
    if (countryCode === 'NZ') {
      const nzMatch = fallbackData.find(r => r.country === 'NZ');
      if (nzMatch) return nzMatch;
    }

    return fallbackData[0];
  }

  
  if (countryCode === 'NZ') {
    const nzMatch = results.find(r => r.country === 'NZ');
    if (nzMatch) return nzMatch;
  }

  
  return results[0];
}



async function getCurrentWeather(city) {
  // Step 1 — geocode to get exact lat/lon
  const geo = await geocodeCity(city);
  const { lat, lon, name, country, state } = geo;

  // Build a nice display name that includes suburb info
  // e.g. "Newmarket, Auckland, NZ" instead of just "Auckland, NZ"
  geo.displayName = state
    ? `${name}, ${state}, ${country}`
    : `${name}, ${country}`;

  // Step 2 — fetch weather by coordinates (precise, works for suburbs)
  const url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=en`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather data not available for "${name}". Please try again.`);
  }

  const data = await response.json();
  if (Number(data.cod) !== 200) {
    throw new Error(data.message || 'Weather not available. Please try again.');
  }

  // Attach display name so the weather card shows the right location
  data.displayName = geo.displayName;

  return data;
}



async function getForecast(city) {
  // Step 1 — geocode to get exact lat/lon
  const geo = await geocodeCity(city);
  const { lat, lon } = geo;

  // Step 2 — fetch forecast by coordinates
  const url = `${FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=en`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Forecast not available for this location. Please try again.`);
  }

  const data = await response.json();
  if (Number(data.cod) !== 200) {
    throw new Error(data.message || 'Forecast not available. Please try again.');
  }

  return data;
}



function renderCurrentWeather(data) {
  const localTime = getLocalTime(data.dt, data.timezone);

  // Use geocoded displayName for accurate suburb-level location
  // Falls back to API name if displayName wasn't set
  cityName.textContent    = data.displayName || `${data.name}, ${data.sys.country}`;
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  condition.textContent   = `${getWeatherIcon(data.weather[0].main)} ${data.weather[0].description}`;
  humidity.textContent    = `H: ${data.main.humidity}%`;

  // Wind converted from m/s → km/h (was wrong before)
  wind.textContent        = `W: ${msToKmh(data.wind.speed)} km/h`;

  // Show city's real local time (not browser time)
  const timeEl = document.getElementById('local-time');
  if (timeEl) timeEl.textContent = localTime;
}



function renderHourlyForecast(forecastData, timezoneOffset) {
  if (!hourlyList) return;

  // Slice first 4 entries = next 12 hours
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



function renderDailyForecast(forecastData, timezoneOffset) {
  if (!dailyList) return;

  const list = forecastData.list;

  
  const byDay = {};
  list.forEach(entry => {
    const dateKey = entry.dt_txt.split(' ')[0];       // "2026-04-18"
    const hour    = parseInt(entry.dt_txt.split(' ')[1]); // 15

    if (!byDay[dateKey] || Math.abs(hour - 12) < Math.abs(byDay[dateKey].hour - 12)) {
      byDay[dateKey] = { entry, hour };
    }
  });

  
  // Show up to 7 days
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



// MAIN: Orchestrates everything — geocode → fetch → render
// Runs both API calls in parallel with Promise.all for speed

async function loadWeather(city) {
  showLoading(); // show dashes immediately
  hideError();   // clear any previous error

  try {
    
    const [currentData, forecastData] = await Promise.all([
      getCurrentWeather(city),
      getForecast(city)
    ]);

    // Timezone offset in seconds — same city so same for both
    const tzOffset = currentData.timezone;

    // Render all three sections
    renderCurrentWeather(currentData);
    renderHourlyForecast(forecastData, tzOffset);
    renderDailyForecast(forecastData, tzOffset);

  } catch (error) {
    //debugging 
    console.error('Weather load failed:', error);

    
    showError(error.message || 'Something went wrong. Please try again.');

    
    showLoading();
  }
}



function handleSearch() {
  const city = cityInput.value.trim();
  if (!city) {
    showError('Please enter a city or suburb name.');
    return;
  }
  loadWeather(city);
}

// Button click
searchBtn.addEventListener('click', handleSearch);

// Enter key inside the input field
cityInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') handleSearch();
});



loadWeather('Auckland');