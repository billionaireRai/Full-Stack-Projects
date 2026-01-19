import mongoose from "mongoose";
import { urlRegex } from "@/app/controllers/regex";

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
  }
});

const postSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
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
      type: [mediaUrlSchema],
      default: [],
      validate: {
        validator: function(v: any[]) {
          return v.every((item: any) => urlRegex.test(item.url));
        },
        message: "Incorrect URL format..."
      }
    },

    replyAllowedBy:{
      type:String,
      trim:true,
      enum:['everyone','following','mentioned','verified']
    },

    // Replies 
    replyToPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null
    },
    // Repost / Quote support 
    postType: {
      type: String,
      enum: ["original", "repost", "comment"],
      default: "original",
      index: true
    },

    // Discovery
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

// Indexes for feed & conversation performance...
postSchema.index({ authorId: 1, createdAt: -1 });
postSchema.index({ originalPostId: 1 });
postSchema.index({ replyToPostId: 1 });
postSchema.index({ postType: 1, createdAt: -1 });

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
