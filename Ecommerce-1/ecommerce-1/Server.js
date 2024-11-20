const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const cors = require('cors');
const bodyparser = require('body-parser');
const session = require('express-session') ;
const {GoogleGenerativeAI} = require('@google/generative-ai') ;
const Userdata = require('./src/components/model/UserDetails')
const productdata = require('./src/components/model/ProductDetails');
const MongoStore = require('connect-mongo');

const app = express() ;
const port = 4000 ;

const ServerStorage = {};

// Middleware applicable on all the request handlers...
app.use(express.urlencoded()) ;
app.use(session({
  secret:'my-secret-cookie-generator',
  resave:false,
  saveunintialized:false ,
  store:MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/MyEcommerce'
  }),
  cookie:{secure:false}
}))
app.use(cors());
app.use(bodyparser.json());

// GlobalError handling middleware used in asyncErrorHandler()...
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500 ;
  err.status = err.status || 'error' ;
  res.status(err.statusCode).json({
    status:err.statusCode ,
    message:err.message
  })
});

// With the help of GoogleGenerativeAI gemini I have brought product details Which is in Database right Now... 
// Need to comment this part once data is brought and saveed in database...
  // Product_Arr = [] ;
  // const ApiKey ='';
  // const genAI = new GoogleGenerativeAI(process.env.ApiKey) ;

  // async function run() {
  //   const model = genAI.getGenerativeModel({model:'gemini-1.5-flash'});
  //   const prompt = "Please generate a json of 92 products for ecommerce website containing the specified categories" ;
  //   const result = await model.generateContent(prompt) ;
  //   const response = result.response ; 
  //   const OutPut = response.json(); 
  //   // By this line we will get all the product data in Product_Arr...
  //   Product_Arr.push(OutPut) ;
  // }
  // run();

mongoose.connect('mongodb://localhost:27017/MyEcommerce',{
    useNewUrlParser:true ,
    useUnifiedTopology:true
})

mongoose.connection.once('open',() => { 
    console.log("Successfully connected to MongoDB...")
    // Need to comment this part after saving to DB...
    // for (const EachProduct of Product_Arr) {
    //   const NewProduct = new productdata(EachProduct);
    //   // Saving data into our database...
    //   async function Saving_Product() {
    //     try {
    //       const savedproduct = await NewProduct.save() ;
    //       console.log("Product details are saved in mongodb..." ,savedproduct);
    //     } 
    //     catch (error) {
    //       console.log("some error occured in saving data", error);
    //     }
    //   }
    //   Saving_Product()
    // }
 });

// Middlewares are used , when doing operations out of request handlers...
// Also if want a logic for all handlers... 

// Middleware to fetch data from MongoDB database...
async function fetchDataMiddleware(req ,res , next) {
  try {
      const products = await productdata.find();
      req.body = products ;
      next() ;    /*Call next to move to the next middleware or request handler*/
  } 
  catch (error) {
      console.log("Error occured :",error ) ;
  }
}
// Need to call this function once...
fetchDataMiddleware() ;

mongoose.set('debug',true) ;

// fetch data from this endpoint and store it in state...
app.post('/products', fetchDataMiddleware, (req, res) => {
  res.status(200).json(req.body);
});

// Request handler for SignUp request...
app.post('/usersignup', async (req, res) => {
  const { Username, EmailId, Password } = req.body;
  try {
      // Hashing the password asynchronously
      async function HashPassword(PassW) {
        let saltrounds = 10 ;
        let hashedpassword = await bcrypt.hash(PassW, saltrounds) ;
        return hashedpassword ;
      }
      HashPassword(Password).then( async (hashedpassword) => { 
            const newUser = new Userdata({
              Username:Username ,
              Email_Address:EmailId ,
              Password:hashedpassword 
            })

      // Saving the user data
      const savedUser = await newUser.save();
      console.log("User data saved:", savedUser);
      
      // Responding with the saved user data
      res.status(200).json(savedUser);
       })

  } catch (error) {
      console.error("Error in saving user data:", error);
      res.status(500).json({ error: "An error occurred while saving user data" });
      // Consider not sending the actual error object for security reasons
  }
});

// Request handler for Login request...
app.post('/userlogin', async (req, res) => {
  const {EmailId , Password} = req.body ;
  
  async function VerifyPassword(PassW,hashedpassw) {
    let Matching = await bcrypt.compare(PassW,hashedpassw) ;
    return Matching ;
  }
  try {
    const FetchedData = await Userdata.findOne({Email_Address:EmailId}) ;  // FetchedData is an array of object...
    console.log(FetchedData);
    if (!FetchedData) {
      console.log('User with these credentials are not in RECORD...')
    }
    VerifyPassword(Password , FetchedData.Password).then((Matching) => { 
      if (Matching) {
        console.log("These are an Authentic user credentials...", Matching) ;
        res.send('These are an Authentic user credentials...') ;
      }
      else {console.log("Not the Authentic credentials...",Matching)
      res.send('Please enter correct credentials')
      }
    }) 
  } 
  catch (error) {
    console.log("Internal Server error :",error);
    res.send(error)
  }
});

// Put your API credentials related to payment transactions here...
app.post('/PaymentDetails', (req, res) => {
  const Api_Key = 'entered_my_api_key_here';
  const Api_Secret = 'entered_my_api_secret_here';

import('node-fetch').then( async (module) => { 
  const fetch = module.default ;
  try {
    const {Amount,card_number,expiry_date,cvv_code,card_name} = req.body ;

      //  constructing API request as action Payload ...
      const Payload = {Amount,card_number,expiry_date,cvv_code,card_name} ; // Along with other required data...
      console.log('Data for Payment provider :' , Payload) ;
      const response = await fetch('https://api.paymentprovider.com/PaymentDetails',{
        method:'POST' ,
        headers: {'Content-Type': 'application/json','Authorization': `Bearer ${Api_Key}`},
        body:JSON.stringify(Payload)         
      }) ;
      // Proccessing the response of payment provider...
      if (response.status === 200) {
        const result = await response.text();
        console.log('Response Data :' ,result)
        res.json({status:'Success' , message:'Payment Done Successfully...'});
      }
      else{
        const errorData = await response.text();
        console.log(errorData);
        res.status(response.status).json({status:'error',message:'Payment Proccess failed...'})
      }
  } 
  catch (error) {
    console.error('Error in Payment Proccess :',error);
    res.status(500).json({status:'error',message:'Internal Server Error...'})
  }
});  
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})