const mongoose = require("mongoose");
const reportSchema = new mongoose.Schema({
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["Comment", "Hotel"], required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Refers to either Comment or Hotel ID
  reason: String,
  status: { type: String, enum: ["Pending", "Resolved", "Rejected"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", reportSchema);
