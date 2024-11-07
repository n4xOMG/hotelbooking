import { api } from "../../api/api";
import axios from "axios";
import {
  CREATE_AMENITY_REQUEST,
  CREATE_AMENITY_SUCCESS,
  CREATE_AMENITY_FAILURE,
  FETCH_AMENITIES_REQUEST,
  FETCH_AMENITIES_SUCCESS,
  FETCH_AMENITIES_FAILURE,
  FETCH_AMENITY_REQUEST,
  FETCH_AMENITY_SUCCESS,
  FETCH_AMENITY_FAILURE,
  UPDATE_AMENITY_REQUEST,
  UPDATE_AMENITY_SUCCESS,
  UPDATE_AMENITY_FAILURE,
  DELETE_AMENITY_REQUEST,
  DELETE_AMENITY_SUCCESS,
  DELETE_AMENITY_FAILURE,
} from "./amenity.actionType";

// Create a new amenity (admin only)
export const createAmenity = (amenityData) => async (dispatch) => {
  dispatch({ type: CREATE_AMENITY_REQUEST });
  try {
    const { data } = await api.post("/amenities", amenityData);
    dispatch({ type: CREATE_AMENITY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: CREATE_AMENITY_FAILURE, payload: error.message });
  }
};

// Fetch all amenities
export const fetchAmenities = () => async (dispatch) => {
  dispatch({ type: FETCH_AMENITIES_REQUEST });
  try {
    const { data } = await axios.get("/amenities");
    dispatch({ type: FETCH_AMENITIES_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_AMENITIES_FAILURE, payload: error.message });
  }
};

// Fetch a single amenity by ID
export const fetchAmenity = (id) => async (dispatch) => {
  dispatch({ type: FETCH_AMENITY_REQUEST });
  try {
    const { data } = await axios.get(`/amenities/${id}`);
    dispatch({ type: FETCH_AMENITY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_AMENITY_FAILURE, payload: error.message });
  }
};

// Update an amenity (admin only)
export const updateAmenity = (id, amenityData) => async (dispatch) => {
  dispatch({ type: UPDATE_AMENITY_REQUEST });
  try {
    const { data } = await api.put(`/amenities/${id}`, amenityData);
    dispatch({ type: UPDATE_AMENITY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: UPDATE_AMENITY_FAILURE, payload: error.message });
  }
};

// Delete an amenity (admin only)
export const deleteAmenity = (id) => async (dispatch) => {
  dispatch({ type: DELETE_AMENITY_REQUEST });
  try {
    await api.delete(`/amenities/${id}`);
    dispatch({ type: DELETE_AMENITY_SUCCESS, payload: id });
  } catch (error) {
    dispatch({ type: DELETE_AMENITY_FAILURE, payload: error.message });
  }
};
