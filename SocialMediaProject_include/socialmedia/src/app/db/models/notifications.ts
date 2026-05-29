import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    forAccId:{
        type:mongoose.Types.ObjectId,
        ref:'account',
        required:[true,'Required for successful action...']
    },
    type:{
        type:String,
        default:'like',
        enum:['like','comment','follow','mention','repost','post','notification_comment','notification_like']
    },
    actorId:{
        type:mongoose.Types.ObjectId,
        ref:'account',
        required:[true,'Required for successful action...']
    },
    postId:{
        type:mongoose.Types.ObjectId,
        ref:'post',
        required:[false,'Not required in some action!!'],
        validate: {
            validator: function(this: mongoose.Document, value: any) {
                const typesRequiringPostId = ['like', 'comment', 'mention', 'repost','post'];
                if (typesRequiringPostId.includes(this.get('type'))) {
                    return value != null;
                }
                return true;
            },
            message: 'postId is required for this notification type'
        }
    },
    comment:{
        type:String,
        required:[false,'Not neccessary in any actions!!'],
        trim:true
    },
    isLiked:{
        type:Boolean,
        default:false
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    isRead:{
        type:Boolean,
        default:false
    }
}, { timestamps:true });

// Latest notifications per recipient
notificationSchema.index({ forAccId: 1, createdAt: -1 });
// Faster unread fetches
notificationSchema.index({ forAccId: 1, isRead: 1, createdAt: -1 });
// Faster filtering by type (if used)
notificationSchema.index({ forAccId: 1, type: 1, createdAt: -1 });
// Fallback index for createdAt ordering
notificationSchema.index({ createdAt: -1 });

const notifications = mongoose.models.notifications || mongoose.model('notifications',notificationSchema) ;

export default notifications ;