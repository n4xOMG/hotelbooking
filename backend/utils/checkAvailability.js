// utils/checkAvailability.js

const Booking = require("../models/Booking");

/**
 * Checks if the specified hotel is available for the given date range.
 * @param {String} hotelId - The ID of the hotel.
 * @param {Date} checkInDate - The desired check-in date.
 * @param {Date} checkOutDate - The desired check-out date.
 * @returns {Boolean} - Returns true if the hotel is available, else false.
 */
const isHotelAvailableExtended = async (hotelId, checkInDate, checkOutDate) => {
  try {
    // Build booking query based on provided dates
    const bookingQuery = { hotel: hotelId, status: { $in: ["pending", "confirmed"] } };

    if (checkInDate && checkOutDate) {
      // Both dates provided
      bookingQuery.$and = [
        { checkInDate: { $lt: checkOutDate } }, // Booking starts before desired check-out
        { checkOutDate: { $gt: checkInDate } }, // Booking ends after desired check-in
      ];
    } else if (checkInDate && !checkOutDate) {
      // Only check-in date provided
      bookingQuery.checkOutDate = { $gt: checkInDate };
    } else if (!checkInDate && checkOutDate) {
      // Only check-out date provided
      bookingQuery.checkInDate = { $lt: checkOutDate };
    }

    // Check for any overlapping bookings based on the query
    const overlappingBooking = await Booking.findOne(bookingQuery);

    // If no overlapping booking is found, the hotel is available
    return !overlappingBooking;
  } catch (error) {
    console.error(`Error checking availability for hotel ${hotelId}:`, error);
    throw error;
  }
};
module.exports = { isHotelAvailableExtended };
