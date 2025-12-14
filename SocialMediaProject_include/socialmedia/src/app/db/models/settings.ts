import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },

    /* Privacy & Safety */
    privacy: {
      profileVisibility: {
        type: String,
        enum: ["public", "followers", "private",'everyone'],
        default: "public"
      },
      allowMessagesFrom: {
        type: String,
        enum: ["everyone", "followers", "no_one"],
        default: "everyone"
      },
      allowMentionsFrom: {
        type: String,
        enum: ["everyone", "followers", "no_one"],
        default: "everyone"
      },
      showOnlineStatus: {
        type: Boolean,
        default: true
      }
    },

    /* Notifications */
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      mentions: {
        type: Boolean,
        default: true
      },
      replies: {
        type: Boolean,
        default: true
      },
      reposts: {
        type: Boolean,
        default: true
      }
    },

    /* Feed & Content Preferences */
    feed: {
      showSensitiveContent: {
        type: Boolean,
        default: false
      },
      autoplayMedia: {
        type: Boolean,
        default: true
      },
      language: {
        type: String,
        default: "en"
      }
    },

    /* Security */
    security: {
      twoFactorEnabled: {
        type: Boolean,
        default: false
      },
      loginAlerts: {
        type: Boolean,
        default: true
      }
    },

    /* Data & Personalization */
    dataPreferences: {
      adPersonalization: {
        type: Boolean,
        default: true
      },
      analyticsSharing: {
        type: Boolean,
        default: true
      }
    }
  },
  { timestamps: true, versionKey: false }
);

const UserSettings = mongoose.model("UserSettings", userSettingsSchema);

export default UserSettings;
