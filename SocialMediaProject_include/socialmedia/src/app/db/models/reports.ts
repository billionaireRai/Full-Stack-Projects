import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: true,
      index: true
    },

    reportedEntityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },

    reportedEntityType: {
      type: String,
      required: true,
      enum: ["post", "comment", "message", "account"],
      index: true
    },

    reasonCategory: {
      type: String,
      required: true,
      enum: [
        "harassment",
        "spam",
        "misinformation",
        "violence",
        "sexual",
        "hate",
        "ip_violation",
        "privacy",
        "impersonation",
        "illegal_goods",
        "policy_violation",
        "child_safety"
      ],
      index: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000
    },

    status: {
      type: String,
      enum: ["pending", "in_review", "resolved", "dismissed"],
      default: "pending",
      index: true
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      index: true
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null
    },

    reviewedAt: {
      type: Date,
      default: null
    },

    actionTaken: {
      type: String,
      enum: [
        "none",
        "content_removed",
        "account_warned",
        "account_suspended",
        "account_banned",
        "escalated"
      ],
      default: "none"
    },

  },
  { timestamps: true, versionKey: false }
);

// Preventing duplicate reports by same user on same entity...
reportSchema.index(
  { reportedBy: 1, reportedEntityId: 1 },
  { unique: true }
);

const reports = mongoose.model("reports", reportSchema);

export default reports;
