require('dotenv').config() ; // loading all environment varibles from (.env) file => proccess.env
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const twilio = require('twilio');
const otpgenerator = require('otp-generator') ;
const nodemailer = require('nodemailer') ;
const cors = require('cors') ;
const bodyParser = require('body-parser');
const multer = require('multer');
const Paytm = require('paytm-pg-node-sdk');
const usercredentials = require('./Backend/UserCredentials.js') ;
const driverinfo = require('./Backend/driverinfo.js') ;
const foodinfos = require('./Backend/foodinfos.js');

const app = express() ;
const port = 4000 ;

// Initializing server storage if required...
let ServerStorage = {} ;
// Initializing all middlewares...
app.use(cors()) ;
app.use(bodyParser.text());
app.use(bodyParser.json()) ;     // app.use(express.json()) this can also be used... 
app.use(express.urlencoded({extended:true})) ; // Used to pull out data , coming in urlencoded format in request...

// Initializing session-express...
otpgenerator.generate(10,{lowerCaseAlphabets:true,upperCaseAlphabets:true,specialChars:true},(err,Secret_Key) => {
  if (err) console.log(err); // singleliner if() statement...
  console.log(Secret_Key);
  app.use(session({
    secret: Secret_Key,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: 'mongodb://localhost:27017/FoodDelivery',ttl: 24 * 60 * 60 // 1 day
    }),
    cookie:{secure:true}
  }))
}) ;

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


// Sensitive credentials which are used...
const API_KEY = process.env.googlemapsAPI_KEY;  // I just need to put googlemaps API here and the project is completed...

const SID_TWILLIO = process.env.twillio_SID ;
const AUTHTOKEN_TWILLIO = process.env.twillio_AUTHTOKEN ;
const phonenumber_TWILLIO = process.env.twillio_PhNo ;

const MY_MAIL = process.env.mymail ;
const MY_MAIL_PASSWORD = process.env.mymailpassword ;
const spoonacularAPI_KEY = process.env.myspoonacularAPI_KEY ;

// Bringing payment gateway credentials from .env file... 
const PAYMENT_GATEWAY_PAYTMPAY_APIKEY = process.env.PAYMENT_GATEWAY_PAYTMPAY_APIKEY ;
const PAYMENT_GATEWAY_PAYTMPAY_MID = process.env.PAYMENT_GATEWAY_PAYTMPAY_MID ;
const WEBSITE = process.env.WEBSITE;
const CLIENT_ID = process.env.CLIENT_ID;

// Database connection logic through mongoose dynamically...
mongoose.connect('mongodb://localhost:27017/FoodDelivery',{ useNewUrlparser:true , useUnifiedTopology:true ,bufferCommands:true ,
   autoCreate:false , autoIndex:false });
const db = mongoose.connection;
db.once('open', async () => {
    console.log('Database connection established...');
   let collections = ['usercredentials', 'driverinfos', 'foodinfos'];
     // Get the list of existing collections in the database...
    const existingCollections = (await mongoose.connection.db.listCollections().toArray()).map(col => col.name) ;
     for (let i = 0; i < collections.length; i++) {
       // Check if the collection exists if not creating it...
       if (!existingCollections.includes(collections[i])) {
         console.log(`Collection ${collections[i]} does not exist. Creating it...`) ;
         await mongoose.connection.db.createCollection(collections[i]) ;
         console.log(`Collection ${collections[i]} created.`) ;
     }
    }
});

// Updating my food database dynamically...

const RESTRAUNTS = ['KFC','MACDONALDS','SUBWAY','PIZZAHUT','DOMINOS','BURGERKING','BASKINROBINS','HALDIRAMS','COSTACOFFEE','STARBUCKS','CAFECOFFEEDAY'];

