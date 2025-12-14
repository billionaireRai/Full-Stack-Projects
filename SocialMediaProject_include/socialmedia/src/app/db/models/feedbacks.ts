import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    type: {
      type: String,
      required: true,
      enum: [
        /* Product & Platform */
        "bug_report",
        "feature_request",
        "ui_ux_feedback",
        "performance_issue",
        "crash_or_error",
        "accessibility_issue",
        "security_concern",
        "data_privacy_concern",

        /* Content & Community */
        "content_quality",
        "algorithm_feedback",
        "recommendation_issue",
        "feed_relevance",
        "trending_issue",
        "search_issue",
        "hashtag_issue",

        /* Moderation & Safety */
        "report_misuse",
        "moderation_appeal",
        "false_positive",
        "false_negative",
        "harassment_experience",
        "safety_concern",
        "child_safety_feedback",

        /* Account & Identity */
        "account_access_issue",
        "login_problem",
        "account_recovery",
        "impersonation_feedback",
        "verification_feedback",

        /* Monetization */
        "subscription_issue",
        "payment_failure",
        "billing_dispute",
        "refund_request",
        "creator_payout_issue",
        "ad_experience",

        /* Communication */
        "dm_issue",
        "notification_issue",
        "email_issue",

        /* Compliance */
        "localization_issue",
        "legal_request",
        "policy_feedback",

        /* General */
        "general_feedback",
        "other"
      ],
      index: true
    },

    message: {
      type: String,
      trim: true,
      required: true,
      maxlength: 2000
    },

    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "ignored"],
      default: "open",
      index: true
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
      index: true
    },

    // Admin / Support workflow
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null
    },

    resolvedAt: {
      type: Date,
      default: null
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Preventing feedback spam from same user for same type...
feedbackSchema.index({ userId: 1, type: 1 });

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
