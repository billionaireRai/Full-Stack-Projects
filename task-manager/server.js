const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const customer = require("./backend/Routes/customer");

const app = express();
const port = 4000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
// Middleware for passin URL encoded bodies (form data)...
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: "TaskManger...", // Replace with your secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false , maxAge: 24 * 60 * 60 * 1000 , httpOnly: true } ,// 1 day in milliseconds, // Set to true if using HTTPS
    store:MongoStore.create({
      mongoUrl:'mongodb://localhost:27017/Todo_customer_info'
    })
  })
);


// Connection with MongoDB database
mongoose.connect("mongodb://localhost:27017/Todo_customer_info", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB...");
});
mongoose.set("debug", true);

// Route handling the request
app.use("/", customer);
app.use("/Auth", customer);
app.use("/UserTask", customer);
app.use("/fetchtask", customer);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
