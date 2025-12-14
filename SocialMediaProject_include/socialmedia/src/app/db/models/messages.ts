import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    fromId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    toId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    content: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: null
    },

    mediaUrls: {
      type: [String],
      default: []
    },

    messageType: {
      type: String,
      enum: ["text", "image", "video", "file", "mixed"],
      default: "text",
      index: true
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true
    },
    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true, versionKey: false }
);

// for fast chat retrieval...
messageSchema.index({ fromId: 1, toId: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
