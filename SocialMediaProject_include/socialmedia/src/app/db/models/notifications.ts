import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'user',
        required:[true,'Required for successful action...']
    },
    type:{
        type:String,
        default:'like',
        enum:['like','comment','follow','mention','repost']
    },
    actorId:{
        type:mongoose.Types.ObjectId,
        ref:'user',
        required:[true,'Required for successful action...']
    },
    postId:{
        type:mongoose.Types.ObjectId,
        ref:'post',
        required:[false,'Not required in (follow) action!!'],
        validate: {
            validator: function(this: mongoose.Document, value: any) {
                const typesRequiringPostId = ['like', 'comment', 'mention', 'repost'];
                if (typesRequiringPostId.includes(this.get('type'))) {
                    return value != null;
                }
                return true;
            },
            message: 'postId is required for this notification type'
        }
    },
    commentId:{
        type:mongoose.Types.ObjectId,
        ref:'post',
        required:[false,'Not required in (like) and (follow) actions!!'],
        validate: {
            validator: function(this: mongoose.Document, value: any) {
                const typesRequiringCommentId = ['comment', 'mention', 'repost'];
                if (typesRequiringCommentId.includes(this.get('type'))) {
                    return value != null;
                }
                return true;
            },
            message: 'CommentId is required for this notification type'
        }
    },
    isRead:{
        type:Boolean,
        default:false
    }
}, { timestamps:true });

const notifications = mongoose.model('notifications',notificationSchema) ;

export default notifications ;