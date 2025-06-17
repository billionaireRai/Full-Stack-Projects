import mongoose from "mongoose";
const { Schema } = mongoose;

const sharedWithSchema = new Schema(
  {
    sharedWithId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Shared user ID is required."],
    },
    timeStampOfSharing: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const sharedVaultSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner ID is required."],
    },

    sharedWithIndividuals: {
      type: [sharedWithSchema],
      default: [], // Use empty array instead of [null]
    },

    encryptedData: {
      type: Schema.Types.Mixed,
      required: [true, "Encrypted data is required."],
    },

    accessExpiresAt: {
      type: Date,
      default: null,
    },

    passPhraseHash: {
      type: String,
      required: [true, "Passphrase hash is required."],
      select:false
    },
  },
  { timestamps: true }
);

const sharedvaults = mongoose.models.sharedvaults || mongoose.model("sharedvaults", sharedVaultSchema);
export default sharedvaults;
