import mongoose from "mongoose";
const { Schema } = mongoose;

const breachWatchSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required."],
    },

    emailChecked: {
      type: Boolean,
      default: false,
    },

    breachFounds: {
      type: [String],
      default: false,
    },

    details: {
      type: [Schema.Types.Mixed], // corrected from Schema.Types.Array
      default: [],
    },
  },
  { timestamps: true }
);

const breachwatchs = mongoose.models.breachwatchs || mongoose.model("breachwatchs", breachWatchSchema);
export default breachwatchs;
