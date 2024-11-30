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
  const neccessaryCollections = ['crushinfo'] ; // creating the collections dynamically...
  let availableCollections = (await db.db.listCollections().toArray()).map(collecn => collecn.name) ;
  for(let collection of neccessaryCollections){
    if (!availableCollections.includes(collection)){
      await db.db.createCollection(collection);
      console.log(`Collection with name ${collection} is created...`);
    }
  }
})

app.get('/api/generate_randomImages', asyncErrorHandler( async (req, res) => {
    // Define the Unsplash search API URL...
    const API_URL = 'https://api.unsplash.com/search/photos/';
    const randomIndex = Math.floor(0 + 49 * Math.random()) ; // generating random number between 0 - 49 ...
    const queryForImages = ["You are my today and all of my tomorrows.","Love is not about how many days, months, or years you’ve been together. Love is about how much you love each other every single day.","I am yours, don’t give myself back to me.","You make my heart skip a beat.","Together is a wonderful place to be.","Love is the closest thing we have to magic.","Every love story is beautiful, but ours is my favorite.","In your smile, I see something more beautiful than the stars.","Love is a song that never ends.","You are my sun, my moon, and all my stars.","True love is not about perfection, it is hidden in the flaws.","When I saw you, I fell in love, and you smiled because you knew.","I found my home and my heart in you.","Love is not about possession, it's about appreciation.","With you, forever isn’t long enough.","I would rather spend one moment holding you than a lifetime knowing I never could.","Love is when the other person's happiness is more important than your own.","You make my heart smile.","I love you more than words can express.","You’re the one I want to spend my life with.","In your eyes, I find the reason to live.","To love and be loved is to feel the sun from both sides.","Where there is love, there is life.","My heart is perfect because you are inside.","Love isn’t something you find. Love is something that finds you.","When I’m with you, I don’t need anything else.","You are my greatest adventure.","You are the love I never knew I needed.","Your love is all I need to feel complete.","I am endlessly, unconditionally, and totally in love with you.","There’s no remedy for love, but to love more.","The best thing to hold onto in life is each other.","Every moment with you is a moment I cherish.","You are my favorite hello and my hardest goodbye.","You had me at hello.","I love you more than yesterday, but less than tomorrow.","To love is to be transformed.","You are my forever and always.","If I had a flower for every time I thought of you, I could walk in my garden forever.","You complete me in ways I didn’t know were possible.","Love looks not with the eyes, but with the heart.","You are the peanut butter to my jelly.","Love is composed of a single soul inhabiting two bodies.","I still fall in love with you every day.","You had me at 'hello'.","No matter where I go, my heart will always belong to you.","You’re the reason I smile every day.",
"Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.","I love you, not only for what you are but for what I am when I am with you.","Love is a friendship set to music.","You are the melody that fills my heart.","You are the rhythm that makes me whole.","Love for my crush..."
];
    const response = await axios.get(API_URL,{
            params:{
                client_id: process.env.UNSPLASH_API_KEY,
                query: queryForImages[randomIndex], 
                orientation: 'landscape', 
                per_page: 9 }
            })
    let imageArray = response.data.results.map(element =>  element.urls.small ); 
    res.status(200).json({message:'Images successfully generated',data:imageArray}); // sending the image url in the response...
})) ;

app.post('/api/crush/information',asyncErrorHandler( async (req, res) => {
  const {CuteName , Email_Id , PhoneNumber , Password} = req.body ; // destructuring the data coming in request body...
  console.log(req.body);
  // function to Hass the password...
  const funcToHass = async (password,saltRounds) => {
    const hasshed = await bcryptJS.hash(password, saltRounds);
    return hasshed;
  }
  // function to verify the hass password...
  const verifyHass = async (toCompare,fromCompare) => {
    const isMatch = await bcryptJS.compare(toCompare,fromCompare);
    return isMatch;
  }
  // function to automate JWT work...
  const encodedAndSendCookie = (res, userDoc) => {
    const encodedToken = jsonWebToken.sign(userDoc, process.env.SECRET_FOR_JWT , {algorithm: 'ES384',expiresIn: '1h',allowInsecureKeySizes: false});
    res.cookie('crushCredentials', encodedToken, { httpOnly: true, maxAge: 3600000, secure: false, sameSite: 'strict'});

};
  // checking if this girl already exists...
  const existingGirl = await crushinfo.findOne({Email_Id:Email_Id ,PhoneNumber:PhoneNumber}) ;
  if(verifyHass(Password,existingGirl.Password)) {
    console.log("This Girl has Already Used this SOFTWARE...") ;
    existingGirl.Location = serverStorage.crushLocation ; // pushing the crush location...
    existingGirl.save() ;
    delete serverStorage.crushLocation ;
    encodedAndSendCookie(res, existingGirl); // calling a function...
    return ;  // to stop further execution...
}
  const hasshedPswd = await funcToHass(Password,10) ;
  const crushDocument = new crushinfo({CuteName, Email_Id, PhoneNumber, Password:hasshedPswd , Location:serverStorage.crushLocation }) // creating a new crush doc. in collection...
  await crushDocument.save() ;
  delete serverStorage.crushLocation ; // deleting the temporarily stored location in serverStorage...
  encodedAndSendCookie(res, crushDocument); // calling a function...
  res.status(200).json({message:"Welcome to my software, sweetheart!"}) ;
}))

// endpoint for handling the crush coordinates...
app.post('/api/crush/location',asyncErrorHandler( async (req, res) => {
  const {latitude,longitude} = req.body ; // taking out latitude and longitude from request body...
  console.log(latitude , longitude) ;
  async function getTextLocation(LATITUDE,LONGITUDE) {
    const GEOCODING_URI = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(LATITUDE)}%2C${encodeURIComponent(LONGITUDE)}&key=${process.env.GEOCODING_API_KEY}`;
    const response = await axios.get(GEOCODING_URI); // making request to API...
    const location = response.data.results[0].components; // getting the location from response...
    serverStorage.crushLocation = location ;
  }
  getTextLocation(latitude,longitude) ; // calling the function...
  res.status(200).json({message:"Location successfully updated"}); 
}));

app.listen(port, () => {
  console.log(`Date-Setter application is listening on port ${port}`)
})