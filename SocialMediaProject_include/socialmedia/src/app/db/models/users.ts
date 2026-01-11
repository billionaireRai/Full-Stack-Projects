import mongoose from "mongoose";
import jsonwebtoken, { Secret } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { emailRegex } from "@/app/controllers/regex";
import { Document } from "mongoose";
export interface IUser extends Document {
  email: string;
  password: string;
  o_auth:string;
  location?: {
    type: string;
    coordinates: [number, number];
  };
  refreshToken?: {
    value: string;
    rfExpiry: Date;
  };
  generateAccessToken(): string;
  generateRefreshToken(): {
    token: string;
    expiry: Date;
  };
}

const ACCESS_TOKEN_SECRET = process.env.SECRET_FOR_ACCESS_TOKEN as Secret;
const REFRESH_TOKEN_SECRET = process.env.SECRET_FOR_REFRESH_TOKEN as Secret;

const ACCESS_TOKEN_EXPIRY = process.env.EXPIRY_FOR_ACCESS_TOKEN as string;
const REFRESH_TOKEN_EXPIRY = process.env.EXPIRY_FOR_REFRESH_TOKEN as string;


const userSchema = new mongoose.Schema<IUser>(
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
},{ timestamps:true });

userSchema.index({ location: '2dsphere' });

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


// generating access token..
userSchema.methods.generateAccessToken = function (): string {
  const payload = { id: this._id , email: this.email };
  return jsonwebtoken.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

// generating refresh token
userSchema.methods.generateRefreshToken = function () {
  const payload = { id: this._id };
  const token = jsonwebtoken.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  return {
    token,
    expiry: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  };
};


const users = mongoose.models.users || mongoose.model('users', userSchema);
export default users
