import { api, API_BASE_URL } from "../../api/api";
import axios from "axios";
import {
  CREATE_RATING_REQUEST,
  CREATE_RATING_SUCCESS,
  CREATE_RATING_FAILURE,
  GET_USER_RATINGS_REQUEST,
  GET_USER_RATINGS_SUCCESS,
  GET_USER_RATINGS_FAILURE,
  GET_ALL_RATINGS_REQUEST,
  GET_ALL_RATINGS_SUCCESS,
  GET_ALL_RATINGS_FAILURE,
  GET_RATING_REQUEST,
  GET_RATING_SUCCESS,
  GET_RATING_FAILURE,
  UPDATE_RATING_REQUEST,
  UPDATE_RATING_SUCCESS,
  UPDATE_RATING_FAILURE,
  DELETE_RATING_REQUEST,
  DELETE_RATING_SUCCESS,
  DELETE_RATING_FAILURE,
  FETCH_RATINGS_BY_HOTEL_REQUEST,
  FETCH_RATINGS_BY_HOTEL_SUCCESS,
  FETCH_RATINGS_BY_HOTEL_FAILURE,
} from "./rating.actionType";

// Create a new rating
export const createRating = (ratingData) => async (dispatch) => {
  dispatch({ type: CREATE_RATING_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/ratings`, ratingData);
    dispatch({ type: CREATE_RATING_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: CREATE_RATING_FAILURE, payload: errorMessage });
  }
};

// Get ratings by user
export const getUserRatings = () => async (dispatch) => {
  dispatch({ type: GET_USER_RATINGS_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/ratings/user`);
    dispatch({ type: GET_USER_RATINGS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_USER_RATINGS_FAILURE, payload: error.message });
  }
};

// Get all ratings
export const getAllRatings = () => async (dispatch) => {
  dispatch({ type: GET_ALL_RATINGS_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/ratings`);
    dispatch({ type: GET_ALL_RATINGS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_ALL_RATINGS_FAILURE, payload: error.message });
  }
};

// Get a specific rating by ID
export const getRatingById = (id) => async (dispatch) => {
  dispatch({ type: GET_RATING_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/ratings/${id}`);
    dispatch({ type: GET_RATING_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_RATING_FAILURE, payload: error.message });
  }
};

// Update a rating
export const updateRating = (id, ratingData) => async (dispatch) => {
  dispatch({ type: UPDATE_RATING_REQUEST });
  try {
    const { data } = await api.put(`${API_BASE_URL}/ratings/${id}`, ratingData);
    dispatch({ type: UPDATE_RATING_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: UPDATE_RATING_FAILURE, payload: error.message });
  }
};

// Delete a rating
export const deleteRating = (id) => async (dispatch) => {
  dispatch({ type: DELETE_RATING_REQUEST });
  try {
    await api.delete(`${API_BASE_URL}/ratings/${id}`);
    dispatch({ type: DELETE_RATING_SUCCESS, payload: id });
  } catch (error) {
    dispatch({ type: DELETE_RATING_FAILURE, payload: error.message });
  }
};

// Fetch ratings by hotel
export const fetchRatingsByHotel = (hotelId) => async (dispatch) => {
  dispatch({ type: FETCH_RATINGS_BY_HOTEL_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/ratings/hotel/${hotelId}`);
    dispatch({ type: FETCH_RATINGS_BY_HOTEL_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_RATINGS_BY_HOTEL_FAILURE, payload: error.message });
  }
};
