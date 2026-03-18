// Widget: live clock
const timeEl = document.getElementById('clock-time');
const dateEl = document.getElementById('clock-date');

const DAY_NAMES  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function tick() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  timeEl.textContent = `${hh}:${mm}:${ss}`;

  const day   = DAY_NAMES[now.getDay()];
  const date  = now.getDate();
  const month = MONTH_NAMES[now.getMonth()];
  const year  = now.getFullYear();
  dateEl.textContent = `${day}, ${date} ${month} ${year}`;
}

tick();
setInterval(tick, 1000);
