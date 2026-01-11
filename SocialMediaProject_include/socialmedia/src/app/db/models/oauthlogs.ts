import mongoose from "mongoose";

const oauthSchema = new mongoose.Schema({
    state:{
        type:String,
        required:[true,'required for security enhancement'],
        trim:true
    },
    codeVerifier:{
        type:String,
        required:[true,'required for identity recheck...'],
        trim:true
    },
    intent:{
        type:String,
        enum:['signup','login',' '],
        default:' ',
        required:[true,'required for identity recheck...'],
        trim:true
    },
    userAgent:Object,
    ipAddress:{
        type:String,
        trim:true,
    },
    used:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:new Date()
    },
    expiresAt:{
        type:Date,
        default:new Date(Date.now() + 30 * 60 * 1000)
    }

})

// Indexes for performance and security...
oauthSchema.index({ state: 1 }, { unique: true });
oauthSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const oauthlogs = mongoose.models.oauthlogs || mongoose.model('oauthlogs',oauthSchema);
export default oauthlogs ;

