# 🌤️ Weather App

A real-time weather application built as a personal learning project
to practise working with REST APIs, vanilla JavaScript, and frontend
web development fundamentals.

---

## What I Built

A fully functional weather app that lets users search any city,
suburb, or district and get live weather data including current
conditions, an hourly forecast, and a 7-day outlook.

---

## Features

-  Search any city, suburb or district (e.g. Auckland CBD, Newmarket)
-  Live current temperature, condition, humidity and wind speed
-  Accurate local time for the searched city
-  Hourly forecast for the next 12 hours
-  7-day forecast with daily high and low temperatures
- 🇳🇿 Defaults to New Zealand cities when no country is specified
-  Full country name support (e.g. "Punjab, India" works correctly)
-  In-page error messages with auto-dismiss
-  Responsive layout for mobile and small screens
-  Dark modern UI with glassmorphism card design

---

##  What I Learned

### JavaScript
- How to fetch data from a REST API using `fetch()` and `async/await`
- How to handle API errors properly using `response.ok` and `try/catch`
- Why strict type checking matters (`data.cod !== 200` vs `Number(data.cod) !== 200`)
- How to run multiple API calls in parallel using `Promise.all()`
- How to convert and format timestamps using the JavaScript `Date` object
- How to build a geocoding flow (place name → coordinates → weather)
- How to parse and group 3-hourly forecast data into daily summaries

### APIs
- How to use the OpenWeatherMap current weather endpoint
- How to use the OpenWeatherMap forecast endpoint (`/data/2.5/forecast`)
- How to use the OpenWeatherMap geocoding endpoint (`/geo/1.0/direct`)
- Why searching by `lat/lon` is more precise than searching by city name
- How timezone offsets work and how to display correct local time

### HTML
- Importance of valid semantic HTML structure
- How JavaScript connects to the DOM via element IDs
- Why `<script>` belongs at the bottom of `<body>`

### CSS
- How CSS custom properties (variables) make theming consistent
- How to build glassmorphism card effects
- How to use `radial-gradient` for atmospheric depth and glow
- How to use `@keyframes` for entrance animations
- How to use `animation-delay` for staggered reveals
- How flexbox works for search bars and forecast card rows
- How to hide scrollbars cross-browser while keeping scroll working
- How media queries work for responsive design

### Git & Version Control
- How to write professional commit messages using Conventional Commits
- How to scope commits to specific files (`feat(css):`, `fix(js):`)
- How to use `git tag` to mark stable release versions

---

##  Tech Stack

| Technology | Purpose |
| HTML5 | Page structure and semantic markup |
| CSS3 | Styling, animations, responsive layout |
| Vanilla JavaScript (ES6+) | Logic, API calls, DOM manipulation |
| OpenWeatherMap API | Live weather, forecast and geocoding data |
| Google Fonts (Outfit) | Modern typography |

---

##  How to Run

1. Clone or download this repository
2. Get a free API key from [openweathermap.org](https://openweathermap.org/api)
3. Open `script.js` and replace the API key on line 1:
```js
   const API_KEY = 'your_api_key_here';
```
4. Open `index.html` in your browser — no build tools needed

---

