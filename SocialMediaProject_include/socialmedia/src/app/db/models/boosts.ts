import mongoose from "mongoose";

const boostsSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
      required: true,
      index: true,
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: true,
      index: true,
    },
    targetViews: {
      type: Number,
      required: true,
      min: [0, "targetViews must be >= 0"],
      index: true,
    },
    expiry: {
      type: Date,
      required: true,
      index: true,
    },
    pacingRate: {
      type: Number,
      required: true,
      min: [0, "pacingRate must be >= 0"],
      index: true,
    },
    consumedViews: {
      type: Number,
      default: 0,
      min: [0, "consumedViews must be >= 0"],
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "qualified", "completed", "expired", "canceled", "failed"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true, versionKey: false }
);

boostsSchema.index({ accountId: 1, postId: 1 });
boostsSchema.index({ postId: 1, status: 1, expiry: 1 });
boostsSchema.index({ accountId: 1, status: 1, expiry: 1 });

const boosts = mongoose.models.boosts || mongoose.model("boosts", boostsSchema);

export default boosts;

