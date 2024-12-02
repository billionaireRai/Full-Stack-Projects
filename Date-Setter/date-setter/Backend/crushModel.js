const mongoose = require('mongoose');

const crushSchema = new mongoose.Schema({
    nameOfCrush: { type: String, required: true  }, // Changed to a single string
    Email: { type: String, required: true ,index:true }, // Changed to a single string
    PhoneNumber: { type: String, required: true , index:true },
    Password: { type: String, required: true, index:true },
    Location:{type:Object , default:'Some where from Earth...'}
});

const crushinfo = new mongoose.model('crushinfo', crushSchema);
module.exports = crushinfo ;