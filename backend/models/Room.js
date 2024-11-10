const mongoose = require("mongoose");
const roomSchema = new mongoose.Schema({
  roomType: { type: String, required: true },
  size: Number,
  beds: Number,
  baths: Number,
  isAvailable: { type: Boolean, default: true },
});

module.exports = mongoose.model("Room", roomSchema);
