import mongoose from "mongoose";
const { Schema } = mongoose;

const vaultSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // For faster lookup by user
    },
    type: {
      type: String,
      required: true,
      enum: ["password-details", "Bank-Account", "crypto-wallet-details", "credit-card"], // adjust as needed
    },
    encryptedCurrentData: {
      type: Schema.Types.Mixed,
      required: true,
    },
    versionHistory: [
      {
        iv: { type: String, required: true },
        encryptedPreviousData: { type: Schema.Types.Mixed, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const VaultItem = mongoose.model("VaultItem", vaultSchema);
export default VaultItem;
