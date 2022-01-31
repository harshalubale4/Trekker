mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10', // style URL
    center: trekInfo.geometry.coordinates, // starting position [lng, lat]
    zoom: 13 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

const markerOfCity = new mapboxgl.Marker({ color: 'blue' })
    .setLngLat(trekInfo.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h4 class="text-black"> ${trekInfo.title}</h4><p class="text-black"> ${trekInfo.location}</p>`
            )
    )
    .addTo(map);