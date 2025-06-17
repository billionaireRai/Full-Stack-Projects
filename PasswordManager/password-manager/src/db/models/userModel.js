import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jsonWebToken from 'jsonwebtoken';

// Embedded schema for subscription details
const subscriptionSchema = new mongoose.Schema(
  {
    subscriptionLevel: {
      type: String,
      enum: ["free","basic","standard","premium"],
      default: "free",
    },
    subscriptionDate: {
      type: Date,
      default: Date.now,
    },
    isSubscribed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false } // avoids creating separate _id for subdocument
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      maxlength: [100, "Name can't exceed 100 characters."]
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
      index: true
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [300, "Bio can't exceed 300 characters."]
    },
    subscription: {
      type: subscriptionSchema,
      default: () => ({})
    },
    userLatestLocation: {
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0.0, 0.0]
      },
      addressText: {
        type: mongoose.Schema.Types.Mixed ,
        default: {}
      }
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [10, "Password must be at least 10 characters long."],
      select: true 
    },

    encryptionSalt: {
      type: Number,
      required: [true, "Encryption salt is required."],
      select: true // makes sure that it comes in query result...
    },
    refreshToken : {
      type:String,
      select:true,
    }
  },
  { timestamps: true }
);

// Redundant but reinforces indexing of frequently queried fields...
// userSchema.index({ email: 1 });  can be done like thi...
// pre function to HASH password before saving...
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    // Validate encryptionSalt again here
    if (typeof this.encryptionSalt !== 'number' || isNaN(this.encryptionSalt))   throw new Error(`Invalid encryptionSalt: ${this.encryptionSalt}`);
    const hashedPassword = await bcrypt.hash(this.password, this.encryptionSalt);
    this.password = hashedPassword;
    next();
  } catch (err) {
    console.error("Error hashing password:", err);
    next(err);
  }
});



// pre function for checking password validity...
userSchema.methods.isPasswordValid = function (incomingPassword) {
  return bcrypt.compare(incomingPassword, this.password); // will gona return a boolean value...
}
// generating access token..
userSchema.methods.generateAccessToken = function () {
  const userDataToEncode = { id: this._id, name: this.name, email: this.email };
  const accessToken = jsonWebToken.sign(userDataToEncode, process.env.SECRET_FOR_ACCESS_TOKEN, { expiresIn: process.env.EXPIRY_FOR_ACCESS_TOKEN });
  return accessToken;
}

// generating refresh token
userSchema.methods.generateRefreshToken = function () {
  const dataToInclude = { id:this._id } ;
  const refreshToken = jsonWebToken.sign(dataToInclude,process.env.SECRET_FOR_REFRESH_TOKEN,{expiresIn:process.env.EXPIRY_FOR_REFRESH_TOKEN}) ;
  return refreshToken ;
}

const users = mongoose.models.users || mongoose.model("users", userSchema);
export default users;
