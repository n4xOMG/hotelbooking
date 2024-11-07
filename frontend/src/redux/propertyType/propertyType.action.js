import { api, API_BASE_URL } from "../../api/api";
import axios from "axios";
import {
  CREATE_PROPERTY_TYPE_REQUEST,
  CREATE_PROPERTY_TYPE_SUCCESS,
  CREATE_PROPERTY_TYPE_FAILURE,
  GET_PROPERTY_TYPES_REQUEST,
  GET_PROPERTY_TYPES_SUCCESS,
  GET_PROPERTY_TYPES_FAILURE,
  GET_PROPERTY_TYPE_REQUEST,
  GET_PROPERTY_TYPE_SUCCESS,
  GET_PROPERTY_TYPE_FAILURE,
  UPDATE_PROPERTY_TYPE_REQUEST,
  UPDATE_PROPERTY_TYPE_SUCCESS,
  UPDATE_PROPERTY_TYPE_FAILURE,
  DELETE_PROPERTY_TYPE_REQUEST,
  DELETE_PROPERTY_TYPE_SUCCESS,
  DELETE_PROPERTY_TYPE_FAILURE,
} from "./propertyType.actionType";

// Create a new property type (admin only)
export const createPropertyType = (propertyTypeData) => async (dispatch) => {
  dispatch({ type: CREATE_PROPERTY_TYPE_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/property-types`, propertyTypeData);
    dispatch({ type: CREATE_PROPERTY_TYPE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: CREATE_PROPERTY_TYPE_FAILURE, payload: error.response.data.message });
  }
};

// Get all property types
export const getPropertyTypes = () => async (dispatch) => {
  dispatch({ type: GET_PROPERTY_TYPES_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/property-types`);
    dispatch({ type: GET_PROPERTY_TYPES_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_PROPERTY_TYPES_FAILURE, payload: error.response.data.message });
  }
};

// Get a single property type by ID
export const getPropertyType = (id) => async (dispatch) => {
  dispatch({ type: GET_PROPERTY_TYPE_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/property-types/${id}`);
    dispatch({ type: GET_PROPERTY_TYPE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_PROPERTY_TYPE_FAILURE, payload: error.response.data.message });
  }
};

// Update a property type (admin only)
export const updatePropertyType = (id, propertyTypeData) => async (dispatch) => {
  dispatch({ type: UPDATE_PROPERTY_TYPE_REQUEST });
  try {
    const { data } = await api.put(`${API_BASE_URL}/property-types/${id}`, propertyTypeData);
    dispatch({ type: UPDATE_PROPERTY_TYPE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: UPDATE_PROPERTY_TYPE_FAILURE, payload: error.response.data.message });
  }
};

// Delete a property type (admin only)
export const deletePropertyType = (id) => async (dispatch) => {
  dispatch({ type: DELETE_PROPERTY_TYPE_REQUEST });
  try {
    await api.delete(`${API_BASE_URL}/property-types/${id}`);
    dispatch({ type: DELETE_PROPERTY_TYPE_SUCCESS, payload: id });
  } catch (error) {
    dispatch({ type: DELETE_PROPERTY_TYPE_FAILURE, payload: error.response.data.message });
  }
};