const MindFoodArr = [
  'BhindiMasala','Burger','ButterChicken','CheesePizza','ChickenBiryani','ChickenPizza','ChickenTikka','ChikenFriedRice','CholeBhature','HakkaNoodle','MuttonRoganJosh','PalakPaneer','Paneer Malai Kofta','Pav Bhaji Food','Pizza','SaagAloo','Samosa','TandooriChicken','VegBiryani',"Hyderabadi Biryani","Lucknowi Biryani","Butter Chicken","Paneer Tikka Masala","Masala Dosai","Plain Dosai","Butter Naan","Garlic Naan","Pani Puri","Bhel Puri","Samosas","Pakoras","Gulab Jamun","Rasgulla","Hakka Noodles","Chopsuey","Fried Rice","Schezwan Rice","Spring Rolls","Chicken Manchurian","Kung Pao Chicken","Sweet and Sour Pork","Hot and Sour Soup","Manchow Soup","Margherita Pizza","Pepperoni Pizza","Veggie Supreme Pizza","Spaghetti Carbonara","Penne Arrabbiata","Meat Lasagna","Vegetarian Lasagna","Caesar Salad","Caprese Salad","Cheeseburger","Veggie Burger","Classic Fries","Loaded Fries","Club Sandwich","Grilled Cheese","Buffalo Wings","BBQ Wings","Chicken Tacos","Veggie Tacos","Beef Burrito","Bean Burrito","Cheese Quesadilla","Chicken Quesadilla","Loaded Nachos","Nachos with Salsa","Chocolate Cake","Red Velvet Cake","Vanilla Ice Cream","Chocolate Ice Cream","Strawberry Ice Cream","Croiss","Eclairs","Cola","Lemonade","Orange Juice","Apple Juice","Masala Chai","Cappuccino",
] ;

const UpdatedFoodData = async () => {
  const foods = await foodinfos.find().exec();
  let foodIndex = 0;
  for (let i = 0; i < foods.length; i++) {
    foods[i].Discounts_offers = `${Math.floor(10 + 10* Math.random())} % off` ;
    await foods[i].save();

    foodIndex = (foodIndex + 1) % MindFoodArr.length;
  }
};

// Commented this function call after food data is updated...
// UpdatedFoodData();  

// function for calculating total cost of our food Inventory...
// Output of mongoDB aggregation is a (PROMISE)...
const Inventory_Cost = async () => { 
  const result = await foodinfos.aggregate([{$group: {_id: null,total: { $sum: "$Price" }}}])
  return result[0].total;
}
// Inventory_Cost().then((totalcost) => { 
//   console.log(`Total Cost of Our Food Inventory in USD : $${totalcost} & Rupees : ${(totalcost * 83.97).toFixed(2)} Lakh`); 
// })

