import mongoose from "mongoose";

const breachWatchSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    emailChecked:{
        type:Boolean,
        default:false,
    },
    breachFound:{
        type:Boolean,
        default:false,
    },
    details:{
        type:mongoose.Schema.Types.Array,
        default:[],
    }
},{timestamps:true})
const breachwatch = mongoose.model('breachwatch', breachWatchSchema);
export default breachwatch ;