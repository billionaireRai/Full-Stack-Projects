const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Todo_customer_info = require("../model/Info.js");
const customertasks = require("../model/Task.js");

let ServerStorage = {}; 

// User Registration Route
router.post("/", async (req, res) => {
  const { Email, password, number } = req.body;
  console.log("Request Content:", req.body);

  try {
    const SaltRound = 10;
    const hashedPassword = await bcrypt.hash(password, SaltRound);
    console.log("Password is hashed successfully...");

    const newCustomer = new Todo_customer_info({
      Email,
      password: hashedPassword,
      number,
    });

    const savedData = await newCustomer.save();
    console.log("Customer Data is saved in database:", savedData);

    // storing data to session Storage (This can also be used but it will take time to GRASP...)
    // req.session.password_1 = hashedPassword ;
    // console.log(req.session.password_1);
    // console.log(req.session);
    ServerStorage.password_1 = hashedPassword ; 
    console.log(ServerStorage);
    
  } 
  catch (error) {
    console.error("Error saving customer data:", error);
    res.status(400).json({ message: error.message });
  }
});

// User Authentication Route
router.post("/Auth", async (req, res) => {
  const { email, password } = req.body;
  console.log("Request Details:", req.body);

  try {
    const user = await Todo_customer_info.findOne({ Email: email });
    console.log("This is your required data:", user);

    if (!user) {
      console.log("User not Authenticated");
      return res.status(401).json({
        message:
          "The User Details Entered are not currently available in our database.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      console.log("YES the User is Authorized !!");
      const SaltRound = 10 ;
      const hashedPassword2 = await bcrypt.hash(password , SaltRound);

      // storing data in session storage.
      // req.session.password_2 = hashedPassword2 ;
      // console.log(req.session.password_2);
      // console.log(req.session);

      ServerStorage.password_2 = hashedPassword2 ; 
      console.log(ServerStorage);

    } else {
      console.error("Password Entered is incorrect...");
      return res
        .status(401)
        .json({ message: "Incorrect password is Entered." });
    }
  } catch (error) {
    console.error(
      "Some error occurred in the authentication process...",
      error
    );
    return res.status(500).json({
      message: "An internal server error occurred.",
      error: error.message,
    });
  }
});

// User Task Route
router.post("/UserTask", async (req, res) => {
  const { Password, ...Task } = req.body;
  console.log("Task details:", req.body);

  // Hash the password
  let SaltRound = 10;
  let hashed_one = await bcrypt.hash(Password, SaltRound);
  console.log("Password Hashing completed:", hashed_one);

  // Validate and filter task details
  const ValidTask = Object.entries(Task).filter(([key, value]) => value.trim() !== "").reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  let Values = Object.values(ValidTask);
  console.log("Valid Task:", Values);

  // Checking for predefined customertasks for the same customer...
  try {
    // Retrieve all user documents and check passwords
    let allUsers = await customertasks.find();
    let matchedUser = null;

    for (let user of allUsers) {
      if (await bcrypt.compare(Password, user.Password)) {
        matchedUser = user;
        break;
      }
    }

    if (matchedUser) {
      // If a matching user is found, update their tasks as submitted just now...
      await customertasks.deleteOne({ _id: matchedUser._id });
      const taskDetails = new customertasks({
        Password: hashed_one,
        Task: Values,
      });
      await taskDetails.save();
      console.log("Customer Tasks successfully updated...");
    } else {
      // If no matching user is found, create a new user tasks document...
      const taskDetails = new customertasks({
        Password: hashed_one,
        Task: Values,
      });
      await taskDetails.save();
      console.log("Customer Tasks successfully saved...");
    }
  } catch (error) {
    console.error("Error saving tasks:", error);
    if (!res.headersSent) {
      res.status(500).send("Error saving tasks");
    }
  }
});

// Fetch Task Route
// EXAMPLE route that uses Users data from session storage...
router.post("/fetchtask", async (req, res) => {
  let Task_OF_user = ServerStorage.password_1 || ServerStorage.password_2 ;
  console.log(Task_OF_user);  // This console will check wheather the password_1 or password_2 is coming from ServerStorage or not...

 try {
   let Exactask = await Todo_customer_info.findOne({Password:Task_OF_user});   // Exactask as always will gona return us JS object...  
   let Tasks = Exactask.Task ;
   console.log(Tasks);

   res.status(400).json(Tasks);
 } 
 catch (error) {
  console.log("An error occured while Pulling data from Database...")
  res.send("Error in pulling the data...")
  
 }
// Now the response is send on the frontend with data of Tasks , further manipulation will be done there ...

});

module.exports = router;