async function fetchFoodDetails() {
  const foodItems = [];
  let offset = 0;
  const limit = 100; // Number of results per page...

  const { default:fetch } = await import('node-fetch'); // Different way of dynamic import for fetch()...
  while (true) {
    try {
      const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${spoonacularAPI_KEY}&number=${encodeURIComponent(limit)}&offset=${encodeURIComponent(offset)}`);
      const data = await response.json();
      console.log(data) ;

      if (!data || !data.results || !Array.isArray(data.results)) {
        console.error('Invalid API response:', data);
        break;        // Exit loop if no more results...
      }                     

      foodItems.push(...data.results);

      offset += limit;
      if (foodItems.length >= 2000) break; // Exit loop if we have more than 2000 items...
    } catch (error) {
      console.error('Error fetching food items:', error);
      break;
    }
  }

  const mappedItems = foodItems.map((eachItem) => {
    return {
      Name: eachItem.title,
      Description: eachItem.summary || 'No description available',
      Category: eachItem.dishTypes ? eachItem.dishTypes.join(', ') : 'Unknown',
      Price: (0 + Math.random() * 50).toFixed(2), // Randomized price for example
      Image_Url: eachItem.image,
      Preparation_time: `${Math.floor(Math.random() * 60) + 5} minutes`, // Randomized preparation time
      Restaurant_name: `RESTRAUNT-${Math.floor(Math.random() * 100) + 1}`,
      Availability_status: 'Available',
      Dietary_information: eachItem.diets ? eachItem.diets.join(', ') : 'N/A',
      Rating: (1 + 4 * Math.random()).toFixed(1), // Randomized rating
      Reviews: ['Delicious!','Would try again!','Great food','Decent in taste but higher in class','Love the flavors!','Perfect for a quick bite','Good value for money','Will order again!','Food was fresh and hot','Service was prompt and friendly','Ambiance was cozy and comfortable','Will recommend to friends and family','Best in town!','A must-try for foodies!','Surprisingly good!','Exceeded my expectations!','Will be back for more!','Flavors were on point!','Presentation was amazing!','Portion size was generous!','Will definitely order again!'
      ], // Placeholder reviews
      Discounts_offers: 'None', // Placeholder for discount offers 
      Nutritional_information: {
        calories_per_serving: eachItem.nutrition ? eachItem.nutrition.nutrients.find(nutrient => nutrient.name === 'Calories')?.amount || 0 : 0,
        fat_content: eachItem.nutrition ? eachItem.nutrition.nutrients.find(nutrient => nutrient.name === 'Fat')?.amount || '0g' : '0g'
      },
      Spiciness_level: 'Medium' // Placeholder for spiciness level
    };
  });

  return mappedItems; // returns the array of objects containing food data...
}

async function PushData(Arr) {
  try {
    const newfood = await foodinfos.insertMany(Arr);
    console.log(newfood);
  } catch (error) {
    console.error("Error in pushing Data to database:", error); // Log the error message
  }
}

// I have commented this line after getting the food data in database...
// fetchFoodDetails().then((mappedItems) => PushData(mappedItems));  

// Error handling for connection issues
db.on('error', (error) => {
  console.error(`An error occured in connecting Error : ${error.message} ErrorStatus : ${error.statusCode}`);
  process.exit(1) ;
});
mongoose.set('debug',true) ;

// My request handling part...
app.post('/Sign-Up-Process', asyncErrorHandler(async (req, res) => {
  const {UserName,Email_Id,Password,Age,PhoneNumber,Gender,Address} = req.body ;
  async function Hashing(password) {
    let SaltRound = 10 ;
    let HasshedPassword = await bcrypt.hash(password,SaltRound) ; 
    return HasshedPassword ;
  }
  Hashing(Password).then( async (HasshedPassword) => { 
      if (HasshedPassword) {
        let current_date = new Date();
        let newuser = await new usercredentials({
          UserName:UserName ,Password:HasshedPassword ,Age:Age , Email_Id:Email_Id ,PhoneNumber:PhoneNumber ,Gender:Gender ,Address:Address ,
          SignInDate: current_date.toDateString()
      })
        const saveduser = await newuser.save() ; 
        console.log("User Successfully Saved :", saveduser) ;
      } else {
        console.log('Error is saving UserData...')
        res.statusCode(404).status(err.status)
      }
   })
}))

// endpoint for handling the log in proccess...
app.post('/Log-In-Process', asyncErrorHandler(async (req, res) => {
  const { UserName,Password,Age } = req.body ;
  let FetcheData = await usercredentials.find({UserName:UserName}) ;
  async function VerifyPassword(password,hasshedPassword) {
    const isMatch = await bcrypt.compare(password,hasshedPassword) ;
    return isMatch ;
  } 
  // Initializing some Date() parameters...
        let targetdate = new Date() ;
        let date = new Date(FetcheData[0].SignInDate) ; 
        date.setFullYear(date.getFullYear() + (Age-FetcheData[0].Age)) ;
      
        await VerifyPassword(Password,FetcheData[0].Password).then( (isMatch) => { 
          if (isMatch && targetdate.getFullYear() === date.getFullYear() ) {
            console.log('Authentication Passed...')
            res.status(200).send(FetcheData[0]);
          } else {
          console.log('Credentials Authentication Failed...') ;
          res.status(404).send('Authentication Failed...');
          }
         })
      }
  
));
// endpoint for handling the otp sending logic...
app.post('/sendotp', asyncErrorHandler( async (req,res) => { 
  const {credential} = req.body ; // Destructuring the data coming...
  console.log(credential); // debugging step...
  const GeneratedOtp = otpgenerator.generate(6,{lowerCaseAlphabets:true , upperCaseAlphabets:true, specialChars:true}) ;
  ServerStorage.GeneratedOtp = GeneratedOtp ;   // saving the GenratedOtp to ServerStorage... 
  var isEmail = false ;
  if (credential.includes('@')) {
    isEmail = true ;
    const transporter = nodemailer.createTransport({
      service:'gmail', auth:{ user:MY_MAIL , pass:MY_MAIL_PASSWORD }
    });
    const mailOptions = {
      from:MY_MAIL , to:credential , Subject: 'Your Twiggy OTP...' , Text:`Your Twiggy Password formating OTP is ${GeneratedOtp} `
    }
    const info = await transporter.sendMail(mailOptions) ;
    console.log("Email Sent SUccessfully",info);
    ServerStorage.credential = credential ;
    res.status(200).send("OTP successfully sent to your given credential...") ;
  } else {
    // Sending OTP message via 'phonenumber'...
    const client = new twilio(SID_TWILLIO,AUTHTOKEN_TWILLIO , { lazyLoading : true ,  maxRetries : 2 , autoRetry : true }) ;
    const message = await client.messages.create({
      to:credential,
      from :phonenumber_TWILLIO,
      body:`Your Twiggy's Password Formatting OTP is ${GeneratedOtp}`
    });
    ServerStorage.credential = credential ;
    console.log('Message Successfully sent :',message.body) ;

  }
 }
));

