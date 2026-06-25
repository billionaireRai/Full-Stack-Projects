import mongoose from "mongoose";
import { usernameRegex } from "@/app/controllers/regex";

const mediaUrlSchema = new mongoose.Schema({
  url: {
    type: String,
    trim: true,
    default: '',
    maxlength: [500, 'URL cannot exceed 500 characters']
  },
  public_id: {
    type: String,
    default: ''
  },
  media_type:{
    type:String,
    enum:["image","video" ,"raw","auto"],
    default:'auto'
  }
});

const messageSchema = new mongoose.Schema(
  {
    fromId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: true,
      index: true
    },

    toId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: true,
      index: true
    },
    conversationId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'conversation',
      required:true
    },
    content: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: null
    },
    link:{
      type:[String] ,
      required:false,
    },
    mentions: {
      type: [String],
      ref: "accounts",
      default: [],
      validate: {
        validator: function (v: string[]) {
          return v.every((handle: string) => usernameRegex.test(handle))
        }
      },
        message: "Mentions must contain valid ObjectIds"
    },
    mediaUrls: {
      type: [mediaUrlSchema],
      default: []
    },
    messageType: {
      type: String,
      enum: ["text", "image", "video",'audio','contact'],
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

const messages = mongoose.models.messages || mongoose.model("messages", messageSchema);

export default messages;
