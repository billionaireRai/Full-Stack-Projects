require('dotenv').config() ;
const express = require('express');
const cors = require("cors") ;
const jsonWebToken = require('jsonwebtoken') ;
const bcryptJS = require('bcryptjs');
const session = require('express-session');
const generateOtp = require('otp-generator'); 
const cookieparser = require('cookie-parser');
const axios = require('axios');

const app = express() ;
const port = 7070 ;

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

app.get('/api/generate_randomImages', asyncErrorHandler( async (req, res) => {
    // Define the Unsplash search API URL...
    const API_URL = 'https://api.unsplash.com/search/photos/';
    const queryForImages = ["You are my today and all of my tomorrows.","Love is not about how many days, months, or years you’ve been together. Love is about how much you love each other every single day.","I am yours, don’t give myself back to me.","You make my heart skip a beat.","Together is a wonderful place to be.","Love is the closest thing we have to magic.","Every love story is beautiful, but ours is my favorite.","In your smile, I see something more beautiful than the stars.","Love is a song that never ends.","You are my sun, my moon, and all my stars.","True love is not about perfection, it is hidden in the flaws.","When I saw you, I fell in love, and you smiled because you knew.","I found my home and my heart in you.","Love is not about possession, it's about appreciation.","With you, forever isn’t long enough.","I would rather spend one moment holding you than a lifetime knowing I never could.","Love is when the other person's happiness is more important than your own.","You make my heart smile.","I love you more than words can express.","You’re the one I want to spend my life with.","In your eyes, I find the reason to live.","To love and be loved is to feel the sun from both sides.","Where there is love, there is life.","My heart is perfect because you are inside.","Love isn’t something you find. Love is something that finds you.","When I’m with you, I don’t need anything else.","You are my greatest adventure.","You are the love I never knew I needed.","Your love is all I need to feel complete.","I am endlessly, unconditionally, and totally in love with you.","There’s no remedy for love, but to love more.","The best thing to hold onto in life is each other.","Every moment with you is a moment I cherish.","You are my favorite hello and my hardest goodbye.","You had me at hello.","I love you more than yesterday, but less than tomorrow.","To love is to be transformed.","You are my forever and always.","If I had a flower for every time I thought of you, I could walk in my garden forever.","You complete me in ways I didn’t know were possible.","Love looks not with the eyes, but with the heart.","You are the peanut butter to my jelly.","Love is composed of a single soul inhabiting two bodies.","I still fall in love with you every day.","You had me at 'hello'.","No matter where I go, my heart will always belong to you.","You’re the reason I smile every day.",
"Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.","I love you, not only for what you are but for what I am when I am with you.","Love is a friendship set to music.","You are the melody that fills my heart.","You are the rhythm that makes me whole.","Love for my crush..."
];
    const response = await axios.get(API_URL,{
            params:{
                client_id: process.env.UNSPLASH_API_KEY,
                query: queryForImages, 
                orientation: 'landscape', 
                per_page: 9 }
            })
    let imageArray = response.data.results.map(element =>  element.urls.small ); 
    res.status(200).json({message:'Images successfully generated',data:imageArray}); // sending the image url in the response...
})) ;

app.post('/api/crush/information',asyncErrorHandler( async (req, res) => {
  const {CuteName , Email_Id , PhoneNumber , Password} = req.body ; // destructuring the data coming in request body...
  const funcToHass = async (password,saltRounds) => {
    const hasshed = await bcryptJS.hash(password, saltRounds);
    return hasshed;
  }
  const hasshedPswd = await funcToHass(Password,10);
}))

app.listen(port, () => {
  console.log(`Date-Setter application is listening on port ${port}`)
})