// endpoint for otp accepting...
app.post('/EnterOTP', asyncErrorHandler( async (req,res) => {
  const {OTP} = req.body ;
  if ( OTP === ServerStorage.GeneratedOtp) {
    console.log("OTP successfully Verified...");
    res.status(200).send('Your account is successfully verified...');
  } else {
    console.log('OTP Mismatched !');
    res.status(404).send('OTP Mismatched , please check it carefully...');
  }
  
}));

// endpoint for acctual password reseting...
app.post('/ResetPassword', asyncErrorHandler( async (req,res) => {
  const { Password } = req.body ;
  async function PasswordHasher(password) {
    let SaltRound = 10 ;
    let AfterHass = await bcrypt.hash(password,SaltRound) ;
    return AfterHass ;
  }
  PasswordHasher(Password).then( async (AfterHass) => { 
    const FetchedFromDB = await usercredentials.findOneAndUpdate(
      {$or:[{PhoneNumber:ServerStorage.credential},{Email_Id:ServerStorage.credential}]},
      {$set:{Password:AfterHass}},
      {new:true}
    );
    if (FetchedFromDB) {
      console.log("Password Successfully Updated to :",AfterHass);
      res.status(200).send('Password updated...');
    } else {
      console.log("An error occured in fetching Data...");
      res.status(404).send("Internal server error...");
    }
   })

}));

