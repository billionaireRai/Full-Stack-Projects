import mongoose from "mongoose";

const viewSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
      required: true,
      index: true, // Faster lookups for post analytics
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required:[true,'Required for tracking....'],
      index: true,
    },
    ipAddress: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Prevent multiple views from same user on same post...
viewSchema.index({ postId: 1, userId: 1 }, { unique: true, sparse: true });

// Prevent multiple views from same IP...
viewSchema.index({ postId: 1, ipAddress: 1 },{ unique: true, sparse: true });


const Views = mongoose.models.Views || mongoose.model("Views", viewSchema);
export default Views;
