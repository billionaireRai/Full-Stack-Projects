import './Date.css';
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'; // Geocoder CSS

const Date = ({crushName , dotState}) => {
  const mapContainer = useRef(null);
  const inputClass = useRef('mapboxgl-ctrl-geocoder--input');
  const accessToken = process.env.REACT_APP_MAPBOXGL_ACCESSTOKEN ;

  const crushCoordinates = JSON.parse(localStorage.getItem('crushCoordinates')); // pulling out crushCoordinates from the localstorage...

  useEffect(() => {
    // Initialize the Mapbox map
    mapboxgl.accessToken = accessToken ;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10', // Choose a Mapbox style...
      center: [crushCoordinates.latitude || 0 , crushCoordinates.longitude || 0 ], // Initial center [lng, lat]
      zoom: 15, // default zoom given from MapBox...
    });

    new mapboxgl.Marker()
      .setLngLat([crushCoordinates.latitude || 0 , crushCoordinates.longitude || 0 ])
      .setPopup(new mapboxgl.Popup().setHTML(`You current location is this ${crushName}`)) // Popup content
      .addTo(map);

    // Initialize the Mapbox geocoder...
    const geocoder = new MapboxGeocoder({ mapboxgl: mapboxgl , accessToken:accessToken,autocomplete:true});
    map.addControl(geocoder); // Add geocoder control to the map...

    // Listen for the geocoder's 'load' event...
    geocoder.on('load', () => {
      const input = document.querySelector(`.${inputClass.current}`); 
      if (input) input.placeholder = `Search Any place You Like For Hangout ${dotState}`;

    });
    // Listen to geocode events when a location is selected after searching...
    geocoder.on('result', (e) => {
    const result = e.result;
      new mapboxgl.Marker()
        .setLngLat(result.center)
        .setPopup(new mapboxgl.Popup().setHTML(result.place_name))
        .addTo(map);
      map.flyTo({ center: result.center, zoom: 15 });
    });

    return () => map.remove(); // cleanup of map on unmount...
  }, []); 

  return (
    <div className='main_container'>
      <div className='left_container'>
        <div ref={mapContainer} style={{ height: '100%', width: '100%' }}></div>
      </div>
      <div className='right_container'></div>
    </div>
  );
};

export default Date;
