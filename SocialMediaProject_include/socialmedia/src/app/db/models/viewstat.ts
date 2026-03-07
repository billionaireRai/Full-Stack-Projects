import mongoose from "mongoose";

const postViewStatsSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
    unique: true,
  },
  totalViews: { type: Number, default: 0 },
  lastUpdatedAt: { type: Date, default: Date.now },
});

const viewStat = mongoose.models.viewStat || mongoose.model("viewStat", postViewStatsSchema);

export default viewStat ;