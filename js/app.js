// DOM Elements

const input = document.getElementById("input");
const submitBtn = document.querySelector(".submit-btn");

// Dom Elements for injecting fetched details

const showIpAdd = document.getElementById("ip-address");
const showLoc = document.getElementById("location");
const showTime = document.getElementById("timezone");
const showISP = document.getElementById("isp");

// Creating the Leaflet Map and Custom Icon

const leafletMap = L.map("map");
const customIcon = L.icon({
  iconUrl: "icon-location.svg",
  iconSize: [46, 56],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
});

// APIs

const geolocationApi = "at_sQeBXSmzfUA4rWZlZ4l1RPOJGHdWa";
const mapboxToken =
  "pk.eyJ1IjoiYWRpdHlhNjEwMSIsImEiOiJja2pvNXUzYzcweXBkMnh0ZmQzM3Rpc2diIn0.1LWDqS5HCvN1P80c08IuJA";

// Function which will create the Map

function creatMap() {
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
}
creatMap();

// Setting input value to null

input.value = "";

/* URL to fetch data when websites is loaded first  OR 
   User didn't searched for any Domain Name or IP Address */

const defaultUrl = `https://geo.ipify.org/api/v1?apiKey=${geolocationApi}`;

// Fetching data when website is loaded first

fetchData(defaultUrl);

// Listing for search action by the user

submitBtn.addEventListener("click", () => {
  const userInput = input.value;

  if (!userInput) {
    alert("😒😒😒 Please enter IP Address OR Domain 😒😒😒");
    return false;
  } else {
    validatedInput(userInput);
  }
});

// Async Function to Fetch Data

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    // Updating the DOM Elements according to fetched data

    const { lat, lng } = data.location;
    showIpAdd.innerText = data.ip;
    showLoc.innerText = `${data.location.city}, ${data.location.country}, ${data.location.geonameId}`;
    showTime.innerText = `UTC ${data.location.timezone}`;
    showISP.innerText = data.isp;

    // Call to a function for updating View and Marker's location

    showLocation(lat, lng);
  } catch (err) {
    alert("🙁🙁🙁 Something Went Wrong!!! 🙁🙁🙁");
    console.error(err);
  }
}

// Function for  setting location on the Map

function showLocation(latitude, longitude) {
  // Setting the view of Map according to fetched latitude and longitude

  leafletMap.setView([latitude, longitude], 13);

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

  // Validating entered IP Address

  if (input.match(regexIP)) {
    const fetchUrl = `https://geo.ipify.org/api/v1?apiKey=${geolocationApi}&ipAddress=${input}`;
    fetchData(fetchUrl);
    return true;
  }

  // Validating entered Domain Name
  else if (input.match(regexDomain) && !input.match(regexIP)) {
    const fetchUrl = `https://geo.ipify.org/api/v1?apiKey=${geolocationApi}&domain=${input}`;
    fetchData(fetchUrl);
    return true;
  }

  // Alerting user to enter correct credentials
  else {
    alert("😒😒😒 Please Enter Correct IP Address OR Domain 😒😒😒");
    return false;
  }
}
