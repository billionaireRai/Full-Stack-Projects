import mongoose from "mongoose";

const muteSchema = new mongoose.Schema(
  {
    mutedByAcc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: true,
      index: true
    },
    mutedAcc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: true,
      index: true
    },
    source: {
      type: String,
      enum:['profile','chat'],
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
muteSchema.index( { mutedByAcc: 1, mutedAcc: 1 }, { unique: true });

const Mutes = mongoose.models.mutes || mongoose.model("mutes", muteSchema);
export default Mutes;
