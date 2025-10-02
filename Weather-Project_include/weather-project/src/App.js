import "./App.css";
import React, { useState} from "react";
import { useForm } from "react-hook-form";

function App() {

  const myForm = useForm();

  const [name, setname] = useState('Search Your City...');
  const [weatherData, setWeatherData] = useState(null); // State to hold fetched data once it is successfully fetched...

  function Delay(t) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res();
      }, t * 1000);
    });
  }

  // This the funtion making request for sending data to backend...
  async function onsubmit(input) {
    await Delay(2);
   try {
     let response = await fetch("http://localhost:4000/Search", {
       method:'POST',
       headers: { "Content-type": "application/json" },
       body: JSON.stringify(input),
     });

     if (response.ok) {
      const result = await response.json();
      console.log("Your Required weather Data :" , result);
      setWeatherData(result);
      
     } 
     else {
      console.log("Failed to fetch Weather Data");
     }
   } 
   catch (error) {
    console.log("An Error occured in making request:", error);
    
   }
  }

  return (
    <div>
      {/* This link contains CSS of bootstrap components... */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossorigin="anonymous"
      ></link>
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            WeatherAnalyzer
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#">
                  Home
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  Sign-Up
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link Hovering">Log-In</a>
              </li>
            </ul>
            <form
              onSubmit={myForm.handleSubmit(onsubmit)}
              class="d-flex"
              role="search"
            >
              <input
                class="form-control me-2"
                type="text"
                value={name}
                placeholder="Search"
                aria-label="Search"
                {...myForm.register("Search", {
                  required: {
                    value: true,
                    message: "This feild is neccessary for Data searching...",
                  },
                })}
                onChange={function handlechange(e) {
                  setname(e.target.value);
                }}
              />
              {myForm.formState.errors.Search && (
                <div className="Red">{myForm.errors.Search.message}</div>
              )}
              {myForm.formState.isSubmitting && <div>Loading Data...</div>}
              <button disabled={myForm.isSubmitting} class="btn btn-outline-success" type="submit" value="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>
      <main id="BG__">
        <h1>Weather for {name}</h1>
        <div className="Cards">
          <div className="Card C1">
            <h3>Temperature</h3>
            <h2>{weatherData ? `${weatherData.avgTemperature}°C` : '°C'}</h2>
             <ul>
               <li>Avg. Temperature : {weatherData ? `${weatherData.avgTemperature}°C` : ''}</li>
               <li>Min. Temperature : {weatherData ? `${weatherData.minTemperature}°C` : ''}</li>
               <li>Max. Temperature : {weatherData ? `${weatherData.maxTemperature}°C` : ''}</li>
               <li>Cloud: {weatherData ? `${weatherData.cloud.$numberDecimal}` : ''}</li>
             </ul>
          </div>
          <div className="Card C2">
            <h3>Humidity</h3>
            <h2>{weatherData ? `${weatherData.humidity}` : ''}%</h2>
            <ul>
              <li>Wind Degree :{weatherData ? `${weatherData.windDegree}`:''}</li>
              <li>Feels Like :{weatherData ? `${weatherData.feelsLike}`:''}</li>
              <li>Humidity :{weatherData ? `${weatherData.humidity}`:''}</li>
              <li>Wind Direction :{weatherData ? `${weatherData.windDirection}`:''}</li>
            </ul>
          </div>
          <div className="Card C3">
            <h3>Wind Info</h3>
            <h2>{weatherData ? `${weatherData.windSpeed.$numberDecimal}`:''} Km/hr</h2>
            <ul>
              <li>Wind Speed :{weatherData ? `${weatherData.windSpeed.$numberDecimal}`:''}</li>
              <li>Precipitaion(mm) : {weatherData ? `${weatherData.precipitation.$numberDecimal}`:''}</li>
              <li>Cloudyness: {weatherData ? `${weatherData.cloudiness}`:''}</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
