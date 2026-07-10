import mongoose from "mongoose";

const stripeAccountSchema = new mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: true,
      index: true,
      unique: true,
    },
    stripeAccountId: {
      type: String,
      required: true,
      trim: true,
      index: true,
      unique: true,
    },
    payoutStatus: {
      type: String,
      trim: true,
      default: "unknown",
      index: true,
    },
    chargesEnabled: {
      type: Boolean,
      default: false,
      index: true,
    },
    payoutEnabled: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true, versionKey: false }
);

stripeAccountSchema.index({ accountId: 1, payoutEnabled: 1 });

const stripeaccs = mongoose.models.stripeacc || mongoose.model("stripeacc", stripeAccountSchema);

export default stripeaccs;

