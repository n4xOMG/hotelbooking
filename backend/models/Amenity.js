const mongoose = require("mongoose");
const amenitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Amenity = mongoose.model("Amenity", amenitySchema);

module.exports = Amenity;
