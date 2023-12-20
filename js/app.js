const API_URL = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}`;

// DOM Elements
let searchEl = document.getElementById("input");
let submitButtonEl = document.querySelector(".submit-btn");
let dataViewEl = document.querySelector(".user-data-card");

// Dom Elements for injecting fetched details
let showIpAdd = document.getElementById("ip-address");
let showLoc = document.getElementById("location");
let showTime = document.getElementById("timezone");
let showISP = document.getElementById("isp");

let map = L.map("map");
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

function renderMap({ lat, lng }) {
  map.setView([lat, lng], 10);
  L.marker([lat, lng]).addTo(map);
}

async function getIpInfo(value = "") {
  let URL = value ? `${API_URL}&domain=${value}` : API_URL;

  let res = await fetch(URL);
  let data = await res.json();
  let { lat, lng, city, country, timezone } = data.location;

  updateDataValues({
    ip: data.ip,
    isp: data.isp,
    city,
    country,
    timezone,
  });

  renderMap({ lat, lng });
}

function updateDataValues(data) {
  let { ip, isp, city, country, timezone } = data;

  showIpAdd.innerText = ip;
  showISP.innerText = isp;
  showLoc.innerText = `${city} - ${country}`;
  showTime.innerText = timezone;
}

document.addEventListener("DOMContentLoaded", async () => {
  getIpInfo();
});

submitButtonEl.addEventListener("click", () => {
  let value = searchEl.value;

  if (!value) {
    return alert("Please enter valid term");
  }
  // TODO add validation here

  getIpInfo(value);
});
