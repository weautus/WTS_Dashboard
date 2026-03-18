# WTS Dashboard

A personal dashboard hosted on GitHub Pages to quickly access your apps, check the time, and see the weather in Baisy-Thy.

## Features

- **App grid** — click any card to open your app in a new tab
- **Add / remove apps** — name + emoji + URL, stored in `localStorage`
- **Live clock** — updates every second
- **Weather** — current temperature and condition for Baisy-Thy via [Open-Meteo](https://open-meteo.com/) (free, no API key)

## Deploy to GitHub Pages

1. Push this repository to GitHub
2. Go to **Settings → Pages**
3. Set source to **Deploy from a branch → `main` / `(root)`**
4. Visit `https://<your-username>.github.io/<repo-name>/`

## Project structure

```
index.html          ← Dashboard (clock, weather, app grid)
add-link.html       ← Add / remove app links
css/
  style.css         ← All styles
js/
  clock.js          ← Clock widget
  weather.js        ← Weather widget (Open-Meteo)
  links.js          ← Renders app cards on the dashboard
  storage.js        ← localStorage helpers (shared)
  add-link.js       ← Add-link page logic
```

## Adding a new widget

1. Create `js/my-widget.js`
2. Add the HTML placeholder in `index.html`
3. Add `<script type="module" src="js/my-widget.js"></script>` to `index.html`
4. Style it in `css/style.css` following the `.widget` pattern
