import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account',
        required: true
    }],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: null
    },
    unreadCounts: {
        type: Map,
        of: Number,
        default: {}
    },
    isGroup: {
        type: Boolean,
        default: false
    }
},{ timestamps:true });

conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessage: 1, 'updatedAt': -1 });

// Ensure participants must be more than one...
conversationSchema.pre('save', function(next) {
    if (this.participants && this.participants.length > 1) {
        this.participants = [...new Set(this.participants.sort((a, b) => a.toString().localeCompare(b.toString())))];
    }
    next();
});

// Unique compound index for 1:1 chats...
conversationSchema.index({ participants: 1 }, { unique: true });

const conversation = mongoose.models.conversation || mongoose.model('conversation', conversationSchema);

export default conversation ;


