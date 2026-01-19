import mongoose from "mongoose";

const taggedSchema = new mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accounts",
      required: true,
      index: true
    },
    taggedAs:{
      type:String,
      enum:['bookmarked','highlighted'],
      default:'bookmarked',
      required:true
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true
    }
  },
  { timestamps: true, versionKey: false }
);

// Compound index to ensure unique bookmarks per account...
taggedSchema.index({ accountId: 1, postId: 1 }, { unique: true });

// Index for efficient queries by account..
taggedSchema.index({ accountId: 1, createdAt: -1 });

const tagged = mongoose.models.tagged || mongoose.model("tagged", taggedSchema);

export default tagged ;
