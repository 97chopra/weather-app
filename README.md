# 🌤️ Weather App

A real-time weather application built with vanilla JavaScript and the OpenWeatherMap API. Search any city in the world and get live weather conditions, hourly forecasts, and a 7-day outlook — all with a sleek dark glassmorphism UI.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![OpenWeatherMap](https://img.shields.io/badge/OpenWeatherMap-API-orange?style=for-the-badge)

> 🔗 **Live Demo:** [https://97chopra.github.io/weather-app/](https://97chopra.github.io/weather-app/)

---

## 📸 Preview

![Weather App Screenshot](preview.png)

---

## ✨ Features

- 🔍 **City Search** — Search any city, suburb or district worldwide (e.g. Auckland CBD, Newmarket)
- 🌡️ **Live Weather** — Real-time temperature, conditions, humidity and wind speed
- 🕐 **Local Time** — Accurate local time displayed for the searched city
- ⏱️ **Hourly Forecast** — Next 12 hours at a glance
- 📅 **7-Day Forecast** — Daily high and low temperatures for the week ahead
- 🇳🇿 **NZ First** — Defaults to New Zealand cities when no country is specified
- 🌍 **Full Country Support** — Works with specific regions (e.g. "Punjab, India")
- ⚠️ **Error Handling** — In-page error messages with auto-dismiss
- 📱 **Responsive Design** — Works on mobile and desktop
- 🌙 **Dark Glassmorphism UI** — Modern atmospheric design with depth and glow effects

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and semantic markup |
| CSS3 | Styling, animations, responsive layout |
| JavaScript (ES6+) | Logic, API calls, DOM manipulation |
| OpenWeatherMap API | Live weather, forecast and geocoding data |
| Google Fonts (Outfit) | Modern typography |

---

## 📂 Project Structure

```
weather-app/
├── index.html      # Main HTML structure
├── style.css       # Glassmorphism dark theme styles
├── script.js       # JavaScript logic and API calls
└── README.md       # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- A free API key from [openweathermap.org](https://openweathermap.org/api)

### Run Locally

1. Clone the repository
```bash
git clone https://github.com/97chopra/weather-app.git
cd weather-app
```

2. Add your API key — open `script.js` and replace line 1:
```javascript
const API_KEY = 'your_api_key_here';
```

3. Open `index.html` in your browser — no build tools or installs needed! 

---

## 🔌 APIs Used

| Endpoint | Purpose |
|---|---|
| `/weather` | Current weather conditions |
| `/forecast` | 3-hourly forecast data (grouped into daily summaries) |
| `/geo/1.0/direct` | Geocoding — converts city name to coordinates |

> Searching by `lat/lon` coordinates is used for more precise results than searching by city name alone.

---

## 💡 Key Concepts Practised

**JavaScript**
- Fetching REST APIs using `fetch()` with `async/await`
- Parallel API calls with `Promise.all()` for performance
- Proper error handling with `response.ok` and `try/catch`
- Timestamp conversion and local time display using the `Date` object
- Geocoding flow: place name → coordinates → weather data
- Grouping 3-hourly forecast data into daily summaries

**CSS**
- Glassmorphism card effects with `backdrop-filter`
- Atmospheric depth using `radial-gradient` and glow effects
- Entrance animations with `@keyframes` and staggered `animation-delay`
- Cross-browser scrollbar hiding while keeping scroll working
- Responsive design with media queries and flexbox

**Git & Version Control**
- Professional commit messages using Conventional Commits
- Scoped commits (e.g. `feat(css):`, `fix(js):`)
- Release tagging with `git tag`

---

## 🔮 Future Improvements

- [ ] Add temperature unit toggle (°C / °F)
- [ ] Save recently searched cities
- [ ] Add weather map integration
- [ ] PWA support for offline use
- [ ] React version with backend proxy for API key security

---

## 👨‍💻 Author

**Aarti Chopra**
- GitHub: [@97chopra](https://github.com/97chopra)
- Final Year Student — Software Programming, Data Science & AI

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).