// Endpoint for fetching foodData and sending it as response...
app.post('/fetchfood', asyncErrorHandler( async (req,res) => {
  const {page = 1 , pageSize = 16} = req.body ;  // pageSize is no.of data send in one "page" or "chunk"...
  const skip = (page-1) * pageSize ;   // skipping the food items already sended...
  const foodData = await foodinfos.find().skip(skip).limit(pageSize) ;  // Command for fetching data...
  const total = await foodinfos.countDocuments();
  res.status(200).json({foodData,total}) ;

}));
// request handler for verifing coupen code...
app.post('/coupencheck', asyncErrorHandler(async (req, res) => {
  const coupenArr = ["SAVE10OFF", "SPRING15OFF", "SUMMER20OFF", "WINTER25OFF", "FALL30OFF", "FLASH35OFF", "HOT40OFF", "DEAL45OFF", "SUPER50OFF", "ULTIMATE55OFF"];
  const { coupenCode } = req.body;
  console.log(coupenCode);  // Debugging step to check for coupenCode...

  if (coupenArr.includes(coupenCode)) {
    console.log("Coupen Code entered is a valid one...");
    const match = coupenCode.trim().match(/\d+/);
    const Off_Value = parseInt(match[0], 10);
    console.log(Off_Value) ;
    res.status(200).json(Off_Value);
  } else {
    res.status(400).send("Invalid coupen code entered...");
  }
}));

// request handler for applying profile feild...
// upload.any() this => actually proccess the uploaded file for usage it returns file data in "files" array...
// upload.single() this => contains data in "file" array...
// upload.none() this => If wanna upload only text-data(like PhoneNumber etc...)

// Configure multer for file accessing and manipulation...
const storage = multer.memoryStorage(); // Using memory storage(buffer) for just logging the files...
const upload = multer({ storage:storage }); // desk , fileFilter ,limits ,preservepath (options for multer)...

// endpoint for handling profile pic uploading proccess...
app.post('/applypic', upload.single('File'), asyncErrorHandler(async (req, res) => {
  const PhoneNumber = req.body.PhoneNumber ; // pulling out the data from request...
  const File = req.file ;

  if (File) {
    // Convert file buffer to base64 string
    const base64Encoded = File.buffer.toString('base64');
    const imgSrc = `data:${File.mimetype};base64,${base64Encoded}`;
    // Collect file information in an array
    let fileinfoArr = [
      { fieldname: File.fieldname },
      { originalname: File.originalname },
      { encoding: File.encoding },
      { mimetype: File.mimetype },
      { size: File.size },
    ];
    // Update the user document with file information...
    const updatedUser = await usercredentials.findOneAndUpdate(
      { PhoneNumber: PhoneNumber }, 
      { $set: { ProfileImgURL: [...fileinfoArr,imgSrc]} },
      { new: true } 
    );

    if (updatedUser) {
      console.log("File is successfully read and saved...");
      res.json(updatedUser); // sending updatedUser to the client...
    } else {
      console.log("User not found...");
      res.json({ statusCode: 404, message: "User not found" });
    }
  } else {
    console.log("Unable to detect any File coming...");
    res.json({ statusCode: 404, message: "Unable to detect your File..." });
  }
}));

// request handler for removing the profile pic...
app.post('/removepic', asyncErrorHandler( async (req,res) => {
  const PhoneNumber = req.body ;
  const Updateduser = await usercredentials.findOneAndUpdate({PhoneNumber:PhoneNumber},{$set:{ProfileImgURL:[]}},{new:true}) ;
  if (!Updateduser) {
    console.log(`User with ${PhoneNumber} phonenumber did'nt EXISTS...`)
    res.json({statusCode:404,message:"User not found..."})
  }
  console.log(`Profile Pic of ${PhoneNumber} phonenumber is removed...`);
  res.json({statusCode:200,message:"Profile pic Successfully removed..."});    

}));

app.post('/applychanges', asyncErrorHandler(async (req, res) => {
  console.log(req.body); // logging the request body...
  const { userPhoneNumber, updates , UpdateDate } = req.body;
  // Find the user by phone number
  const Req_User = await usercredentials.findOneAndUpdate(
    { PhoneNumber: userPhoneNumber },
    { $set: updates , UpdateDate:UpdateDate},
    { new: true }
  );
  if (!Req_User) {
    console.log(`User with phone number ${userPhoneNumber} does not exist.`);
    return res.status(404).json({ message: "User not found." });
  }
  console.log(`Changes are successfully applied.`);
  res.status(200).json(Req_User);
}));

