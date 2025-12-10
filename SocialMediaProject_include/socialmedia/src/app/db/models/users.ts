import mongoose from "mongoose";
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; 
import { emailRegex } from "@/app/controllers/regex";


const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [emailRegex, 'Please enter a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [10, 'Password must be at least 10 characters long'],
      select: false // Excluding password from queries by default...
    },
    o_auth:{
      authProvider:{ type:String , enum:['facebook','google','not-used'] , default:'not-used' },
      isUsed:{ type:Boolean , default:false }
    },
    refreshToken:{
      value: {
        type:String ,
        required:[true,'Neccessary for restarting the session!!'],
        select:false
      },
      rfExpiry:{
        type:Date,
        default:Date.now()
      }
    }
},{ timestamps:true }) ;

// pre function to HASH password before saving...
const encryptionSalt = 12 ; // same for password hashing of every user...
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    // Validate encryptionSalt again here
    if (typeof encryptionSalt !== 'number' || isNaN(encryptionSalt))   throw new Error(`Invalid encryptionSalt: ${encryptionSalt}`);
    const hashedPassword = await bcrypt.hash(this.password, encryptionSalt);
    this.password = hashedPassword;
    next();
  } catch (err) {
    console.error("Error hashing password:", err);
    next(err as Error);
  }
});


// pre function for checking password validity...
userSchema.methods.isPasswordValid = function (incomingPassword:string) {
  return bcrypt.compare(incomingPassword, this.password); // will going to return a boolean value...
}
// generating access token..
userSchema.methods.generateAccessToken = function () {
  const userDataToEncode = { id: this._id, email: this.email };
  const accessToken = jsonwebtoken.sign(userDataToEncode, process.env.SECRET_FOR_ACCESS_TOKEN!, { expiresIn: process.env.EXPIRY_FOR_ACCESS_TOKEN! });
  return accessToken;
}

// generating refresh token
userSchema.methods.generateRefreshToken = function () {
  const dataToInclude = { id:this._id } ;
  const refreshToken = jsonwebtoken.sign(dataToInclude, process.env.SECRET_FOR_REFRESH_TOKEN!, { expiresIn: process.env.EXPIRY_FOR_REFRESH_TOKEN! });
  return refreshToken ;
}

const users = mongoose.model('users',userSchema);
export default users