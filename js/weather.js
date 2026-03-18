// Widget: weather for Baisy-Thy, Belgium
// Uses Open-Meteo (free, no API key required)
// Coordinates for Baisy-Thy: lat=50.5297, lon=4.6197

const LATITUDE  = 50.5297;
const LONGITUDE = 4.6197;
const CACHE_KEY = 'wts_weather_cache';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const iconEl = document.getElementById('weather-icon');
const tempEl = document.getElementById('weather-temp');
const descEl = document.getElementById('weather-desc');

// WMO weather interpretation codes → emoji + label
const WMO_CODES = {
  0:  ['☀️',  'Clear sky'],
  1:  ['🌤️', 'Mainly clear'],
  2:  ['⛅',  'Partly cloudy'],
  3:  ['☁️',  'Overcast'],
  45: ['🌫️', 'Foggy'],
  48: ['🌫️', 'Icy fog'],
  51: ['🌦️', 'Light drizzle'],
  53: ['🌦️', 'Drizzle'],
  55: ['🌧️', 'Heavy drizzle'],
  61: ['🌧️', 'Light rain'],
  63: ['🌧️', 'Rain'],
  65: ['🌧️', 'Heavy rain'],
  71: ['🌨️', 'Light snow'],
  73: ['🌨️', 'Snow'],
  75: ['❄️',  'Heavy snow'],
  77: ['🌨️', 'Snow grains'],
  80: ['🌦️', 'Rain showers'],
  81: ['🌧️', 'Heavy showers'],
  82: ['⛈️',  'Violent showers'],
  85: ['🌨️', 'Snow showers'],
  86: ['🌨️', 'Heavy snow showers'],
  95: ['⛈️',  'Thunderstorm'],
  96: ['⛈️',  'Thunderstorm w/ hail'],
  99: ['⛈️',  'Thunderstorm w/ heavy hail'],
};

function wmoInfo(code) {
  // Find exact or nearest lower code
  const entry = WMO_CODES[code];
  if (entry) return entry;
  // Fallback: look for closest key below
  const keys = Object.keys(WMO_CODES).map(Number).sort((a, b) => a - b);
  const fallback = keys.reverse().find(k => k <= code);
  return WMO_CODES[fallback] ?? ['🌡️', 'Unknown'];
}

function renderWeather(temp, code) {
  const [emoji, label] = wmoInfo(code);
  iconEl.textContent = emoji;
  tempEl.textContent = `${Math.round(temp)}°C`;
  descEl.textContent = label;
}

function renderError() {
  iconEl.textContent = '❓';
  tempEl.textContent = '--°C';
  descEl.textContent = 'Unavailable';
}

async function fetchWeather() {
  // Check cache
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      renderWeather(cached.temp, cached.code);
      return;
    }
  } catch { /* ignore bad cache */ }

  const url = `https://api.open-meteo.com/v1/forecast`
    + `?latitude=${LATITUDE}&longitude=${LONGITUDE}`
    + `&current=temperature_2m,weather_code`
    + `&timezone=Europe%2FBrussels`;

  try {
    const res  = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const temp = data.current.temperature_2m;
    const code = data.current.weather_code;
    renderWeather(temp, code);
    localStorage.setItem(CACHE_KEY, JSON.stringify({ temp, code, ts: Date.now() }));
  } catch (err) {
    console.warn('Weather fetch failed:', err);
    renderError();
  }
}

fetchWeather();
// Refresh every 10 minutes
setInterval(fetchWeather, CACHE_TTL);
