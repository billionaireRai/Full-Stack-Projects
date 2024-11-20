require("dotenv").config(); // It loads all environment variables in this file...
const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer') ;
const twilio = require('twilio') ;
const otpgenerator = require('otp-generator') ;
const bcrypt = require("bcryptjs");
const UserData = require('./Backend/models/Userschema');

const app = express();
const port = 4000;

// Using this OBJ for temporary storage of data...
let ServerStorage = {} ;

// My sensitive credentials fethed from the .env environment...
const API_KEY = process.env.googlemapsAPI_KEY;  // I just need to put googlemaps API here and thee project is completed...
const MY_MAIL = process.env.mymail ;
const MY_MAIL_PASSWORD = process.env.mymailpassword ;

const SID_TWILLIO = process.env.twillio_SID ;
const AUTHTOKEN_TWILLIO = process.env.twillio_AUTHTOKEN ;
const phonenumber_TWILLIO = process.env.twillio_PhNo ;

// Now I'll be handling the database dynamically form the server itself...
mongoose.connect('mongodb://localhost:27017/Geolocator',{ useNewUrlparser:true , useUnifiedTopology:true }) ;

// This line signifies the connection of Geolocator database...
const db = mongoose.connection ;

db.once('open', async () => { 
  console.log('Successfully connected to MongoDB...');
   // Check if collection exists, if not, create it...
   const collectionExists = await mongoose.connection.db.listCollections({ name: 'userdatas' }).hasNext() ;
   if (!collectionExists) {
       await mongoose.connection.createCollection('userdatas');
       console.log('Collection created...');
   }
 });

// Middleware for error handling
const asyncErrorHandler = (func) => {
  return (req, res, next) => {
    func(req, res,next).catch((err) => next(err));
  };
};

// Error handling middleware
app.use((error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  res.status(error.statusCode).json({ status: error.statusCode, message: error.message });
});

// Other middlewares
app.use(bodyParser.urlencoded({extended:true})) ;
app.use(cors());
app.use(bodyParser.json());

