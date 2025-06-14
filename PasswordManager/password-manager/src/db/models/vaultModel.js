import mongoose from "mongoose";
const { Schema } = mongoose;

const versionSchema = new Schema(
  {
    iv: {
      type: String,
      required: [true, "Initialization vector (iv) is required."]
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
  { _id: false } // prevents automatic _id in subdocuments
);

const vaultSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required."]
    },

    vaultType: {
      type: String,
      required: [true, "Vault type is required."],
      enum: {
        values: ["password-details", "bank-account", "cryptowallet-details", "credit-card"],
        message: "{VALUE} is not a valid vault type."
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

const vaultitems = mongoose.model("vaultitems", vaultSchema);
export default vaultitems;
