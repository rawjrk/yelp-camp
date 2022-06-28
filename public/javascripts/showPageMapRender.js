mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: campground.geometry.coordinates,
  zoom: 9,
  projection: 'equirectangular',
});

map.addControl(new mapboxgl.NavigationControl());

const markerPopup = new mapboxgl.Popup({ offset: 30 })
    .setHTML(campground.properties.popUpMarkupNoLink);

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(markerPopup)
    .addTo(map);
