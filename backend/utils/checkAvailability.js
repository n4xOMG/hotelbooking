// utils/checkAvailability.js

const Booking = require("../models/Booking");

/**
 * Checks if the specified hotel is available for the given date range.
 * @param {String} hotelId - The ID of the hotel.
 * @param {Date} checkInDate - The desired check-in date.
 * @param {Date} checkOutDate - The desired check-out date.
 * @returns {Boolean} - Returns true if the hotel is available, else false.
 */
const isHotelAvailable = async (hotelId, checkInDate, checkOutDate) => {
  try {
    // Check for any overlapping bookings for the hotel
    const overlappingBooking = await Booking.findOne({
      hotel: hotelId,
      $and: [
        { checkInDate: { $lt: checkOutDate } }, // Booking starts before the desired check-out
        { checkOutDate: { $gt: checkInDate } }, // Booking ends after the desired check-in
      ],
      status: { $in: ["pending", "confirmed"] }, // Consider only active bookings
    });

    // If no overlapping booking is found, the hotel is available
    return !overlappingBooking;
  } catch (error) {
    console.error(`Error checking availability for hotel ${hotelId}:`, error);
    throw error;
  }
};

module.exports = { isHotelAvailable };
