import './Date.css';
import React, { useEffect, useRef , useState } from 'react';
import { useLocation } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'; // Geocoder CSS
import axios from 'axios';

const Date = ({crushName , dotState}) => {
  const mapContainer = useRef(null);
  const targetElement = useRef();
  const location = useLocation() ;

  const [randomIndex, setRandomIndex] = useState(Math.floor(0 + 5 * Math.random())); // Initialize randomIndex state
  const [selectedoption, setselectedoption] = useState('select any one') ; // for selected hangout location...
  const [detailsArray, setdetailsArray] = useState([]); // for storing details array...
  const inputClass = useRef('mapboxgl-ctrl-geocoder--input');
  const accessToken = process.env.REACT_APP_MAPBOXGL_ACCESSTOKEN ;

  const crushCoordinates = JSON.parse(localStorage.getItem('crushCoordinates')); // pulling out crushCoordinates from the localstorage...

  // defining the coordinated to target...
  const latitudeToTarget = parseFloat(crushCoordinates["latitude"]) || parseFloat(28.6263) ;
  const longitudeToTarget = parseFloat(crushCoordinates["longitude"]) || parseFloat(77.2185);

  // initializing the random number generated...
  useEffect(() => {
    const intervalId = setInterval(() => {  
      const newRandomIndex = Math.floor(0 + 9 * Math.random());
      setRandomIndex(newRandomIndex); // Updating the state...
    }, 20 * 1000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);
  
   // hook for making scrollbar hidden...
   useEffect(() => {
    if (location.pathname === '/location-setter') document.getElementsByTagName('body')[0].style.overflowY = 'hidden' ;
   }, [])
   
  useEffect(() => {
    mapboxgl.accessToken = accessToken ;
    // Initialize the Mapbox map
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [ longitudeToTarget , latitudeToTarget  ], // Initial center [lng, lat]...
      zoom: 15, 
    })
    // .addControl(
    //   new mapboxgl.GeolocateControl({
    //     positionOptions: { enableHighAccuracy: true },
    //     trackUserLocation: true
    //   })
    // )
    new mapboxgl.Marker()
      .setLngLat([ longitudeToTarget , latitudeToTarget ])
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

  useEffect(() => {
    // for fetching the hangout location details...
    const fetchHangoutLocationDetails = async (latitude,longitude) => { 
      try {
        const response = await axios.post('/api/fetch/hangout-details',{latitude:latitude,longitude:longitude});
        if (response.status === 200) {
          const hangoutLocationDetails = response.data.infoArray ;
          setdetailsArray(hangoutLocationDetails);
        }
        console.log(`Error from Server : ${response.status} & ${response.statusText}`) ;
      } catch (error) {
        console.log("Some Error In Making Request for Hangout Details...")
      }
    }
    fetchHangoutLocationDetails(latitudeToTarget,longitudeToTarget);
  }, [])

  return (
    <div className='main_container'>
      <div className='left_container'>
        <div ref={mapContainer} style={{ height: '100%', width: '100%' }}></div>
      </div>
      <div className='right_container'>
       <div className="heading">let's pick the perfect spot for hangout !</div>
        <div className="text-content">
          <p>
          Hey there! So, I just whipped up this cool software that’s like a digital map adventure! 🌍✨ Picture this: I used some fancy tools to make it all work smoothly. I gathered coordinates to find the best hangout spots, just like a treasure hunt! 🗺️💖
          I even added a feature that lets you search for any place you fancy, like picking the perfect café or park for us! ☕🌳 Plus, I made sure it looks great with a stylish design. It’s like creating our own little world where we can explore together! 💫
          Trust me, it’s all about making our hangouts fun and exciting! Can’t wait to show you!And guess what? We can even mark our favorite spots and save them for future adventures! 🌟 Every time we explore, it’ll feel like we’re uncovering new treasures together. 🗝️💞 So, grab your adventurous spirit, and let’s make some unforgettable memories! 🎉 I’m super excited to embark on this journey with you! 🥳
          </p>
        </div>
        <div className="heading">places for hangout around your location...</div>
       <div className='lowerPart'>
        <select value={selectedoption} onChange={(e) => { setselectedoption(e.target.value) }}>
            <option value="disabledOne" disabled >select any one location...</option>
            <option value='Option_1'>Restraunt</option>
            <option value='Option_1'>Shopping Mall</option>
            <option value='Option_1'>Parks</option>
        </select>
        <div id='chooseText'>Choose the location that you like!</div>
        <div ref={targetElement} className="infoBox">
             <img src='https://th.bing.com/th?id=OIP.bdBy5JBcIbOQzZIRCEsAMwHaD5&w=344&h=181&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2' alt='img' />
             <div className="textInfo">
               <div><b>name/place :</b><p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Natus eligendi reiciendis tempora totam laborum fuga nobis eveniet libero dignissimos molestias.</p></div>
               <div><b>address :</b><p>address</p></div>
               <div><b>rating :</b><p>rating</p></div>
               <div><b>distance :</b><p>distance</p></div>
               <div><b>category :</b><p>categoryname</p></div>
               <div id='last'><span><b>Make a click on the Box :</b></span><p><input type="checkbox" /></p></div>
             </div>
        </div>
        {/* {detailsArray.length !== 0 && detailsArray.map((item, index) => (
           <div key={index + 1} ref={targetElement} className="infoBox">
             <img src={item.imgURLs[randomIndex]} alt='img' />
             <div className="textInfo">
               <div><strong>name/place :</strong><p>{item.name}</p></div>
               <div><strong>address :</strong><p>{item.address}</p></div>
               <div><strong>rating :</strong><p>{item.rating}</p></div>
               <div><strong>distance :</strong><p>{item.distance}</p></div>
               <div><strong>category :</strong><p>{item.category[0].name}</p></div>
               <div id='last'><span><strong>Make a click on the Box</strong></span><p><input type="checkbox" /></p></div>
             </div>
           </div>
        ))} */}
        <ul>
          <li><div id='statement'><strong>Let's Final Our Hangout Location</strong><span>?</span></div></li>
          <li><button>Done</button></li>
        </ul>
       </div>
      </div>
    </div>
  );
};

export default Date;
