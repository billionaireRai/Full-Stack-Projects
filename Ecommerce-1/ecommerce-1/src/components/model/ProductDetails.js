const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
   category: { type: String, required: true },
   name: { type: String, required: true },
   price: { type: String, required: true }, // set keyword helps in datatype conversion dynamically...     
   delivery_cost: { type: String, required: true },
   rating: { type: String, required: true }, // Using mongoose.Decimal128 for precise decimal storage
   image_link: { type: String, required: true }
});

const productdata = mongoose.model('productdata', ProductSchema); 
module.exports = productdata; 
