import mongoose from "mongoose";
const { Schema } = mongoose;

const sharedWithEachSchema = new Schema(
  {
    sharedWithId : {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required:true 
    },
    sharedWithText : {
      type: String,
      required:true
    }
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
    vaultCategory:{
        type: String,
        default:'other',
        enum: {
          values: ["password-details", "bank-details", "cryptowallet-details", "credit-card-details","other"],
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
    sharedWithIndividuals: {
      detailsOfSharing: {
        type: [sharedWithEachSchema],
        default: []
      },
      timeStampOfSharing: {
        type: Date,
        default: null
      },
      _id: false
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
