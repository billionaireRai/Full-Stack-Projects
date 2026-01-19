import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: true,
      index: true
    },

    plan: {
      type: String,
      enum: ["free", "pro", "creator", "enterprise"],
      default: "free",
      index: true
    },

    status: {
      type: String,
      enum: ["active","trialing","past_due","canceled","paused","expired"],
      default: "active",
      index: true
    },
    stripeCustomerId: {
      type: String,
      required: true,
      index: true
    },
    stripeSubscriptionId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    cancelAtCycleEnd: {
      type: Boolean,
      default: false
    },
    canceledAt: {
      type: Date,
      default: null
    },
    currency: {
      type: String,
      default: "USD",
      uppercase: true
    },
    amount: {
      type: Number,
      min: 0
    },
  },
  { timestamps: true , versionKey: false }
);

// Preventing multiple active subscriptions per user...
subscriptionSchema.index( { userId: 1, status: 1 }, { partialFilterExpression: { status: "active" } });

const subscriptions = mongoose.models.subscriptions || mongoose.model("subscriptions", subscriptionSchema);

export default subscriptions;
