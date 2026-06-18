import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: true,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    pinnedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
      }
    ],
    deletedBy:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account"
      }
    ],
    isGroup: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Ensure participants must be more than one...
conversationSchema.path("participants").validate(function (value: any[]) {
  return Array.isArray(value) && value.length >= 2;
}, "participants must contain at least 2 Account");

conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessage: 1, "updatedAt": -1 });

const conversation = mongoose.models.conversation || mongoose.model("conversation", conversationSchema);

export default conversation;

