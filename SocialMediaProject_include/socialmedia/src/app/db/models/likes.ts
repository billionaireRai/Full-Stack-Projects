import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'user',
        required:[true,'Neccessary for the action'],
    },
    targetType:{
        type:String,
        trim:true,
        default:'Post',
        enum:['Post','Notification','Comment']
    },
    targetUser:{
        type:mongoose.Types.ObjectId,
        ref:'user',
        required:[true,'Neccessary for the action']
    }
},{ timestamps:true });

// Indexes for performance...
likeSchema.index({ userId: 1 });
likeSchema.index({ targetUser: 1, createdAt: -1 });
likeSchema.index({ targetType: 1 });

const likes = mongoose.model('likes',likeSchema);
export default likes ;