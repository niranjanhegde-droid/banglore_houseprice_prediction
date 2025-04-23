let osmMap;
let osmMarker;

function getBathValue() {
  var uiBathrooms = $("[name='uiBathrooms']");
  for (var i in uiBathrooms) {
    if (uiBathrooms[i].checked) {
      return parseInt(uiBathrooms[i].value);
    }
  }
  return -1;
}

function getBHKValue() {
  var uiBHK = $("[name='uiBHK']");
  for (var i in uiBHK) {
    if (uiBHK[i].checked) {
      return parseInt(uiBHK[i].value);
    }
  }
  return -1;
}

function onClickedEstimatePrice() {
  var sqft = document.getElementById("uiSqft").value.trim();
  var bhk = getBHKValue();
  var bathrooms = getBathValue();
  var location = document.getElementById("uiLocations").value;
  var estPrice = document.getElementById("uiEstimatedPrice");

  //  Check for missing input
  if (!sqft || isNaN(sqft) || bhk === -1 || bathrooms === -1 || !location) {
    alert("⚠️ Please fill in all the fields correctly before estimating the price.");
    return;
  }

  var url = "http://127.0.0.1:5000/predict_home_price";

  $.post(url, {
    total_sqft: parseFloat(sqft),
    bhk: bhk,
    bath: bathrooms,
    location: location
  }, function (data, status) {
    estPrice.innerHTML = "<h2>Estimated Price: ₹" + data.estimated_price + " Lakhs</h2>";
  });
}


function onPageLoad() {
  var url = "http://127.0.0.1:5000/get_location_names";
  $.get(url, function (data, status) {
    if (data) {
      var locations = data.locations;
      var uiLocations = document.getElementById("uiLocations");
      $('#uiLocations').empty();
      for (var i in locations) {
        var opt = new Option(locations[i]);
        $('#uiLocations').append(opt);
      }
    }
  });
}

function loadLeafletMap() {
  osmMap = L.map("osmMap").setView([12.9716, 77.5946], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(osmMap);
}

function updateMapWithLocation(location) {
  const query = encodeURIComponent(location + " Bangalore");
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        osmMap.setView([lat, lon], 15);
        if (osmMarker) osmMarker.remove();
        osmMarker = L.marker([lat, lon]).addTo(osmMap).bindPopup(location).openPopup();
      } else {
        alert("Location not found.");
      }
    });
}

function onViewMapClicked() {
  const location = document.getElementById("uiLocations").value;
  if (!location) return alert("Please select a location first.");
  updateMapWithLocation(location);
}

//  Save selections to persist across refresh
function saveSelection(groupName, value) {
  localStorage.setItem(groupName, value);
}

function restoreSelection(groupName) {
  const savedValue = localStorage.getItem(groupName);
  if (savedValue) {
    const radio = document.querySelector(`input[name='${groupName}'][value='${savedValue}']`);
    if (radio) radio.checked = true;
  }
}

function setupSelectionPersistence() {
  const bhkRadios = document.querySelectorAll("input[name='uiBHK']");
  const bathRadios = document.querySelectorAll("input[name='uiBathrooms']");

  bhkRadios.forEach(r => r.addEventListener("change", () => saveSelection("uiBHK", r.value)));
  bathRadios.forEach(r => r.addEventListener("change", () => saveSelection("uiBathrooms", r.value)));

  restoreSelection("uiBHK");
  restoreSelection("uiBathrooms");
}

window.onload = function () {
  onPageLoad();
  loadLeafletMap();
  setupSelectionPersistence();
};
