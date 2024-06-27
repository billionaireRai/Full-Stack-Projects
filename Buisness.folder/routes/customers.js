import express from "express";
const router = express.Router();
import Customer from "../model/Customer.js"; // Correct path

// Add customer route , this will gona manage the POST request coming from frontend.. 
router.post('/', async (req, res) => {
  const { name, email, subject, phone, message } = req.body;

  const newCustomer = new Customer({
    name,
    email,
    subject,
    phone,
    message,
  });

  try {
    const savedCustomer = await newCustomer.save();
    console.log("Customer Data is saved in database:",savedCustomer);
    res.status(201).json(savedCustomer);
  } 
  catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
