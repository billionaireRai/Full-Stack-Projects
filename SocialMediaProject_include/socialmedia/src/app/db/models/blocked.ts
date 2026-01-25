import mongoose from "mongoose";

const blockSchema = new mongoose.Schema(
  {
    blockedByAcc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: true,
      index: true
    },
    blockedAcc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: true,
      index: true
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

const Block = mongoose.models.Block || mongoose.model("Block", blockSchema);
export default Block;
