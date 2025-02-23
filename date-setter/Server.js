require('dotenv').config() ;
const express = require('express');
const crushinfo = require('./Backend/crushModel.js') ;
const cors = require("cors") ;
const jsonWebToken = require('jsonwebtoken') ;
const nodeMailer = require('nodemailer') ;
const bcryptJS = require('bcryptjs');
const twilio = require('twilio') ;
const {Transform} = require('stream');
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

  // middleware for authenticating JWT for some routes...
const toauthenticateJWT = asyncErrorHandler(async (req, res) => {
  const token = req.cookies['crushCredentials']; // taking out the jwt token containing crush information...
  if (!token) return res.status(401).json({ message: 'Unauthorized request please register first...' });
  try {
      const decoded = jsonWebToken.verify(token, process.env.SECRET_FOR_JWT);
      req.crushDetails = decoded.payload ; // setting the payload to the user object...
  } catch (error) {
      console.log('JWT verification error:', error); // Debugging line
      return res.status(401).json({ message: 'Invalid token, please login again.' });
  }
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
      const userObject = userDoc.toObject();  // converting it into a object from object instance...
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
          return res.status(200).json({ message: "Girl already exists, and password is valid" });
      }
  }
  // Hash the new password and create a new crush document...
  const hashedPassword = await hashPassword(Password, 10);
  const newCrushDocument = new crushinfo({nameOfCrush: CuteName, Email: Email_Id,PhoneNumber: PhoneNumber,Password: hashedPassword,Location: serverStorage.crushLocation });

  await newCrushDocument.save(); // Save new document
  delete serverStorage.crushLocation; // Clean up location
  sendJwtCookie(res, newCrushDocument); // Send JWT cookie...
  res.status(200).json({ message: "Welcome to my software, sweetheart!" });
}));

