import mongoose from "mongoose";
const { Schema } = mongoose;

// Optional: define a sub-schema for coordinates
const coordinatesSchema = new Schema(
  {
    latitude: {
      type: Number,
      default: 0.0,
    },
    longitude: {
      type: Number,
      default: 0.0,
    },
    addressText: {
      type: mongoose.Schema.Types.Mixed ,
      default: {}
    }
  },
  { _id: false } // No need for _id in embedded object
);

const auditLogSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required."],
      // The ID of the user performing the action
    },

    action: {
      type: String,
      required: [true, "Action description is required."],
      trim: true,
      // Description of the action performed
    },

    targetItemId: {
      type: Schema.Types.ObjectId ,
      ref: "Item",
    },
    ipAddress: {
      type: String,
      required: [true, "IP address is required."],
      trim: true,
      // IP address from which the action was performed
    },

    userAgent: {
      type: String,
      required: [true, "User agent is required."],
      trim: true,
      // User agent string from the browser/client
    },

    locationOfAction: {
      type: coordinatesSchema,
      default: () => ({
        latitude: 0.0,
        longitude: 0.0,
      }),
      alias: 'coordinates'
    },
  },
  { timestamps: true }
);

const auditlogs = mongoose.models.auditlogs || mongoose.model("auditlogs", auditLogSchema);
export default auditlogs;
