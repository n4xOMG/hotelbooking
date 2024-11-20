import axios from "axios";
import { API_BASE_URL, api } from "../../api/api";
import {
  CREATE_HOTEL_FAILURE,
  CREATE_HOTEL_REQUEST,
  CREATE_HOTEL_SUCCESS,
  DELETE_HOTEL_FAILURE,
  DELETE_HOTEL_REQUEST,
  DELETE_HOTEL_SUCCESS,
  FETCH_HOTELS_BY_USER_FAILURE,
  FETCH_HOTELS_BY_USER_REQUEST,
  FETCH_HOTELS_BY_USER_SUCCESS,
  FETCH_HOTELS_FAILURE,
  FETCH_HOTELS_REQUEST,
  FETCH_HOTELS_SUCCESS,
  FETCH_HOTEL_FAILURE,
  FETCH_HOTEL_REQUEST,
  FETCH_HOTEL_SUCCESS,
  UPDATE_HOTEL_FAILURE,
  UPDATE_HOTEL_REQUEST,
  UPDATE_HOTEL_SUCCESS,
  CHECK_AVAILABILITY_FAILURE,
  CHECK_AVAILABILITY_SUCCESS,
  CHECK_AVAILABILITY_REQUEST,
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
    return { payload: data };
  } catch (error) {
    dispatch({ type: FETCH_HOTEL_FAILURE, payload: error.message });
  }
};

// Fetch single hotel by user id
export const fetchHotelByUser = (id) => async (dispatch) => {
  dispatch({ type: FETCH_HOTELS_BY_USER_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/hotels/user/${id}`);
    console.log(data);
    dispatch({ type: FETCH_HOTELS_BY_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_HOTELS_BY_USER_FAILURE, payload: error.message });
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
// Delete an existing hotel
export const deleteHotel = (id) => async (dispatch) => {
  dispatch({ type: DELETE_HOTEL_REQUEST });
  try {
    const { data } = await api.delete(`${API_BASE_URL}/hotels/${id}`);
    dispatch({ type: DELETE_HOTEL_SUCCESS, payload: id });
  } catch (error) {
    dispatch({ type: DELETE_HOTEL_FAILURE, payload: error.message });
  }
};

// Check Availability Action
export const checkAvailability = (hotelId, startDate, endDate) => async (dispatch) => {
  dispatch({ type: CHECK_AVAILABILITY_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/bookings/check-availability/${hotelId}`, {
      params: { startDate, endDate },
    });
    dispatch({ type: CHECK_AVAILABILITY_SUCCESS, payload: data });
    return data;
  } catch (error) {
    dispatch({ type: CHECK_AVAILABILITY_FAILURE, payload: error.message });
    throw error;
  }
};

// Fetch Available Hotels
export const fetchAvailableHotels = () => async (dispatch) => {
  dispatch({ type: FETCH_HOTELS_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/hotels/available`);
    dispatch({ type: FETCH_HOTELS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_HOTELS_FAILURE, payload: error.message });
  }
};


export const reportHotel = (hotelId) => async (dispatch) => {
  dispatch({ type: 'REPORT_HOTEL_REQUEST' });
  try {
    const response = await axios.post(`${API_BASE_URL}/hotels/${hotelId}/report`);
    dispatch({ type: 'REPORT_HOTEL_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({
      type: 'REPORT_HOTEL_FAILURE',
      payload: error.response?.data?.message || error.message,
    });
  }
};