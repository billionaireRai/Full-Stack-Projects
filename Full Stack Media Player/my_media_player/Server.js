require('dotenv').config() ; // for loading the environment variables in our server...
const express = require('express');
const cookieParser = require('cookie-parser'); // for handling the cookies coming from the client...
const SpotifyWebApi = require('spotify-web-api-node'); // for controlling spotify data...
const axios = require('axios');
const cors = require('cors');
const WebSockets = require('ws'); // will be used for fetching the lyrics in chunks...
const lyricsFinder = require('lyrics-finder') ;
const Otp_Generator = require('otp-generator') ;
const twilio = require('twilio'); // for phone notifications...
const nodemailer = require('nodemailer'); // for mail functionality...
const bcrypt = require('bcryptjs');
const session = require('express-session');
const jsonWebToken = require('jsonwebtoken'); // for state management bteween the requests...
const passport = require('passport'); // Authentication middleware...
const mongoose = require('mongoose') ;
const GoogleStrategy = require('passport-google-oauth20').Strategy; // for making o-authentication request to google...
const GitHubStrategy = require('passport-github2').Strategy;
const twitterStrategy = require('passport-twitter').Strategy ;
const userinformation = require('./Backend/models/userModel.js') ;

const app = express(); 
const port = process.env.PRODUCTION_PORT || 4040; // pulling the backend port from .env file...

var tempStorage = {} ;

// middleware configurations...
app.use(express.json({limit:'16kb'})); // restriction and parsing of JSON requests...
app.use(express.urlencoded({ extended:true , limit:'16kb'}));  // for parsing Data coming in URL encoded format... 
app.use(cookieParser()); // for managing cookies...
app.use(cors({ origin: 'http://localhost:3000', credentials: true, methods:'*' }));

app.use(session({
    secret: process.env.SECRET_FOR_JWT,
    resave: false,
    saveUninitialized: false,
    cookie: {
         secure: false
    }
}))
const cookieConditions = { 
    httpOnly: true,   // Prevents JavaScript access to the cookie on client side
    secure: false, // will be able to send cookie over HTTP...
    maxAge: 3600000,  // expiration time (1 hour)
    sameSite: 'Strict' // cookie is sent only with requests to your domain
}

// function for handling error in all the request handlers...
const asyncErrorHandler = (func) => {
    return (req, res, next) => { func(req, res,next).catch((err) => next(err)) };
  };
  
// Error handling middleware...
app.use((error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";
    console.log(`The error statusCode : ${error.statusCode} , error status : ${error.status}  & Text ${error.message}`);
    res.status(error.statusCode).json({ status: error.statusCode, message: error.message });
  });

// middleware for authenticating JWT for some routes...
const toauthenticateJWT = asyncErrorHandler(async (req, res) => {
    const token = req.cookies['jwt'];
    console.log('Token:', token); // Debugging line...
    if (!token) return res.status(401).json({ message: 'Unauthorized request please signUp Or Login...' });

    try {
        const decoded = jsonWebToken.verify(token, process.env.SECRET_FOR_JWT);
        console.log('Decoded payload:', decoded); // Debugging line
        req.user = decoded.payload; // setting the payload to the user object...
    } catch (error) {
        console.log('JWT verification error:', error); // Debugging line
        return res.status(401).json({ message: 'Invalid token, please login again.' });
    }
});

// generalizing the function to hash the an Entity....
const forHasshing = async (EntityToHash) => {
    let salt = await bcrypt.genSalt(10) ;
    let hashed = await bcrypt.hash(EntityToHash , salt);
    return hashed ;
}

const toVerifyHassed = async (toCompare,fromCompare) => { 
   return await bcrypt.compare(toCompare,fromCompare)
    .then((bool_output) => { bool_output  })
    .catch((error) => { 
        console.log(`Error in Hassh Validation proccess : ${error}`) 
        return false ;
    })
}
 // A function to generate secrets....
function toGenerateSecret(length) {
    try {
        const secret = Otp_Generator.generate(length , { digits: true, specialChars: true, upperCaseAlphabets: true, lowerCaseAlphabets: true });
            return secret ;
    } catch (error) {
        console.error('An error occurred in generating secret:', error);
        throw error; // throws error in function call...
    }
}
 // console.log(toGenerateSecret(80));  // commented after generating the secret...

// Middleware configuration for O-authentication system...
app.use(passport.initialize()) ; // neccessary for triggering the passport middleware...
app.use(passport.session()) ;

// serialize basically decides portion of USER data is to be storeed in SESSION...
passport.serializeUser((done,user) => { 
    console.log("Serializing the user : ",user);
    done(null,user.id);
 })
// deserialize basically decides how to fetch the user data from session...
passport.deserializeUser((id,done) => {
    console.log("Deserializing the user with id : ",id);
    done(null,id);
});

