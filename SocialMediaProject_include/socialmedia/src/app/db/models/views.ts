import mongoose from "mongoose";

const postViewEventSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
      required: true,
      index: true,
    },

    viewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      index: true,
    },

    ipHash: {
      type: String,
      required: true,
      index: true,
    },

    userAgentHash: {
      type: String,
      required: true,
    },

    source: {
      type: String,
      enum: ["feed", "profile", "direct", "explore"],
      default: "feed",
    },

    isQualified: {
      type: Boolean,
      default: false,
      index: true,
    },

  },
  { timestamps: true }
);

// For fast analytics by post
postViewEventSchema.index({ postId: 1, createdAt: -1 });

// For duplicate detection per session
postViewEventSchema.index({ postId: 1, sessionId: 1 });

// For logged-in user duplicate detection
postViewEventSchema.index({ postId: 1, viewerId: 1 });

// For fraud analysis
postViewEventSchema.index({ ipHash: 1, createdAt: -1 });

const Views = mongoose.models.Views || mongoose.model("Views", postViewEventSchema);
export default Views;
