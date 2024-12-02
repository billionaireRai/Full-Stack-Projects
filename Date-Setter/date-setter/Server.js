require('dotenv').config() ;
const express = require('express');
const crushinfo = require('./Backend/crushModel.js') ;
const cors = require("cors") ;
const jsonWebToken = require('jsonwebtoken') ;
const bcryptJS = require('bcryptjs');
const session = require('express-session');
const mongoose = require('mongoose');
const generateOtp = require('otp-generator'); 
const cookieparser = require('cookie-parser');
const axios = require('axios');

const app = express() ;
const port = 7070 ;

var serverStorage = {} ;

// function for handling error in all the request handlers...
const asyncErrorHandler = (func) => {
    return (req, res, next) => { func(req, res,next).catch((err) => next(err)) };
  };
  
// asyncerror handler will pass control to this middleware...
app.use((error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";
    console.log(`The error statusCode : ${error.statusCode} , error status : ${error.status}  & Text ${error.message}`);
    res.status(error.statusCode).json({ status: error.statusCode, message: error.message });
  });

app.use(cookieparser());
app.use(cors({
    origin: "http://localhost:3000",
    methods: '*',
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}))
app.use(express.json({limit:'16kb'}));
app.use(session({
    secret: process.env.SECRET_FOR_SESSION,
    resave: false,
    saveUninitialized: true,
}))
app.use(express.urlencoded({extended:true , limit:'16kb'}))

// database connection logic...
mongoose.connect(process.env.MONGO_DB_URL,{autoCreate:false,autoIndex:false,bufferCommands:true})
mongoose.set('debug',true) ;

const db = mongoose.connection ;
db.on('error', () => {console.log('Error in the connection string to DB...') });
db.once('open' , async () => {
  console.log('Successfully Connected to the DB...');
  const neccessaryCollections = ['crushinfos'] ; // creating the collections dynamically...
  let availableCollections = (await db.db.listCollections().toArray()).map(collecn => collecn.name) ;
  for(let collection of neccessaryCollections){
    if (!availableCollections.includes(collection)){
      await db.db.createCollection(collection);
      console.log(`Collection with name ${collection} is created...`);
    }
  }
})

app.post('/api/crush/information', asyncErrorHandler(async (req, res) => {
  const { CuteName, Email_Id, PhoneNumber, Password } = req.body; // Use Email_Id consistently
  // Function to hash the password
  const hashPassword = async (password, saltRounds) => {
      return await bcryptJS.hash(password, saltRounds);
  };
  // Function to verify the hashed password
  const verifyPassword = async (inputPassword, storedPassword) => {
      return await bcryptJS.compare(inputPassword, storedPassword);
  };
  // Function to create and send a JWT cookie
  const sendJwtCookie = (res, userDoc) => {
      const userObject = userDoc.toObject();
      const token = jsonWebToken.sign(userObject, process.env.SECRET_FOR_JWT, { expiresIn: '1h' });
      res.cookie('crushCredentials', token, { httpOnly: true, maxAge: 3600000, secure: false, sameSite: 'strict' });
  };

  // Check if the user already exists
  const existingGirl = await crushinfo.findOne({ Email: Email_Id, PhoneNumber }); // Use Email_Id consistently
  if (existingGirl) {
      const isPasswordValid = await verifyPassword(Password, existingGirl.Password); // Password verification...
      if (isPasswordValid) {
          console.log("This Girl has Already Used this SOFTWARE...");
          existingGirl.Location = serverStorage.crushLocation; // Update location
          await existingGirl.save(); // Save updated document
          delete serverStorage.crushLocation; // Clean up location
          sendJwtCookie(res, existingGirl); // Send JWT cookie
          return; // Stop further execution
      }
  }
  // Hash the new password and create a new crush document...
  const hashedPassword = await hashPassword(Password, 10);
  const newCrushDocument = new crushinfo({nameOfCrush: CuteName, Email: Email_Id,PhoneNumber: PhoneNumber,Password: hashedPassword,Location: serverStorage.crushLocation });

  await newCrushDocument.save(); // Save new document
  delete serverStorage.crushLocation; // Clean up location
  sendJwtCookie(res, newCrushDocument); // Send JWT cookie
  res.status(200).json({ message: "Welcome to my software, sweetheart!" });
}));