// configurations for Google O-authentication...
passport.use(new GoogleStrategy({ clientID:process.env.GOOGLE_CLIENT_ID, clientSecret:process.env.GOOGLE_CLIENT_SECRET, callbackURL:process.env.GOOGLE_REDIRECT_URI , passReqToCallback :true }, asyncErrorHandler( async (accessToken, refreshToken, profile, callback) => {
    // user GOOGLE account credential manipulations...
        if (!profile)  console.log("User Google Profile not Existing...") ; // checking if profile exists....
        console.log(profile);
        let google_user = await userinformation.findOne({$where : { google_AuthID : profile.sub }}) ;
        if (google_user)  return callback(null,user); // login should be done here...
        // logic to save the user credentials in our DB...
            const hashedPassword = await forHasshing(10,profile.sub) ; 
            let NewUser = await userinformation.create({
                google_AuthID : profile.sub, Password_Hashed : hashedPassword, // hashed form of user google profile sub...
                UserName:profile.name , Email :profile.email,
                ProfilePicture : profile.picture ,
                Location: profile.locale,
                google_AuthToken : accessToken ,
                google_AuthRefreshToken : refreshToken ,
            }) ;
            await NewUser.save() ;
            console.log("New User successfully saved in our DataBase :",NewUser);
            return callback(null,NewUser);

})));

// configuration for Github o-authentication...
passport.use(new GitHubStrategy({clientID:process.env.GITHUB_CLIENT_ID , clientSecret:process.env.GITHUB_CLIENT_ID,callbackURL:process.env.GITHUB_REDIRECT_URI , passReqToCallback : true}, asyncErrorHandler( async (accessToken, refreshToken, profile, callback) => {
    // user GITHUB account credential manipulations...
        if (!profile) console.log("User Github profile not existing...") ;
        console.log(profile);
        let github_user = await userinformation.findOne({$where :{github_AuthID : (profile.id).concat(profile.node_id)}}) ;
        if (github_user) return callback(null,user) ; // if user is there retuning it...
        // logic to save the user credentials in our DB...
        const hashedPassword = await forHasshing(10,(profile.id).concat(profile.node_id)) ;
        let New_User = await userinformation.create({
            github_AuthID : (profile.id).concat(profile.node_id) ,
            Password_Hashed : hashedPassword ,
            UserName : profile.login ,
            Email : profile.email ,
            ProfilePicture : profile.avatar_url ,
            Location:profile.location ,
            github_AuthToken : accessToken ,
            github_AuthRefreshToken : refreshToken ,
        });
        await New_User.save() ;
        console.log("New_User successfully saved in our DataBase :",New_User);
        return callback(null,New_User);
})));

// configuration for Twitter o-authentication...
passport.use(new twitterStrategy({consumerKey:process.env.TWITTER_CLIENT_ID,consumerSecret:process.env.TWITTER_CLIENT_SECRET,
callbackURL:process.env.TWITTER_REDIRECT_URI , passReqToCallback:true},asyncErrorHandler(async (token, tokenSecret, profile, callback) => {
        // user Twitter account credential manipulations...
        if (!profile) console.log("User Twitter profile not existing...") ;
        console.log(profile);
        const USER = await userinformation.findOne({$where :{twitter_AuthID : profile.id}}) ;
        if (USER) return callback(null,USER) ;
        // forming new user in our database...
        const hashedPassword = await forHasshing(10,profile.id) ;
        let new_user = await userinformation.create({
            twitter_AuthID : profile.id ,
            Password_Hashed : hashedPassword ,
            UserName : profile.name ,
            Email : profile.url ,
            ProfilePicture : profile.profile_image_url ,
            Location : profile.location ,
            twitter_AuthToken : token ,
            twitter_AuthRefreshToken : tokenSecret ,
        });
        await new_user.save() ;
        console.log("New_User successfully saved in our DataBase :",new_user);
        return callback(null,new_user);
})));

// Dynamic database connection logic...
mongoose.connect(process.env.DATABASE_URL,{ autoIndex:false,autoCreate:false,bufferCommands:true }) ;
mongoose.set('debug',true) ; // Allows DB queries running in backend to be visible in terminal...
const db = mongoose.connection ;
db.on('error', (error) => { 
    console.log('Error in connecting server to database !!! ',error);
 })
db.once('open', async () => { 
    console.log('connected to mongoDB Successfully...');
    const requiredCollections = ['userinformations'] ; //  Dynamic collections creation...
    let availableCollections = (await db.db.listCollections().toArray()).map(collec => collec.name) ;
    for (let i = 0; i < requiredCollections.length; i++) {
        if (!availableCollections.includes(requiredCollections[i])) {
            await db.db.createCollection(requiredCollections[i]);
            console.log(`Created the collection ${requiredCollections[i]}...`);
        }
    }
 })


