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
blockSchema.index( { blockedByAcc: 1, blockedAcc: 1 }, { unique: true });

const Block = mongoose.models.Block || mongoose.model("Block", blockSchema);
export default Block;
