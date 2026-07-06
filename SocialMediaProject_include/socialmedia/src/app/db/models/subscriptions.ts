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
      enum: ["Free", "Pro", "Creator", "Enterprise"],
      default: "Free",
      index: true
    },
    priceId: {
      type: String,
      required:true 
    },
    status: {
      type: String,
      enum: ["active","trialing","past_due","canceled","paused","expired"],
      default: "trialing",
      index: true
    },
    stripeCustomerId: {
      type: String,
      default:null,
      index: true
    },
    stripeSubscriptionId: {
      type: String,
      default:null,
      unique: true,
      index: true
    },
    currentCycleStart:{
      type: Date,
      default: null
    },
    currentCycleEnd:{
      type: Date,
      default: null
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
  },
  { timestamps: true , versionKey: false }
);

// Preventing multiple active subscriptions per user...
subscriptionSchema.index( { userId: 1, status: 1 }, { partialFilterExpression: { status: "active" } });

const subscriptions = mongoose.models.subscriptions || mongoose.model("subscriptions", subscriptionSchema);

export default subscriptions;