// This route is to STARTS the O-auth proccess by TRIGGERING passport middleware...
const createAuthRoute = () => { 
    app.get('/auth/Provider/:provider', asyncErrorHandler( async (req, res,next) => {
      const { provider } = req.params; // taking out the provider category...
      passport.authenticate(provider, { scope: ['openid','email', 'profile'] })(req,res,next); // Trigerring the passport middleware...
      console.log(`Passport middleware is TRIGGERED with ${provider} provider...`);
    //   res.redirect('https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A4040%2Fauth%2Fgoogle%2Fcallback&scope=email%20profile&client_id=802935928319-rfebepn3gm1pjib6pcj07eqjrsqoubu3.apps.googleusercontent.com') ;
    }));
};

// purpose of this route to handle the RESPONSE of o-Auth(either success or failure) & intializing session...
const createCallbackRoute = () => {
    app.get(`/auth/Provider/:provider/callback`, asyncErrorHandler( async (req, res, next) => {
        console.log("Callback of O-Auth Hit...");
        const { provider } = req.params; // Get the provider name after the authentication got completed by middleware...
        // getting and handling passport response...
        passport.authenticate(provider, {
            failureRedirect: '/login', failureMessage: `O-Auth of ${provider} failed..`, 
            successRedirect: '/song-library', successMessage: `O-Auth of ${provider} successfully completed...`
        }, (err, user, info) => {
            if (err) { 
                console.log('Error in passport authenticate callback:', err);
                return next(err);
            } 
            if (!user) {
                console.log('User not found in passport authenticate callback:', user);
                return res.redirect('/signup');
            }
            console.log("User Information :", info); // loggin the user information...
            // procceding with logging the user...
            req.logIn(user, (err) => {
                if (err) return next(err);
                req.session.isAuthenticated  = true ; // setting authenticated state in session...
                req.session.user = user ;
              
                res.status(200).json({message:'O-auth successfully completed...'});
                console.log("COOKIES successfully sent...");
            });
        })(req, res, next);
    }));
};
createAuthRoute() ;
createCallbackRoute();

// Endpoint for handling Normal SignUp...
app.post('/api/user/signup' ,asyncErrorHandler( async (req,res) => {
    const {UserName , Password , Email , PhoneNumber} = req.body ;
    const location = tempStorage.location ;
     // Check if the user already exists...
     const existingUser  = await userinformation.findOne({ $or: [{ UserName }, { Email },{ PhoneNumber }] });
     if (existingUser) return res.status(400).json({ message: "User with Any of this credential already exists..." });
     // Hashing the password...
    const hashedPassword = await forHasshing(Password) ;
    const new_customer = await userinformation.create({
        UserName:UserName , Password_Hashed : hashedPassword , Email : Email , PhoneNumber : PhoneNumber
    })  
    await new_customer.save();
    // console.log("User credential saved successfully : ",new_customer);
    if (location) {
        const updateUser  = await userinformation.findByIdAndUpdate(
            new_customer._id,
            { $set: { Location: location } },
            { new: true } // This option returns the updated document
        );

        console.log("User After Location updation :",updateUser) ;
    }
    const Payload = {  UserName:UserName ,  Email : Email ,  PhoneNumber : PhoneNumber ,  Location : location } ;
    jsonWebToken.sign(Payload,process.env.SECRET_FOR_JWT,{expiresIn : '1h'},(err,encodedToken) => { 
        if (err) return res.status(400).json({ message: "Error in generating token"}) ;
        console.log("Final Encoded Token :",encodedToken);
        res.cookie('jwt', encodedToken , cookieConditions);
        res.status(200).json({message : "User created successfully..."});
     })
     tempStorage = { } ; // making temporary storage empty...
}));

// Endpoint for handling Normal Login...
app.post('/api/user/login' , asyncErrorHandler(async (req, res) => { 
    const { Text_Info, Password } = req.body;
    const location = tempStorage.location ;
    // any one will be the user entered credential... 
    const required_user = await userinformation.findOne(Text_Info.includes('@') ? {Email : Text_Info} : {UserName : Text_Info} ); 
    if (!required_user) {
        console.log("User not found in database...");
        return res.status(401).json({ message: "User not found..." });
    }
    const passwordMatched = await toVerifyHassed(Password,required_user.Password_Hashed) ; 
    if (!passwordMatched) {
        console.log("Password not matched...");
        return res.status(401).json({ message: "Password not matched..." });
    }
    // updating user location on the basis of geolocation...
    if (location) {
        const updateUser  = await userinformation.findByIdAndUpdate(
            new_customer._id,
            { $set: { Location: location } },
            { new: true } // This option returns the updated document
        );

        console.log("User After Location updation :",updateUser) ;
    }
    const Payload = {  UserName_Email : Text_Info ,  Password : Password , Location :location } 
    jsonWebToken.sign(Payload,process.env.SECRET_FOR_JWT,{expiresIn : '1h'},(err,encodedToken) => { 
        if (err) return res.status(400).json({ message: "Error in generating token"}) ;
        console.log("Final Encoded Token :",encodedToken);
        res.cookie('jwt', encodedToken , cookieConditions);
        res.status(200).json({message : "User created successfully..."});
     })
     tempStorage = { } ; // making temporary storage empty...
}));

