import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    accountId:{
        type:mongoose.Types.ObjectId,
        ref:'account',
        required:[true,'Neccessary for the action'],
    },
    targetType:{
        type:String,
        trim:true,
        default:'Post',
        enum:['post','notification','comment']
    },
    targetEntity:{
        type:mongoose.Types.ObjectId,
        required:[true,'Neccessary for the action']
    }
},{ timestamps:true });

// Indexes for performance...
likeSchema.index({ userId: 1 });
likeSchema.index({ targetUser: 1, createdAt: -1 });
likeSchema.index({ targetType: 1 });

const likes = mongoose.models.likes || mongoose.model('likes',likeSchema);
export default likes ;