import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
      index: true,
    },
    bio:{
      type:String,
      trim:true,
    },
    subscription:{
      subscriptionLevel: {
        type: String,
        enum: ["free", "premium"],
        default: "free"
      },
      subscriptionDate:{
        type:Date,
        default:Date.now
      },
      isSubscribed:{
        type:Boolean,
        default:false,
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 10, // good to enforce minimum length
    },
    encryptionSalt: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Consider creating an index for faster login lookup
userSchema.index({ email: 1 });

const User = mongoose.model("User", userSchema);
export default User;
