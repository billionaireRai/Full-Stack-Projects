import mongoose from "mongoose";
const { Schema } = mongoose;

const versionSchema = new Schema(
  {
    // versionNumber represents how many times this vault has been changed...
    versionNumber:{ 
      type: Number,
      required: true,
    },
    encryptedPreviousData: {
      type: Schema.Types.Mixed,
      required: [true, "Encrypted previous data is required."]
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false } // prevents automatic _id in subdocuments...
);

const vaultSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required."]
    },
    vaultType: {
      vaultCategory:{
        type: String,
        default:'other',
        enum: {
          values: ["password-details", "bank-details", "cryptowallet-details", "credit-card-details","other"],
          message: "{VALUE} is not a valid vault type."
        }
      },
      access:{
        type: String,
        required: [true, "Access is required."],
        enum: {
          values: ["shared","private"],
          message: "{VALUE} is not a valid access."
        }
      }
    },
    vaultDescription: {
      type: String,
      required: [true, "Vault description is required."],
      minlength: [10, "Vault description must be at least 10 characters."],
      maxlength: [300, "Vault description must not exceed 300 characters."],
      trim: true // removes extra whitespace
    },

    encryptedCurrentData: {
      type: Schema.Types.Mixed,
      required: [true, "Encrypted current data is required."]
    },

    versionHistory: {
      type: [versionSchema],
      default: []
    }
  },
  { timestamps: true }
);

const vaultitems =  mongoose.models.vaultitems || mongoose.model("vaultitems", vaultSchema);
export default vaultitems;
