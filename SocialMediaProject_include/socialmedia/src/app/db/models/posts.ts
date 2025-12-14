import mongoose from "mongoose";
import { urlRegex } from "@/app/controllers/regex";

const postSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    /* Core content */
    content: {
      type: String,
      trim: true,
      default: "",
      maxlength: [280, "Content cannot exceed 280 characters"]
    },

    mediaUrls: {
      type: [String],
      default: [],
      match: [urlRegex, "Incorrect URL format..."]
    },

    replyAllowedBy:{
      type:String,
      trim:true,
      enum:['everyone','following','mentioned','verified']
    },

    /* Replies */
    replyToPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null,
      index: true
    },

    /* Repost / Quote support */
    postType: {
      type: String,
      enum: ["original", "repost", "quote"],
      default: "original",
      index: true
    },

    originalPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null,
      index: true
    },

    /* Used only when postType === "quote" */
    quoteText: {
      type: String,
      trim: true,
      maxlength: 280,
      default: null
    },

    /* Discovery */
    hashtags: {
      type: [String],
      default: [],
      validate: {
        validator: function (v:string[]) {
          return v.every(tag => tag.trim().length > 0);
        },
        message: "Hashtags cannot contain empty strings"
      }
    },

    mentions: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
      validate: {
        validator: function (v:mongoose.Schema.Types.ObjectId[]) {
          return v.every(id => mongoose.Types.ObjectId.isValid(String(id)));
        },
        message: "Mentions must contain valid ObjectIds"
      }
    },

    // for future moderation and visibility....
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true, versionKey: false }
);

/* Indexes for feed & conversation performance */
postSchema.index({ authorId: 1, createdAt: -1 });
postSchema.index({ originalPostId: 1 });
postSchema.index({ replyToPostId: 1 });
postSchema.index({ postType: 1, createdAt: -1 });

const Post = mongoose.model("Post", postSchema);

export default Post;
