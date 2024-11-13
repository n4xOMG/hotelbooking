import { api, API_BASE_URL } from "../../api/api";
import {
  BOOK_HOTEL_REQUEST,
  BOOK_HOTEL_SUCCESS,
  BOOK_HOTEL_FAILURE,
  FETCH_BOOKINGS_REQUEST,
  FETCH_BOOKINGS_SUCCESS,
  FETCH_BOOKINGS_FAILURE,
  FETCH_BOOKING_REQUEST,
  FETCH_BOOKING_SUCCESS,
  FETCH_BOOKING_FAILURE,
  UPDATE_BOOKING_REQUEST,
  UPDATE_BOOKING_SUCCESS,
  UPDATE_BOOKING_FAILURE,
  DELETE_BOOKING_REQUEST,
  DELETE_BOOKING_SUCCESS,
  DELETE_BOOKING_FAILURE,
  FETCH_BOOKINGS_BY_HOTEL_REQUEST,
  FETCH_BOOKINGS_BY_HOTEL_SUCCESS,
  FETCH_BOOKINGS_BY_HOTEL_FAILURE,
  FETCH_MANAGED_BOOKINGS_REQUEST,
  FETCH_MANAGED_BOOKINGS_SUCCESS,
  FETCH_MANAGED_BOOKINGS_FAILURE,
  FETCH_USER_BOOKINGS_REQUEST,
  FETCH_USER_BOOKINGS_SUCCESS,
  FETCH_USER_BOOKINGS_FAILURE,
  CHECK_AVAILABILITY_SUCCESS,
  CHECK_AVAILABILITY_REQUEST,
  CHECK_AVAILABILITY_FAILURE,
} from "./booking.actionType";

// Book a hotel
export const bookHotel = (bookingData) => async (dispatch) => {
  dispatch({ type: BOOK_HOTEL_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/bookings`, bookingData);
    dispatch({ type: BOOK_HOTEL_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    dispatch({ type: BOOK_HOTEL_FAILURE, payload: error.message });
  }
};

// Fetch all bookings for the logged-in user
export const fetchBookings = () => async (dispatch) => {
  dispatch({ type: FETCH_BOOKINGS_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/bookings`);
    dispatch({ type: FETCH_BOOKINGS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_BOOKINGS_FAILURE, payload: error.message });
  }
};

// Fetch a specific booking by ID
export const fetchBooking = (bookingId) => async (dispatch) => {
  dispatch({ type: FETCH_BOOKING_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/bookings/${bookingId}`);
    dispatch({ type: FETCH_BOOKING_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_BOOKING_FAILURE, payload: error.message });
  }
};

// Update a booking
export const updateBooking = (bookingId, bookingData) => async (dispatch) => {
  dispatch({ type: UPDATE_BOOKING_REQUEST });
  try {
    const response = await api.put(`${API_BASE_URL}/bookings/${bookingId}`, bookingData);
    dispatch({ type: UPDATE_BOOKING_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: UPDATE_BOOKING_FAILURE, payload: error.message });
  }
};

// Delete a booking
export const deleteBooking = (bookingId) => async (dispatch) => {
  dispatch({ type: DELETE_BOOKING_REQUEST });
  try {
    await api.delete(`${API_BASE_URL}/bookings/${bookingId}`);
    dispatch({ type: DELETE_BOOKING_SUCCESS, payload: bookingId });
  } catch (error) {
    dispatch({ type: DELETE_BOOKING_FAILURE, payload: error.message });
  }
};
// Fetch bookings by hotel
export const fetchBookingsByHotel = (hotelId) => async (dispatch) => {
  dispatch({ type: FETCH_BOOKINGS_BY_HOTEL_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/bookings/hotel/${hotelId}`);
    dispatch({ type: FETCH_BOOKINGS_BY_HOTEL_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_BOOKINGS_BY_HOTEL_FAILURE, payload: error.message });
  }
};

// Fetch bookings for hotels managed by the user
export const fetchManagedBookings = () => async (dispatch) => {
  dispatch({ type: FETCH_MANAGED_BOOKINGS_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/bookings/managed`);
    dispatch({ type: FETCH_MANAGED_BOOKINGS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_MANAGED_BOOKINGS_FAILURE, payload: error.message });
  }
};
// Fetch bookings made by the user
export const fetchUserBookings = () => async (dispatch) => {
  dispatch({ type: FETCH_USER_BOOKINGS_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/bookings/user`);
    dispatch({ type: FETCH_USER_BOOKINGS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_USER_BOOKINGS_FAILURE, payload: error.message });
  }
};

//Check if the hotel is available for booking in a certain date range
export const checkAvailability = (hotelId, startDate, endDate) => async (dispatch) => {
  dispatch({ type: CHECK_AVAILABILITY_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/bookings/check-availability/${hotelId}?startDate=${startDate}&endDate=${endDate}`);
    dispatch({ type: CHECK_AVAILABILITY_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    dispatch({ type: CHECK_AVAILABILITY_FAILURE, payload: error.message });
    throw error;
  }
};
