import mongoose from "mongoose";

const pubkeySchema = new mongoose.Schema(
  {
    accountId: {
      type: String,
      required: [true, "accountId is required for identification !!"],
      index: true,
      trim: true,
    },

    // One document per device
    deviceIP: {
      type: String,
      required: [true, "deviceId is required"],
      index: true,
      trim: true,
    },

    publickey: {
      type: String,
      required: [true, "publickey is neccessary"],
      trim: true,
    },

    status: {
      type: String,
      required: true,
      enum: ["active","unactive", "revoked"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true , versionKey: false, collection: "pubkeys" }
);

// Allow multiple devices per account , also only one ACTIVE key per device.
pubkeySchema.index(
  { accountId: 1, deviceIP: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "active" },
  }
);

const pubkeys = mongoose.models.pubkeys || mongoose.model("pubkeys", pubkeySchema);

export default pubkeys ;

