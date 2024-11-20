const mongoose =  require('mongoose') ;

const driverSchema = new mongoose.Schema({
    Name:{type:String , required:true , default:'Driver_Name' },
    Email_Id:{type:String , required:true , default:'Customer@gmail.com'},
    Age:{type:Number , required:true , default:'User_Age'},
    PhoneNumber:{type:String , required:true , default:'User_Phone_Number'},
    RegionOfDelivery:{type:String , required:true , default:'User_Address'},
    DateOfBirth:{type:Date , required:true },
    VehicleType:{type:String , required:true}
})
const driverinfo = new mongoose.model('driverinfo',driverSchema) ;
module.exports = driverinfo ;