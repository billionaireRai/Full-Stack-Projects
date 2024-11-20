const mongoose =  require('mongoose') ;

// I also need to add users current location in this schema , in SignUp proccess from PhoneNumber...
const userSchema = new mongoose.Schema({
    UserName:{type:String , required:true , default:'User_Name' },
    Email_Id:{type:String , required:true , default:'Customer@gmail.com'},
    Password:{type:mongoose.Schema.Types.Mixed , required:true , default:'User_Password'},
    Age:{type:Number , required:true , default: 1 },
    PhoneNumber:{type:String , required:true , default:''},
    Gender:{type:String , required:true , default:'none'},
    Address:{type:String , required:true , default:'User_Address'},
    ProfileImgURL:{type:[mongoose.Schema.Types.Mixed] , required:true , default:[]},
    FoodInterest:{type:String , default:''},
    UpdateDate :{type:Date , required:true , default : new Date()},
    SignInDate :{type:Date , required:true}

})
const usercredentials = new mongoose.model('usercredentials',userSchema) ;
module.exports = usercredentials ;