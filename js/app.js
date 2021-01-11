// DOM Elements

const input = document.getElementById("input");
const submitBtn = document.querySelector(".submit-btn");

const showIpAdd = document.getElementById("ip-address");
const showLoc = document.getElementById("location");
const showTime = document.getElementById("timezone");
const showISP = document.getElementById("isp");

const geolocationApi = "at_sQeBXSmzfUA4rWZlZ4l1RPOJGHdWa";
const mapboxToken =
  "pk.eyJ1IjoiYWRpdHlhNjEwMSIsImEiOiJja2pvNXUzYzcweXBkMnh0ZmQzM3Rpc2diIn0.1LWDqS5HCvN1P80c08IuJA";

const defaultUrl = `https://geo.ipify.org/api/v1?apiKey=${geolocationApi}`;

// Setting input value to null

input.value = "";

// Fetching data using user's ip address
fetchData(defaultUrl);

submitBtn.addEventListener("click", () => {
  const userInput = input.value;

  if (!userInput) {
    alert("😒😒😒 Please enter IP Address OR Domain 😒😒😒");
    return false;
  } else {
    validatedInput(userInput);
  }
});

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    // Setting Text of the page using fetched data
    let { lat, lng } = data.location;

    showIpAdd.innerText = data.ip;
    showLoc.innerText = `${data.location.city}, ${data.location.country}, ${data.location.geonameId}`;
    showTime.innerText = `UTC ${data.location.timezone}`;
    showISP.innerText = data.isp;
    ShowUserLocation(lat, lng);
  } catch (err) {}
}

// Creating the map and setting it's view according to fetched latitude and longitude

function ShowUserLocation(latitude, longitude) {
  const leafletMap = L.map("map").setView([latitude, longitude], 13);
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken: mapboxToken,
    }
  ).addTo(leafletMap);

  // Creating custom icon

  const customIcon = L.icon({
    iconUrl: "icon-location.svg",
    iconSize: [46, 56],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
  });

  // Adding marker according to fetched latitude and longitude

  const marker = L.marker([latitude, longitude], {
    icon: customIcon,
  }).addTo(leafletMap);
}

// Function which will check for validation of the user's input

function validatedInput(input) {
  // Creating regex

  const regexExpIP = /^(?:(?:^|\.)(?:2(?:5[0-5]|[0-4]\d)|1?\d?\d)){4}$/;
  const regexIP = new RegExp(regexExpIP);
  const regexExpDomain = /^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/;
  const regexDomain = new RegExp(regexExpDomain);

  // Checking the input as IP Address

  if (input.match(regexIP)) {
    const fetchUrl = `https://geo.ipify.org/api/v1?apiKey=${geolocationApi}&ipAddress=${input}`;
    fetchData(fetchUrl);
    return true;
  }

  // Checking the input as Domain Name
  else if (input.match(regexDomain) && !input.match(regexIP)) {
    const fetchUrl = `https://geo.ipify.org/api/v1?apiKey=${geolocationApi}&domain=${input}`;
    fetchData(fetchUrl);
    return true;
  }

  // Alerting user to enter correct details
  else {
    alert("😒😒😒 Please Enter Correct IP Address OR Domain 😒😒😒");
    return false;
  }
}
