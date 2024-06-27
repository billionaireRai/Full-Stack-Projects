import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
});

const Customer = mongoose.model('Customer', CustomerSchema);

export default Customer;