// our Request handlers
app.post("/UserInfo" , asyncErrorHandler(async (req, res) => {
    const { PhoneNo_1, PhoneNo_2 } = req.body;
    console.log(req.body);
    const APIURL_1 = `https://maps.googleapis.com/maps/api/place/findplacefromphone?input=+${encodeURIComponent(PhoneNo_1)}&inputtype=phonenumber&key=${API_KEY}`;
    const APIURL_2 = `https://maps.googleapis.com/maps/api/place/findplacefromphone?input=+${encodeURIComponent(PhoneNo_2)}&inputtype=phonenumber&key=${API_KEY}`;

    // Dynamic import of node-fetch for backend use of fetch() function...
    import('node-fetch').then( async (module) => {
        const fetch = module.default ;
        // fetching place_id first for both phone numbers...
        const response_1 = await fetch(APIURL_1);
        const response_2 = await fetch(APIURL_2);
        if (!response_1.ok || !response_2.ok) {
            throw new Error(`HTTP error ! STATUS : ${response_1.status || response_2.status}`)
        } else {
            const data_1 = await response_1.json() ;
            const data_2 = await response_2.json() ;
            if (data_1.status === 'OK' && data_1.candidates.length > 0 && data_2.status === 'OK' && data_2.candidates.length > 0 ) {
                const  Place_Id_1 = data_1.candidates[0].place_id ;
                const  Place_Id_2 = data_2.candidates[0].place_id ;
                const placedetails_1 = await getPlaceDetails(Place_Id_1) ;
                const placedetails_2 = await getPlaceDetails(Place_Id_2) ;

                // Using above made function for distance calculation...
                let location_1Coords = `${placedetails_1.geometry.location.lat},${placedetails_1.geometry.location.lng}` ;
                let location_2Coords = `${placedetails_2.geometry.location.lat},${placedetails_2.geometry.location.lng}` ;
                const distance = await getDistancebetweenCoords(location_1Coords,location_2Coords) ;
                console.log("Distance in Meters :",`${distance}`) ;
                console.log("Distance in Kilometer :" `${distance}/1000`) ;       

                return distance ;
           }else{
            throw new Error('No place found for these phone numbers...')
           }
        }
        // fetching placedeatils for both phone numbers...
        async function getPlaceDetails(placeid) {
            const APIURL_3 = `https://places.googleapis.com/v1/places/placeid=${encodeURIComponent(placeid)}?fields=id,name,formatted_address,geometry,types&key=${API_KEY}`;
            const Detailresponse = await fetch(APIURL_3) ;
            if (!Detailresponse.ok) {
                throw new Error(`HTTP error ! STATUS : ${Detailresponse.status}`)
            } else {
                const Details = await Detailresponse.json() ;
                console.log("Place Details :",Details);
            }
            return Details ;    // final output returned
        }
        // Each coord indivisually is a PAIR...
        async function getDistancebetweenCoords(Coord_1,Coord_2){  
            const APIURL_4 = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${Coord_1}&destinations=${Coord_2}&key=${API_KEY}`;

            const distanceData = await fetch(APIURL_4) ;
            if (distanceData.data.status !== 'OK') {
                throw new Error('Failed to fetch distance matrix data...')
            } else {
                const distance = distanceData.data.rows[0].element[0].distance.value ;
                const distanceText = distanceData.data.rows[0].element[0].distance.text ;

                console.log(`Distance between the coordinates ${Coord_1} and ${Coord_2} : ${distanceText}`) ;
                return distance ;
            }
        }
     })
  })
);

app.post("/SignInfo", asyncErrorHandler(async (req, res) => {
  const {email,password,phonenumber} = req.body ;
  console.log(req.body) ;
  async function HashPassword(Password) {
    let saltround = 10 ;
    const hashed_PW = await bcrypt.hash(Password,saltround) ;
    return hashed_PW ;  
  }
  HashPassword(password).then( async (hashed) => { 
    if (hashed) {
      const newcustomer = new UserData({ EmailId:email , Password:hashed , PhoneNumber:phonenumber })
      const savedcustomer = await newcustomer.save() ;
      res.json(savedcustomer) ;
    } else {
      console.log('error in hashing password...')
      res.json({message:'error in hashing password'}) ;
    }
   })
}));

app.post("/LogInfo", asyncErrorHandler(async (req, res) => {
  const {email,password,phonenumber} = req.body ;
  let required_customer = await UserData.findOne({EmailId:email}) ;
  async function VerifyPassword(Password,HashedPassword) {
    const ismatch = await bcrypt.compare(Password,HashedPassword) ;
    return ismatch ;
  }
  VerifyPassword(password,required_customer.Password).then((ismatch) => { 
    if ( ismatch && parseInt(phonenumber) === parseInt(required_customer.PhoneNumber) ) {
      console.log('Authentication Successfully Completed...',required_customer) ;
      res.status(200).send(required_customer) ;
    } else {
      console.log('Authentication Failed...');
      res.send('Please Enter Correct User Credentials...');
    }
   })
}));

app.post("/sendotp", asyncErrorHandler(async (req, res) => {
  let { credential } = req.body;
  let isEmail = false;
  let CorrectCredential;

  // Check if credential is in email format...
  if (credential.includes('@')) {
    CorrectCredential = credential; // Use email directly
    isEmail = true;
  } else {
    CorrectCredential = credential ;
  }

  // Generating OTP for 2-Factor Authentication...
  const GeneratedOtp = otpgenerator.generate(6, { upperCaseAlphabets: false, specialChars: true, lowerCaseAlphabets: true });

  if (isEmail) {
    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: MY_MAIL,
        pass: MY_MAIL_PASSWORD
      }
    });
    const mailOptions = {
      from: MY_MAIL,
      to: CorrectCredential,
      subject: 'OTP for Twilio Password Formatting',
      text: `Here is your Twilio Password Formatting OTP (2 Factor Authentication) : ${GeneratedOtp}`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response , mailOptions.text);

    // Store data to ServerStorage...
    ServerStorage.generatedotp = GeneratedOtp;
    ServerStorage.basedetail = CorrectCredential; // Store email directly

    res.status(200).send('OTP sent successfully via email.');
  } else {
    // Send OTP via Twilio for phone number
    const client = new twilio(SID_TWILLIO, AUTHTOKEN_TWILLIO, { lazyLoading: true, maxRetries: 2, autoRetry: true });

    // Send SMS using Twilio
    const message = await client.messages.create({
      to: CorrectCredential,
      from: phonenumber_TWILLIO,
      body: `Here is your Twilio Password Formatting OTP Based on (2 Factor Authentication): ${GeneratedOtp}`
    });
    console.log('Message sent successfully:', message.body);

    // Store data to ServerStorage...
    ServerStorage.generatedotp = GeneratedOtp;
    ServerStorage.basedetail = CorrectCredential; // Store phone number directly

    res.status(200).send('OTP sent successfully via SMS.');
  }
}));



// In this request handler if response will be positive automatically the screen will scroll...
app.post("/enterotp", asyncErrorHandler(async (req, res) => {
  const {OTP} = req.body ;
  if ( OTP === ServerStorage.generatedotp) {
    console.log("OTP successfully Verified...");
    res.status(200).send('Your account is successfully verified...');
  } else {
    console.log('OTP Mismatched !');
    res.status(404).send('OTP Mismatched , please check it carefully...');
  }
}));

// In this request handler we will be resetting the password of a paticular account...
app.post("/reseting", asyncErrorHandler(async (req, res) => {
  const { Password } = req.body ; 
  let saltround = 10;
  const hasshedone = await bcrypt.hash(Password, saltround);

  console.log(ServerStorage.basedetail , typeof ServerStorage.basedetail) ;
  // Find and update the user document...
  const dbData = await UserData.findOneAndUpdate(
    { $or: [{ EmailId: ServerStorage.basedetail },{PhoneNumber:ServerStorage.basedetail}] },
    { $set: { Password:hasshedone } },
    { new:true },    // This option ensures findOneAndUpdate returns the (updated document)...
  );
  // handling the updation response...
  if (dbData) {
    console.log('Password Successfully updated and saved:', dbData);
    res.status(200).send('Password Formatting Successful...');
  } else {
    console.log('Error: User not found or no document updated');
    res.status(404).send("An error occurred in Password formatting process...");
  }
}));


app.listen(port, () => {
  console.log(`Geolocators Server is listening on port ${port}`);
});

