// This our express server for handling Backend logic...
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyparser = require("body-parser");
const weatherdatas = require("./backend/model/WeatherData");
// Use dynamic import() instead of require
// 'node-fetch' is used to use fetch() API in backend logic...

// 45eea65cd80340c18db111136242106 This is my API key

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyparser.json());

mongoose.connect("mongodb://localhost:27017/WeatherProject", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("Successfully connected to MongoDB...");
});

mongoose.set("debug", true);

// This is my code snippet for tailring the weather data coming from API and storing it in our database...

app.post("/Search", (req, res) => {
  const { Search } = req.body;
  console.log("The City Request :", req.body.Search);

  const ApiKey = "45eea65cd80340c18db111136242106";
  const city = encodeURIComponent(req.body.Search);   // Ensure city name is properly encoded for URL usage...

  const ApiUrl = `http://api.weatherapi.com/v1/current.json?key=${ApiKey}&q=${city}`;

  // Use dynamic import to load node-fetch
  import("node-fetch").then((module) => {const fetch = module.default ; 
    // Get the default export from the module...
      fetch(ApiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status:${response.status}`);
          }
          return response.json(); // Parse response body as JSON
        })
        .then( async (data) => {
          // Log the entire fetched data
          console.log("Data successfully fetched :", data);

          // Check if Required data keys exists or not and log it...
          let rd = data.current;
          if (rd.temp_c &&rd.condition.text && data.location.localtime && data.location.name && rd.dewpoint_c &&rd.heatindex_c &&rd.wind_kph &&rd.wind_degree &&rd.precip_mm &&rd.humidity && rd.wind_dir &&rd.feelslike_c && rd.cloud) {
            // Handling this bulky Data...
            let WeatherInfo = new weatherdatas({
              city:data.location.name,
              date:data.location.localtime,
              avgTemperature:rd.temp_c, 
              minTemperature:rd.dewpoint_c,
              maxTemperature: rd.heatindex_c,
              cloud:rd.cloud, 
              windDegree: rd.wind_degree,
              feelsLike: rd.feelslike_c,
              humidity: rd.humidity,
              windDirection: rd.wind_dir,
              windSpeed: rd.wind_kph,
              precipitation: rd.precip_mm,
              cloudiness: rd.condition.text
            });

             try {
              let savedata = await WeatherInfo.save();
              console.log("Weather data saved in Database:",savedata)
              res.status(200).json(savedata);  // This is sending savedata on frontend...
             } 
             catch (error) {
              console.log("Some error in saving Data:",error);
              res.send(error);
             }

            // Now lets export these Datas to frontend...

             
          } 
          else {
            console.log("Weather data not found in API response...");
            res.status(404).json({ error: "Weather data not found in API response..." });
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          res.status(500).json({ error: "Error fetching data from WeatherAPI" });
        });
    })
    .catch((error) => {
      console.error("Error importing node-fetch:", error);
      res.status(500).json({ error: "Error importing node-fetch module" });
    });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
