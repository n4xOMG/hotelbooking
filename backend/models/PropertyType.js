const mongoose = require("mongoose");

const propertyTypeSchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true },
  description: { type: String },
  icon: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const PropertyType = mongoose.model("PropertyType", propertyTypeSchema);

module.exports = PropertyType;
