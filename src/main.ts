const API_URL = `https://geo.ipify.org/api/v2/country,city?apiKey=${
  import.meta.env.VITE_API_KEY
}`;

// types
type Data = {
  ip: string;
  isp: string;
  city: string;
  country: string;
  timezone: string;
};

// DOM Elements
const searchEl = document.getElementById("input") as HTMLInputElement;
const submitButtonEl = document.querySelector(
  ".submit-btn"
) as HTMLButtonElement;

// Dom Elements for injecting fetched details
const showIpAdd = document.getElementById("ip-address") as HTMLHeadingElement;
const showLoc = document.getElementById("location") as HTMLHeadingElement;
const showTime = document.getElementById("timezone") as HTMLHeadingElement;
const showISP = document.getElementById("isp") as HTMLHeadingElement;

const map = L.map("map");
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

function renderMap({ lat, lng }: { lat: number; lng: number }) {
  map.setView([lat, lng], 10);
  L.marker([lat, lng]).addTo(map);
}

async function getIpInfo(value = "") {
  const URL = value ? `${API_URL}&domain=${value}` : API_URL;

  const res = await fetch(URL);
  const data = await res.json();
  const { lat, lng, city, country, timezone } = data.location;

  updateDataValues({
    ip: data.ip,
    isp: data.isp,
    city,
    country,
    timezone,
  });

  renderMap({ lat, lng });
}

function updateDataValues(data: Data) {
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
