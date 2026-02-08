import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: [50, 'Option text cannot exceed 50 characters']
  },
  votes: {
    type: Number,
    default: 0,
    min: 0
  }
});

const pollSchema = new mongoose.Schema(
  {
    authorPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
      required: true,
      index: true
    },

    question: {
      type: String,
      required: true,
      trim: true,
      maxlength: [280, "Question cannot exceed 280 characters"]
    },

    options: {
      type: [optionSchema],
      required: true,
      validate: {
        validator: function(v: any[]) {
          return v.length >= 2 && v.length <= 4;
        },
        message: "Poll must have between 2 and 4 options"
      }
    },

    duration: {
      type: Number,
      required: true, 
      // time intervals in seconds...
      min: 300, // 5 minutes
      max: 604800 // 7 days
    },

    expiry: {
      type: Date,
      required: true
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true
    },

    totalVotes: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { timestamps: true, versionKey: false }
);

// Indexes for performance
pollSchema.index({ authorPost: 1, createdAt: -1 });
pollSchema.index({ expiry: 1 });
pollSchema.index({ isActive: 1, createdAt: -1 });

const Poll = mongoose.models.Poll || mongoose.model("Poll", pollSchema);

export default Poll;
