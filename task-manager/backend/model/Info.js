const mongoose = require('mongoose');

// This my mongoose schema for customer details...
const CustomerSchema = new mongoose.Schema({
  Email: { type: String, required: true  },
  password: { type: String, required: true },
  number: { type: Number, required: true }
});

const Todo_customer_info = mongoose.model('Todo_customer_info', CustomerSchema);

module.exports = Todo_customer_info ;