// ednpoint for generating random images of ...
app.post('/api/generate_randomImages', asyncErrorHandler(async (req, res) => {
  const queryArray = ["Adore", "Affection", "Amour", "Angel", "Beloved", "Bliss", "Cherish", "Cupid", "Darling", "Desire", "Devotion", "Dream", "Embrace", "Endearment", "Euphoria", "Fairy", "Flame", "Fondness", "Forever", "Gaze", "Giggle", "Heart", "Honey", "Hope", "Hug", "Joy", "Kiss", "Laughter", "Lover", "Loving", "Magic", "Memories", "Moonlight", "Passion", "Promise", "Radiance", "Romance", "Rose", "Savor", "Secret", "Serenade", "Snuggle", "Soulmate", "Sparkle", "Sweetheart", "Tender", "Together", "Treasure", "Trust", "Twinkle", "Unity", "Valentine", "Warmth", "Whisper", "Wish", "Adoration", "Affectionate", "Allure", "Blossom", "Bond", "Cuddle", "Dewdrop", "Enchant", "Eternal", "Felicity", "Flourish", "Glimmer", "Heartfelt", "Happiness", "Intimacy", "Joyful", "Kismet", "Laughter", "Lullaby", "Magnetism", "Nurture", "Paradise", "Radiant", "Reverie", "Romantic", "Serenity", "Smitten", "Spark", "Sunshine", "Sweetness", "Tenderness", "Togetherness", "Tryst", "Utopia", "Vow", "Wanderlust", "Whimsy", "Yearn", "Zeal", "Zest"];
  const randomQueryIndex = Math.floor(0 + 99 * Math.random()) ;
  const response = await axios.get(`${process.env.UNSPLASH_BASE_URI}?query=${queryArray[randomQueryIndex]}&count=9`, {
      headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_API_KEY}`
      }
  }); 
  const images = response.data.map(image => image.urls.small); // Adjust the size as needed
  res.json({ data: images });
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

app.post('/api/fetch/hangout-details', toauthenticateJWT , asyncErrorHandler(async (req, res) => {
  const { latitude, longitude } = req.body;
  const { Location } = req.crushDetails ;
  const state = Location.state ;
  const state_district = Location.state_district ;
  console.log('Received Latitude and Longitude:', latitude, longitude); // Debugging step...
  console.log("Location of crush =>",Location);
  async function getHangoutInformation(lat, long) {
    try {
      const params = {
        at: `${lat},${long}`,
        limit: 20,
        radius: 6000, // 6 km radius
        sort: 'distance',
        q: `${process.env.RESTAURANT_CATEGORY},${process.env.PARK_CATEGORY},${process.env.MALL_CATEGORY},${process.env.BOOK_STORE_CATEGORY},${process.env.ZOO_CATEGORY},${process.env.CAFE_CATEGORY},hangoutPlaces,${state},${state_district}`,
        apiKey: process.env.HERE_MAP_APIKEY, // Add API key as a query parameter
      };
      const response = await axios.get('https://discover.search.hereapi.com/v1/discover', { params }); 

      // Check if the response contains the expected data
      if (response.status !== 200) {
        console.log("Error: API request failed with status", response.status);
        return res.status(500).json({ error: "Failed to fetch hangout information" });
      }

      if (!Array.isArray(response.data.items)) {
        console.log("Error: No items found in the response:", response.data);
        return res.status(500).json({ error: "No items found" });
      }

      // Process the data and fetch hangout details
     const hangoutDetailsArray = await Promise.all(response.data.items.map(async place => {
     const address = place.address || {};    // Extract address details
     const position = place.position || {};
    const randomIndex = place.categories.length > 0 ? Math.floor(Math.random() * (place.categories.length - 1)) : 0;
    let cuteImage = 'No image available'; // Default value in case of failure...
    try {
      const unplashResponse = await axios.get(`${process.env.UNSPLASH_BASE_URI}?query=${place.categories[randomIndex]}&count=1`,{
        headers: { Authorization: `Client-ID ${process.env.UNSPLASH_API_KEY}`}
      });
      cuteImage = unplashResponse.data[0].urls.small || cuteImage; // Use optional chaining...
    } catch (error) {
      console.log("Error in UNSPLASH image fetching logic =>",error.message);
    }

  // Construct the place details
  return {
    name: place.title || 'No name',
    address: address.label || 'No address provided',
    city: address.city || 'No city',
    state: address.state || 'No state',
    postal_code: address.postalCode || 'No postal code',
    country: address.countryName || 'No country',
    distance: place.distance || 0,
    categories: place.categories ? place.categories.map(category => category.name) : ['No category'],
    position: { lat: position.lat || 0, long: position.lng || 0 },
    imageURL: cuteImage,
    phone: place.contacts && place.contacts.length > 0 ? place.contacts[0].phone[0].value : 'No phone number',
    website: place.contacts && place.contacts.length > 0 ? place.contacts[0].www.map(link => link.value).join(", ") : 'No website',

  };
}));

    return hangoutDetailsArray;
     } catch (error) {
         console.error("Error fetching hangout information:", error.message);
         return res.status(500).json({ error: "Error fetching hangout details" });
     }
  }
  // Call the function to get hangout details based on latitude and longitude
  const hangoutDetailsArr = await getHangoutInformation(latitude, longitude);
  console.log('Hangout locations fetched => ',hangoutDetailsArr) ;
  res.status(200).json({infoArray:hangoutDetailsArr});  // Send the details in the response...
}));

app.post('/api/finalizing/mail', toauthenticateJWT, asyncErrorHandler(async (req, res) => {
  const { selectedPlace } = req.body;
  const { Email } = req.crushDetails;

  if (!selectedPlace || !Email) return res.status(400).send('Either Place or CrushDetails is missing...');
  console.log("Place selected by your crush =>", selectedPlace);
  console.log("Email Id =>", Email);

  delete selectedPlace.urls; // deleting the image url array...
  const transporter = nodeMailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.MY_MAILID,pass: process.env.MY_MAIL_PASSWORD }
  });
  const mailOptions = {
      from: process.env.MY_MAILID,
      to: Email,
      subject: 'Confirmation of Hangout with Amritansh',
      text: `Hey there ${Email}! 🎉\n\nGreat news! You've picked ${selectedPlace.name} for our hangout! 🥳\nLet’s chat about when we should go—just shoot me a text or give me a call whenever you're free!\n\nCan't wait to hang out! 😄\n\n🗺️ Location you choose: ${selectedPlace}`
  };

  await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.log("Error in sending the mail to crush =>", error);
              reject(error);
          } else {
              console.log("Mail sent successfully to crush =>", info);
              resolve(info);
          }
      });
  });

  // sending a mail to me...
  const mailOptionsToMe = {
      from: process.env.MY_MAILID,
      to: process.env.MY_MAILID,
      subject: 'Hangout Confirmed',
      text: `Hey there! 🎉Great news! \n\n Your crush with Details => ${req.crushDetails} \n
      Have selected Location for Hangout => ${selectedPlace}.\n
      Can't wait to hang out! 😄`
  };

  await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptionsToMe, (error, info) => {
          if (error) {
              console.log("Error in sending the mail to yourself =>", error);
              reject(error);
          } else
          console.log("Mail sent successfully to yourself =>", info);
          resolve(info)
      })
})
})) ;
app.post('/api/connect/socialMedia', toauthenticateJWT ,asyncErrorHandler(async (req,res) => { 
  const {Insta_ID ,FaceBook_ID ,Twitter_ID,crush_DOB} = req.body ;
  const { Email , Password , PhoneNumber} = req.crushDetails ; // extracting information setted by the JWT...
  console.log(req.body) // debugging step...
  var crushDocument = await crushinfo.findOne({Email: Email,PhoneNumber:PhoneNumber});
  const matched = await bcryptJS.compare(Password,crushDocument.Password) ;
  if(!matched) {
    console.log("You are not the user whose credentials are entered...");
    return res.status(401).json({message: "Please Enter your credentials only"}) ;
  }
  // updating the document with other credentials...
  crushDocument.Instagram_ID = Insta_ID ;
  crushDocument.FaceBook_ID = FaceBook_ID ;
  crushDocument.Twitter_ID = Twitter_ID ;
  crushDocument.DOB = crush_DOB ;
  await crushinfo.updateOne({Email: Email,PhoneNumber:PhoneNumber},crushDocument) ; // statement for updating...
  // No need to handle absence of crushDocument as it is authenticated by JWT...
  console.log("Updated crush document =>",crushDocument) ;  
  res.status(200).json({message: "Social Media IDs updated successfully!"});

}));

app.get('/api/crush/feedback', asyncErrorHandler(async (req,res) => { 
  const { responseText } = req.body ;
  console.log("Crush Response =>",responseText) ; // debugging step...
  // sending response on my phoneNumber...
  const client = new twilio(process.env.TWILIO_SID,process.env.TWILIO_AUTHTOKEN,{lazyLoading:true,maxRetries:2,autoRetry:true}) ;
  const message = await client.message.create({
    from: process.env.MY_PHONE_NUMBER ,
    to: process.env.MY_PHONE_NUMBER ,
    body: `Feedback of your crush on the software is ${responseText}`
  });
  console.log("Feedback sent to me =>",message.sid) ;
  res.status(200).json({message: "Feedback sent successfully to your PhoneNumber!"});
 }))

app.listen(port, () => {
  console.log(`Date-Setter application is listening on port ${port}`)
})