const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    UserName: { type: String, required: true, unique: true ,index :true  },
    Email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      match: /.+\@.+\..+/,
    }, // indexing on email for faster querie...
    Password_Hashed: { type: String, required: true },
    PhoneNumber: { type: String, default: null, required: false , index:true},
    Profile_Picture: { type: [String], default: "default.jpg" },
    Location : {type : Object , required:false , default:{General_Location:'Some Where on Earth...'}},
    google_AuthID: { type: String, default: null },
    google_AuthToken: { type: String, default: null },
    google_AuthRefreshToken: { type: String, default: null },
    github_AuthID: { type: String },
    github_AuthToken: { type: String, default: null },
    github_AuthRefreshToken: { type: String, default: null },
    twitter_AuthID: { type: String },
    twitter_AuthToken: { type: String, default: null },
    twitter_AuthRefreshToken: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    preference: {
      favouriteGenres: { type: [String], required: false },
      favouriteArtists: { type: [String], required: false },
      favouriteAlbums: { type: [String], required: false },
      language: { type: String, required: false },
    },
  },
  { timestamps: true }
); // Automatically manage createdAt and updatedAt...

// Post-save hook to set default UserName after document creation
userSchema.post("save", function (doc) {
  if (!doc.UserName) {
    doc.UserName = `USER_${doc._id}`;
    doc.save(); // saving the doc after updating...
  }
});

const userinformation = mongoose.model("userinformation", userSchema);
module.exports = userinformation;
