const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: false },
  size: { type: Number, required: true },
  beds: { type: Number, required: true },
  baths: { type: Number, required: true },
});

module.exports = mongoose.model("Room", roomSchema);
