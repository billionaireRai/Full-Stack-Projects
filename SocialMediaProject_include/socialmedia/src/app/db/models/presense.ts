import mongoose from "mongoose";

const presenceSchema = new mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account',
        required: true,
        unique: true,
        index: true
    },
    onlineStatus: {
        type: String,
        enum: ['online', 'offline', 'away'],
        default: 'offline',
        index: true
    },
    socketId: {
        type: String,
        trim: true,
        sparse: true  // Allows multiple nulls if disconnected...
    }
}, { timestamps: true });

const Presense = mongoose.models.Presense || mongoose.model('Presense', presenceSchema);

export default Presense;

