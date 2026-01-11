import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
    followerId:{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Follower ID is required'],
        ref: 'users'
    },
    followingId:{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Following ID is required'],
        ref: 'users'
    }
}, { timestamps: true });

// Indexes for query performance
followSchema.index({ followerId: 1 });
followSchema.index({ followingId: 1 });
followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

// Pre-save validation to prevent self-following
followSchema.pre('save', function(next) {
    if (this.followerId.equals(this.followingId)) {
        return next(new Error('Cannot follow yourself'));
    }
    next();
});

const follows = mongoose.models.follows || mongoose.model('follows', followSchema);

export default follows;
