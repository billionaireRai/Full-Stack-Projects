import mongoose from "mongoose";
import { usernameRegex , urlRegex , numRegex } from '@/app/controllers/regex';

const accountSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId ,
        required:[true,'user is neccessary for account...'],
        ref:'user',
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    username:{
        type:String,
        required: [true, 'Username is required for unique account identification'],
        trim:true,
        minLength:[8,'Minimum length should be 8'],
        match: [usernameRegex, 'Please enter a valid username/handle']
    },
    avatarUrl:{
        type:String,
        trim:true,
        default:'',
        match:[urlRegex,'URL format is incorrect'],
        maxlength: [500, 'Avatar URL cannot exceed 500 characters']
    },
    bannerUrl:{
        type:String,
        trim:true,
        default:'',
        match:[urlRegex,'URL format is incorrect'],
        maxlength: [500, 'Avatar URL cannot exceed 500 characters']
    },
    followers:{
        type:Number,
        default:0,
        min:0,
        match:[numRegex,'Value format is incorrect']
    },
    followings:{
        type:Number,
        default:0,
        min:0,
        match:[numRegex,'Value format is incorrect']
    },
    bio:{
        type:String,
        trim:true,
        default:''
    },
    account:{
        Active:{
            type:Boolean,
            default:true
        },
        Type:{
            type:String,
            trim:true,
            enum:['Private','Public','Creator','Business'],
            default:'Private'
        },
        completed:{
            type:Boolean,
            default:false
        }
    },
    isVerified:{
        value:{
            type:Boolean,
            default:false
        },
        level:{
            type:String,
            default:'Free',
            trim:true,
            enum:['Free','Pro','Creator','Enterprise']
        },
    },
    interests:{
        gender: {
            type: String,
            enum: ['male', 'female', 'none'],
            default: 'none'
        },
        ageRange: {
            type: String,
            enum: ['13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
            default: ''
        },
        topicsLoved: {
            type: [String],
            default: []
        },
        networkPreference: {
            type: String,
            enum: ['close-friends', 'professional-network', 'public-audience'],
            default: ''
        },
        timeAvailability: {
            type: String,
            enum: ['morning', 'afternoon', 'evening', 'night-owl'],
            default: ''
        }
    }
}, {timestamps: true})

const accounts = mongoose.model('accounts',accountSchema);
export default accounts ; 