// endpoint for handling the crush coordinates...
app.post('/api/crush/location',asyncErrorHandler( async (req, res) => {
  const {latitude,longitude} = req.body ; // taking out latitude and longitude from request body...
  console.log(latitude , longitude) ;
  async function getTextLocation(LATITUDE,LONGITUDE) {
    const GEOCODING_URI = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(LATITUDE)}%2C${encodeURIComponent(LONGITUDE)}&key=${process.env.GEOCODING_API_KEY}`;
    const response = await axios.get(GEOCODING_URI); // making request to API...
    const location = response.data.results[0].components; // getting the location from response...
    serverStorage.crushLocation = location ;
    console.log(serverStorage) ; // debugging step for location fixing...
  }
  getTextLocation(latitude,longitude) ; // calling the function...
  res.status(200).json({message:"Location successfully updated"}); 
}));

app.post('/api/fetch/hangout-details', asyncErrorHandler(async (req, res) => {
  const { latitude, longitude } = req.body;
  async function getHangoutInformation(lat, long) {
    const uriToRequest = `https://api.foursquare.com/v3/places/search?ll=${encodeURIComponent(lat)},${encodeURIComponent(long)}&radius=${encodeURIComponent(6000)}&query=hangout&categories=${encodeURIComponent(process.env.RESTRAUNT_CODE)},${encodeURIComponent(process.env.MALL_CODE)},${encodeURIComponent(process.env.PARK_CODE)},limit=20`;
    // Fetch the initial hangout details
    const response = await axios.get(uriToRequest,{maxContentLength:8000 , headers:{ Authorization: `Bearer ${process.env.FOURSQUARE_API_KEY}`}}); 
    const hangoutDetails = response.data.results;
    // Function to fetch up to 10 photos for a given place
    const getPictures = async (fsq_id) => {
      const urlForPictures = `https://api.foursquare.com/v3/places/${encodeURIComponent(parseInt(fsq_id))}/photos?limit=5`;  
      try {
        const responseForPictures = await axios.get(urlForPictures,{ maxContentLength:8000 ,headers:{ Authorization: `Bearer ${process.env.FOURSQUARE_API_KEY}`}});
        const photos = responseForPictures.data.results;
        return photos.map(photo => `${photo.prefix}${photo.suffix}`);  // Return array of image URLs
      } catch (error) {
        console.error(`Error fetching photos for fsq_id ${fsq_id}: `, error);
        return [];   // returning empty array if some error occurs...
      }
    };

    // Use Promise.all to fetch hangout details and images concurrently
    const hangoutDetailsArray = await Promise.all(hangoutDetails.map(async (hangout) => {
      const imgURLs = await getPictures(hangout.fsq_id);  // Get up to 10 images
      return { name: hangout.name, address: hangout.location, rating: hangout.rating, distance: hangout.distance, category: hangout.categories,
        urls: imgURLs,  // Store the array of image URLs
      };
    }));

    return hangoutDetailsArray ;
  }
  // Fetch and return the hangout details
  const hangoutDetailsArr = await getHangoutInformation(latitude, longitude);
  console.log(hangoutDetailsArr);
  res.status(200).json({ message: "Hangout details successfully fetched", infoArray: hangoutDetailsArr }); // sending response...
}));

// final structure of returned entity...
// {
//   "message": "Hangout details successfully fetched",
//   "infoArray": [
//     {
//       "name": "Hangout Place Name 1",
//       "address": {
//         "formatted_address": "123 Example St, City, Country",
//         "cross_street": "Near Example Cross Street",
//         "postal_code": "12345",
//         "city": "City",
//         "state": "State",
//         "country": "Country"
//       },
//       "rating": 4.5,
//       "distance": 1200,
//       "category": [
//         {
//           "id": "category_id",
//           "name": "Category Name"
//         }
//       ],
//       "urls": [
//         "https://example.com/photo1.jpg",
//         "https://example.com/photo2.jpg",
//         "https://example.com/photo3.jpg",
//         "https://example.com/photo4.jpg",
//         "https://example.com/photo5.jpg"
//       ]
//     },
//     {
//       "name": "Hangout Place Name 2",
//       "address": {
//         "formatted_address": "456 Another St, City, Country",
//         "cross_street": "Near Another Cross Street",
//         "postal_code": "67890",
//         "city": "City",
//         "state": "State",
//         "country": "Country"
//       },
//       "rating": 4.0,
//       "distance": 800,
//       "category": [
//         {
//           "id": "category_id",
//           "name": "Category Name"
//         }
//       ],
//       "urls": [
//         "https://example.com/photo1.jpg",
//         "https://example.com/photo2.jpg"
//       ]
//     }
//     // More hangout places can follow...
//   ]
// }


app.post('apiurl', asyncErrorHandler(async (req,res) => {
  
}));

app.listen(port, () => {
  console.log(`Date-Setter application is listening on port ${port}`)
})