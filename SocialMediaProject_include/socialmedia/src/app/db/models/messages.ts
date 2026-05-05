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
    conversationId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Conversation',
      required:true
    },
    content: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: null
    },
    postLink:{
      type:String ,
      default:null,
      trim:true
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
    status: {
      type: String,
      enum:['sent','delivered','seen'],
      default:'sent'
    },
    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account"
      }
    ]
  },
  { timestamps: true, versionKey: false }
);

// for fast chat retrieval...
messageSchema.index({ fromId: 1, toId: 1, createdAt: -1 });

const Message = mongoose.models.message || mongoose.model("Message", messageSchema);

export default Message;
