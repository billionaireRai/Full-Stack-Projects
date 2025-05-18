import mongoose from "mongoose";

const sharedVaultSchema = new mongoose.Schema({
    ownerId:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
    },
    sharedWithIndivisuals:{
        type: [
            {
                sharedWithId:{
                    type: mongoose.SchemaTypes.ObjectId,
                    ref: 'User',
                },
                timeStampOfSharing:{
                    type: Date,
                }
            }
        ],
        default:[null] ,
    },
    encryptedData:{
        type: Schema.Types.Mixed,
        required: true
    },
    accessExpiresAt:{
        type: Date,
        default: null,
    },
    passPhraseHass:{
        type: String,
        required: true,
    }

},{timestamps:true})
const sharedvaults = mongoose.model('sharedvaults', sharedVaultSchema);
export default sharedvaults;