// endpoint for determining location of user , not Authenticated through O-auth....
app.get('/api/user/location/:Latitude/:Longitude', asyncErrorHandler(async (req, res) => {
    const { Latitude, Longitude } = req.params; // extracting request parameters...
    console.log(Latitude , Longitude); 

    // using an API to convert user coordinates to text-location...
    async function getTextLocation(latitude,longitude) {
        const GEOCODING_URI = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(latitude)}%2C${encodeURIComponent(longitude)}&key=${process.env.GEOCODING_API_KEY}`;
        const response = await axios.get(GEOCODING_URI);
        const location = response.data.results[0].components; // getting location from response...
        return location ;

    }
    const userLocation = await getTextLocation(Latitude, Longitude) ;
    tempStorage.location = userLocation ; // temporary storage at server...
    res.status(200).json({message : "User location successfully determined..."});
}))

// This is gona return us an instant of our HTTP server... 
const HTTP_serverInstance = app.listen(port,() => {  console.log(`Music_Player Server is running on port ${port}`) })
const webSocketServer = new WebSockets.Server({ server: HTTP_serverInstance  }); // for setting up websocket server...

// cathcing data from WS...
webSocketServer.on('connection', function connection(ws){
    ws.on('error', function handleError(err) { console.log("Error in connecting to FRONTEND :",err)})
    // will handle the manipulation from the search Text...
    ws.on('message', function messageHandle(msg){
        console.log("Searched/Spoken Text by the user :",msg.toString());
    })
})

// for using spotify song credentials...
const spotifyWebAPi = new SpotifyWebApi({ clientId:process.env.SPOTIFY_CLIENT_ID, clientSecret:process.env.SPOTIFY_CLIENT_SECRET , redirectUri: process.env.SPOTIFY_REDIRECT_URI }) ;
var scope = ['playlist-read-private' , 'playlist-read-collaborative' , 'user-library-read' , 'user-top-read'] ;

// spotifies authentication system by Authorization-code flow...
app.post('/api/spotify/authorize', toauthenticateJWT ,asyncErrorHandler(async (req, res) => {
    console.log(req.user) ;
    const userID = await userinformation.findOne({ $or : [
        {Email : req.user.Email || req.user.UserName_Email},
        {UserName:req.user.UserName_Email}
    ]})._id ;
    var AuthURL = spotifyWebAPi.createAuthorizeURL(scope,userID) ;
    console.log("Redirecting the user to Authorized URL...");
    res.redirect(AuthURL) ; // redirecting user to get permission to access his account... 
}))

let accessToken , refreshToken , expiresIn ; // defining the variables...

// function to refresh accesstoken after 1 hour...
function refreshSpotifyToken() {
    spotifyWebAPi.refreshAccessToken()
    .then((data) => {
        console.log("New accesstoken is :", data.body.access_token);
        accessToken = data.body.access_token; // Update the access token
        spotifyWebAPi.setAccessToken(accessToken); // Set the new access token
        // Schedule the next refresh...
        scheduleTokenRefresh(data.body.expires_in);
    }).catch(err => {
        console.log("Error in refreshing accesstoken :", err);
    });
}

// Function to schedule the token refresh...
function scheduleTokenRefresh(expiresIn) {
    // Refresh the token 5 minutes before it accually expires...
    const refreshTime = (expiresIn - 300) * 1000; // Convert to milliseconds...
    setTimeout(refreshSpotifyToken, refreshTime);
}

// Function to initialize the Spotify authorization
app.post(process.env.SPOTIFY_REDIRECT_URI, asyncErrorHandler(async (req, res) => { 
    const { code } = req.query; // extracting authCode from the url...
    console.log("The AuthCode: ", code);
    const token = await spotifyWebAPi.authorizationCodeGrant(code);
    // taking the required information from the response...
    accessToken = token.body.access_token;
    refreshToken = token.body.refresh_token;
    expiresIn = token.body.expires_in; // Get the expires_in value
    console.log("Access Token for the user account: ", accessToken);
    spotifyWebAPi.setAccessToken(accessToken); // setting access_token...

    // Schedule the token refresh...
    scheduleTokenRefresh(expiresIn);
    res.json({ access_token: accessToken }); // store it On clientside...
    res.redirect('http://localhost:3000/song-library');
}));