// endpoint for deleting the user from our record...
app.delete('/user/delete', async (req, res) => {
    const { PhoneNumber } = req.body;
    const UserToDelete = await usercredentials.findOne({ PhoneNumber });
    if (UserToDelete) {
      await UserToDelete.deleteOne();
      res.status(200).send({ message: 'User deleted successfully' });
      console.log("Deletion completed...");
    } else {
      res.status(404).send({ message: 'User not found' });
      console.log("Specified User is Absent in Database...")
    }
    res.status(500).send({ message: 'Error deleting user' });
});

// request endpoint for handling payment proccess....
// only authenticated and authorized users can access your payment endpoint of backend...
app.post('/make-payment', asyncErrorHandler(async (req, res) => {
  const Paymentdata = req.body;
  const UserArray = await usercredentials.find().then(users => users.map(user => user.UserName)); // .find() returns a query...
    if (!UserArray.includes(Paymentdata.FullName)) {
    console.log("You'r Not An Authentic User...");
    res.json({ statusCode: 401, message: "You'r Not An Authentic User (Please either SignIn Or LogIn)..." });
  }
  const user = await usercredentials.findOne({ UserName: Paymentdata.FullName }); // User details from Database whose doing payment...
  // Generating unique orderId and customerId
  const orderId = `ORD-${user._id}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const customerId = user._id;

  if (Paymentdata.MethodName === 'PaytmPay') {
    // In development environment... (Initialization)
    var environment = Paytm.LibraryConstants.STAGING_ENVIRONMENT;
    var callbackURL = 'https://localhost:3000/Payment';
    Paytm.MerchantProperties.setCallbackUrl(callbackURL);

    Paytm.MerchantProperties.initialize(environment, PAYMENT_GATEWAY_PAYTMPAY_APIKEY, PAYMENT_GATEWAY_PAYTMPAY_MID, WEBSITE, CLIENT_ID);

    // moving towards payment proccess...
    var channelId = Paytm.EChannelId.WEB;
    var txnAmount = Paytm.Money.constructWithCurrencyAndValue(Paytm.EnumCurrency.INR, `${83.97 * Paymentdata.finalCost}`);
    var userInfo = new Paytm.UserInfo(customerId); 
    userInfo.setAddress(Paymentdata.Address);
    userInfo.setEmail(user.Email_Id);
    userInfo.setFirstName(String(user.UserName).split('')[0]);
    userInfo.setLastName(String(user.UserName).split('')[0]);
    userInfo.setMobile(user.PhoneNumber);
    userInfo.setPincode((Paymentdata.ZipCode).toString());

    var paymentDetailBuilder = new Paytm.PaymentDetailBuilder(channelId, orderId, txnAmount, userInfo);
    var paymentDetail = paymentDetailBuilder.build();
    var Payment_Token = Paytm.Payment.createTxnToken(paymentDetail);

    // Handling payment status...
    var readTimeout = 80000;
    var paymentStatusDetailBuilder = new Paytm.PaymentStatusDetailBuilder(orderId);
    var paymentStatusDetail = paymentStatusDetailBuilder.setReadTimeout(readTimeout).build();
    var Payment_Status = Paytm.Payment.getPaymentStatus(paymentStatusDetail);

    // sending response to Client...
    res.json({ message: 'Payment Process successfully completed', Payment_Token: Payment_Token, Payment_Status: Payment_Status ,orderId:orderId });
    console.log("Payment process successfully completed...");
  }
  else if(Paymentdata.MethodName === "PhonePay"){
    // rest of the payment gateway integration...
 }

}));

// endpoint for handling user reviews...
app.post('/submit-review', asyncErrorHandler(async (req,res) => {
  const { data } = req.body ;
  console.log(data) ; // printing the reviewtext in the terminal...
}))

app.listen(port, () => {
  console.log(`Twiggy's Server is listening on port ${port}`)
})