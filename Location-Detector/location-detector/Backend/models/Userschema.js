const mongoose = require('mongoose');

// Define schema
const userDataSchema = new mongoose.Schema({
    EmailId:{type:String , required:true},
    Password:{type:String , required:true},
    PhoneNumber:{type:String,required:true,}
});

// Create model
const UserData = mongoose.model('UserData', userDataSchema);
module.exports = UserData ;
