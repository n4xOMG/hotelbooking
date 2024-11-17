const mongoose = require("mongoose");
const hotelSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: String,
  location: { type: String, required: true },
  propertyType: { type: mongoose.Schema.Types.ObjectId, ref: "PropertyType", required: true },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }],
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true }],
  totalRooms: { type: Number, required: true },
  totalBeds: { type: Number, required: true },
  totalBaths: { type: Number, required: true },
  pricePerNight: { type: Number, required: true },
  amenities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Amenity", required: true }],
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating", required: true }],
  avgRating: { type: Number, default: 5 },
  images: [String],
  maxGuests: { type: Number, required: true, default: 1 },
  petFriendly: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: false },
  isProcessed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Hotel", hotelSchema);
