const mongoose = require("mongoose");
const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
  value: { type: Number, required: true, min: 1, max: 5, default: 5 },
  comment: String,
  images: [String],
  createdAt: { type: Date, default: Date.now },
});

// Create a unique compound index on user and hotel
ratingSchema.index({ user: 1, hotel: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);
