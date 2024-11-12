const mongoose = require("mongoose");
const roomSchema = new mongoose.Schema({
  size: Number,
  beds: Number,
  baths: Number,
  isAvailable: { type: Boolean, default: true },
});

module.exports = mongoose.model("Room", roomSchema);
