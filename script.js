//user submit->
document.getElementById('business-submit').addEventListener('click', (event) => {
    event.preventDefault()
    let selectedBusiness = document.getElementById('business-select').value
    getFoursquareBusinesses(selectedBusiness)
})

//user position
async function getCoords() {
    let pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    })
    return [pos.coords.latitude, pos.coords.longitude]
}

//leaflet map
const businessMap = {
    map: {},
    userCoords: [48.868672, 2.342130],
    construct: function() {
        this.map = L.map('map', {
            center: this.userCoords,
            zoom: 12
        })
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map)
        const marker = L.marker(this.userCoords,{icon: redPin})
        marker.addTo(this.map).bindPopup('<b>Current Location</b>').openPopup()
    },
}

//foursquare 
async function getFoursquareBusinesses(business) {
    const options = {
        method: 'GET',
        headers: {accept: 'application/json', Authorization: 'fsq3okpTp3S6RmdzueZPU4R7LpIeDvV+FFjtz61gXSJS7ME='}
    };

    let response = await fetch(`https://api.foursquare.com/v3/places/search?query=${business}&ll=${businessMap.userCoords[0]}%2C${businessMap.userCoords[1]}&limit=5`, options)
    let jsonResponse = await response.json()
    let businessesResults = jsonResponse.results
    businessesResults.forEach((business) => {
        const marker = L.marker([business.geocodes.main.latitude, business.geocodes.main.longitude])

        marker.addTo(businessMap.map).bindPopup(`<b>${business.name}</b>`)
    })
}

// //onload first version
window.onload = async () => {
    const userCoords = await getCoords()
    businessMap.userCoords = userCoords
    businessMap.construct()
}

// //instructor provided onload
// window.onload = async () => {
//     const coords = await getCoords();
//     console.log(coords);
//     businessMap.coords = coords;
//     businessMap.buildMap();
// }

//onclick highlight area clicked - needs work
var mapClickPopup = L.popup();
businessMap.map.on('click', (e) => {
    console.log(e);
    mapClickPopup.setLatLng(e.latlng)
        .setContent(`<div class="popup" onclick="closeAllPopups()">You clicked the map at:<br>${e.latlng.toString()}</div>`)
        .openOn(businessMap.map);
});


//bonus - adds pin for user location
var redPin = L.icon({
    iconUrl: './assets/red-pin.png',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -33],
})