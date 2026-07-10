import mongoose from "mongoose";

const monetizeCampaignSchema = new mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: true,
      index: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },
    startTime: {
      type: Date,
      required: true,
      index: true,
    },
    expiry: {
      type: Date,
      required: true,
      index: true,
    },
    targetthreshold: {
      type: Number,
      required: true,
      min: [0, "targetthreshold must be >= 0"],
      index: true,
    },
    payoutAmount: {
      type: Number,
      required: true,
      index: true,
    },
    currency:{
      type: String,
      default: "USD",
      uppercase: true
    },
    status: {
      type: String,
      enum: ["active","qualified","paid","expired","canceled","failed"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true, versionKey: false }
);

// Common query patterns...
monetizeCampaignSchema.index({ accountId: 1, postId: 1 });
monetizeCampaignSchema.index({ postId: 1, status: 1, expiry: 1 });

const monetizes = mongoose.models.monetize || mongoose.model("monetize", monetizeCampaignSchema);

export default monetizes ;

