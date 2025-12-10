import mongoose from "mongoose";
import { urlRegex } from '@/app/controllers/regex';

const postSchema = new mongoose.Schema({
    authorId:{
        type:mongoose.Types.ObjectId,
        ref:'user'
    },
    content:{
        type:String,
        trim:true,
        default:'',
        maxlength: [280, 'Content cannot exceed 280 characters']
    },
    mediaUrls:{
        type:[String],
        trim:true,
        required:false,
        match:[urlRegex,'Incorrect URL format...']
    },
    replyToPostId:{
        type:mongoose.Types.ObjectId,
        ref:'post',
        required:false
    },
    hashtags:{
        type:[String],
        trim:true,
        default:[],
        validate: {
            validator: function(v: string[]) {
                return v.every(tag => tag.trim().length > 0);
            },
            message: 'Hashtags cannot contain empty strings'
        }
    },
    mentions:{
        type:[mongoose.Types.ObjectId],
        default:[],
        validate: {
            validator: function(v: mongoose.Types.ObjectId[]) {
                return v.every(id => mongoose.Types.ObjectId.isValid(id));
            },
            message: 'Mentions must contain valid ObjectIds'
        }
    }

},{ timestamps:true });

// Indexes for performance...
postSchema.index({ authorId: 1 , createdAt:-1 , replyToPostId:1 });

const posts = mongoose.model('posts',postSchema);

export default posts ;