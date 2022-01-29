mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10', // style URL
    center: trekSpotInfo.info.geometry.coordinates, // starting position [lng, lat]
    zoom: 13 // starting zoom
});

const markerOfCity = new mapboxgl.Marker({ color: 'black', rotation: 45 })
    .setLngLat(trekSpotInfo.info.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3> ${trekSpotInfo.info.title}</h3><p> ${trekSpotInfo.info.location}</p>`
            )
    )
    .addTo(map);

map.addControl(new mapboxgl.NavigationControl());