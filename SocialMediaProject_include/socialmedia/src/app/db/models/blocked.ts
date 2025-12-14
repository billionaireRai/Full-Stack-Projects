import mongoose from "mongoose";

const blockSchema = new mongoose.Schema(
  {
    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    blockedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    reason: {
      type: String,
      trim: true,
      maxlength: 2000
    },
    source: {
      type: String,
      enum: ["profile", "message", "comment", "post"],
      default: "profile"
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
  },
  { timestamps: true,versionKey: false }
);

// Prevent duplicate blocks....
blockSchema.index( { blockedBy: 1, blockedUser: 1 }, { unique: true });

const Block = mongoose.model("Block", blockSchema);
export default Block;
