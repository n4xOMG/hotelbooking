const mongoose = require("mongoose");
const amenitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const Amenity = mongoose.model("Amenity", amenitySchema);

module.exports = Amenity;
