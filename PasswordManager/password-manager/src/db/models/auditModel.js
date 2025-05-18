import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User"
      // The ID of the user performing the action
    },
    action: {
      type: String,
      required: true,
      // Description of the action performed
    },
    targetItemId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      // ID of the item/resource the action was performed on
    },
    timestamp: {
      type: Date,
      default: Date.now,
      // When the action occurred
    },
    ipAddress: {
      type: String,
      required: true,
      // IP address from which the action was performed
    },
    userAgent: {
      type: String,
      required: true,
      // User agent string from the browser/client
    },
    coordinates: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        latitude: 0.0,
        longitude: 0.0,
      },
    },
  },
  { timestamps: true }
);

const auditlog = mongoose.model("auditlog", auditLogSchema);

export default auditlog;
