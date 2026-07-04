import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
    {
        accountId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "account",
            required: true,
            index: true,
        },
        pollId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "polls",
            required: true,
            index: true,
        },
        optionId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true,
        },    
    },{ timestamps: true , versionKey: false }
);


// Prevent duplicate votes from the same account for the same poll.
voteSchema.index({ accountId: 1, pollId: 1 }, { unique: true });

const votes = mongoose.models.votes || mongoose.model("votes", voteSchema);

export default votes;

