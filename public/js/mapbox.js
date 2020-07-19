export const mapDisplay = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZmF6aW1hbGlrIiwiYSI6ImNrY21ua2E3NDAzMXczMHF5YWV4ajRsaW8ifQ.bSDi98B_C9hkDTxKYm_AXA';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/fazimalik/ckcmo59u01tcq1imat6vvr7c6',
    scrollZoom: false,
    /*center: [-118.113491, 34.111745],
  zoom: 10,
  interactive: false,*/
  });
  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);
    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
