const mongoose = require('mongoose') ;

const UserSchema = new mongoose.Schema({
    Username:{type:String , required:true },
    Email_Address:{type:String , required:true},
    Password:{type:String , required:true}
})

const Userdata = mongoose.model('UserInfo',UserSchema) ;
module.exports = Userdata ;