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
    lastSeen: {
        type: Date,
        default: Date.now,
        index: true
    },
    socketId: {
        type: String,
        trim: true,
        sparse: true  // Allows multiple nulls if disconnected...
    }
}, { timestamps: true });

const Presence = mongoose.model('Presence', presenceSchema);

export default Presence;

