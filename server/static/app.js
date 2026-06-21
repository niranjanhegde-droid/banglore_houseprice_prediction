let osmMap;
let osmMarker;

// ----------------------
// Get Bathrooms
// ----------------------
function getBathValue() {
    const uiBathrooms = document.getElementsByName("uiBathrooms");

    for (let i = 0; i < uiBathrooms.length; i++) {
        if (uiBathrooms[i].checked) {
            return parseInt(uiBathrooms[i].value);
        }
    }

    return -1;
}

// ----------------------
// Get BHK
// ----------------------
function getBHKValue() {
    const uiBHK = document.getElementsByName("uiBHK");

    for (let i = 0; i < uiBHK.length; i++) {
        if (uiBHK[i].checked) {
            return parseInt(uiBHK[i].value);
        }
    }

    return -1;
}

// ----------------------
// Estimate Price
// ----------------------
function onClickedEstimatePrice() {

    const sqft = document.getElementById("uiSqft").value;
    const bhk = getBHKValue();
    const bath = getBathValue();
    const location = document.getElementById("uiLocations").value;
    const estPrice = document.getElementById("uiEstimatedPrice");

    if (
        sqft === "" ||
        bhk === -1 ||
        bath === -1 ||
        location === ""
    ) {
        alert("Please fill all fields.");
        return;
    }

    $.post(
        "/predict_home_price",
        {
            total_sqft: parseFloat(sqft),
            bhk: bhk,
            bath: bath,
            location: location
        },
        function(data) {

            estPrice.innerHTML =
                "<h2>₹ " +
                data.estimated_price +
                " Lakhs</h2>";
        }
    );
}

// ----------------------
// Load Locations
// ----------------------
function onPageLoad() {

    $.get(
        "/get_location_names",
        function(data) {

            if (!data) return;

            const locations = data.locations;
            const uiLocations =
                document.getElementById("uiLocations");

            uiLocations.innerHTML =
                '<option value="" disabled selected>Select Location</option>';

            for (let i = 0; i < locations.length; i++) {

                let option =
                    document.createElement("option");

                option.value = locations[i];
                option.text = locations[i];

                uiLocations.appendChild(option);
            }
        }
    );
}

// ----------------------
// Leaflet Map
// ----------------------
function loadLeafletMap() {

    osmMap = L.map("osmMap")
        .setView([12.9716, 77.5946], 11);

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                "&copy; OpenStreetMap contributors"
        }
    ).addTo(osmMap);
}

// ----------------------
// Update Map
// ----------------------
function updateMapWithLocation(location) {

    const query =
        encodeURIComponent(location + " Bangalore");

    fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
    )
        .then(response => response.json())
        .then(data => {

            if (data.length === 0) {
                alert("Location not found");
                return;
            }

            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);

            osmMap.setView([lat, lon], 14);

            if (osmMarker) {
                osmMap.removeLayer(osmMarker);
            }

            osmMarker = L.marker([lat, lon])
                .addTo(osmMap)
                .bindPopup(location)
                .openPopup();
        });
}

// ----------------------
// View Map Button
// ----------------------
function onViewMapClicked() {

    const location =
        document.getElementById("uiLocations").value;

    if (!location) {
        alert("Select a location first");
        return;
    }

    updateMapWithLocation(location);
}

// ----------------------
// Load Everything
// ----------------------
window.onload = function () {

    onPageLoad();

    loadLeafletMap();
};