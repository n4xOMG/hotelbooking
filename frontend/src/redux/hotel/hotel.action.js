import axios from "axios";
import { api } from "../../api/api";
import { API_BASE_URL } from "../../api/api";
import {
  FETCH_HOTELS_REQUEST,
  FETCH_HOTELS_SUCCESS,
  FETCH_HOTELS_FAILURE,
  FETCH_HOTEL_REQUEST,
  FETCH_HOTEL_SUCCESS,
  FETCH_HOTEL_FAILURE,
  CREATE_HOTEL_REQUEST,
  CREATE_HOTEL_SUCCESS,
  CREATE_HOTEL_FAILURE,
  UPDATE_HOTEL_REQUEST,
  UPDATE_HOTEL_SUCCESS,
  UPDATE_HOTEL_FAILURE,
  BOOK_HOTEL_REQUEST,
  BOOK_HOTEL_SUCCESS,
  BOOK_HOTEL_FAILURE,
} from "./hotel.actionType";

// Fetch all hotels
export const fetchHotels = (filters) => async (dispatch) => {
  dispatch({ type: FETCH_HOTELS_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/hotels`, { params: filters });
    dispatch({ type: FETCH_HOTELS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_HOTELS_FAILURE, payload: error.message });
  }
};

// Fetch single hotel by ID
export const fetchHotelById = (id) => async (dispatch) => {
  dispatch({ type: FETCH_HOTEL_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/hotels/${id}`);
    console.log(data);
    dispatch({ type: FETCH_HOTEL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_HOTEL_FAILURE, payload: error.message });
  }
};

// Create a new hotel
export const createHotel = (hotelData) => async (dispatch) => {
  dispatch({ type: CREATE_HOTEL_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/hotels`, hotelData);
    dispatch({ type: CREATE_HOTEL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: CREATE_HOTEL_FAILURE, payload: error.message });
  }
};

// Update an existing hotel
export const updateHotel = (id, hotelData) => async (dispatch) => {
  dispatch({ type: UPDATE_HOTEL_REQUEST });
  try {
    const { data } = await api.put(`${API_BASE_URL}/hotels/${id}`, hotelData);
    dispatch({ type: UPDATE_HOTEL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: UPDATE_HOTEL_FAILURE, payload: error.message });
  }
};

// Book a hotel
export const bookHotel = (id, bookingData) => async (dispatch) => {
  dispatch({ type: BOOK_HOTEL_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/hotels/${id}/book`, bookingData);
    dispatch({ type: BOOK_HOTEL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: BOOK_HOTEL_FAILURE, payload: error.message });
  }
};
