// user.action.js

import axios from "axios";
import { api, API_BASE_URL } from "../../api/api";
import {
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILED,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILED,
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILED,
} from "./user.actionType";

// Helper function to get the JWT token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Get Current User Profile by JWT
export const getCurrentUserByJwt = () => async (dispatch) => {
  dispatch({ type: GET_PROFILE_REQUEST });
  try {
    const response = await axios.get(`${API_BASE_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    dispatch({ type: GET_PROFILE_SUCCESS, payload: response.data });
    return { payload: response.data };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      dispatch({
        type: GET_PROFILE_FAILED,
        payload: "Session expired. Please sign in again.",
      });
      return { error: "UNAUTHORIZED" };
    }
    dispatch({
      type: GET_PROFILE_FAILED,
      payload: error.response?.data?.message || error.message,
    });
    return { error: error.message };
  }
};

// Update Current User Profile
export const updateUserProfile = (reqData) => async (dispatch) => {
  dispatch({ type: UPDATE_PROFILE_REQUEST });
  try {
    const response = await axios.put(
      `${API_BASE_URL}/user/profile`,
      reqData,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: response.data });
    return { payload: response.data };
  } catch (error) {
    console.error("API Error:", error.message);
    dispatch({
      type: UPDATE_PROFILE_FAILED,
      payload: error.response?.data?.message || error.message,
    });
    return { error: error.message };
  }
};

// Fetch All Users (Admin Only)
export const fetchUsers = () => async (dispatch) => {
  dispatch({ type: FETCH_USER_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/user`);
    dispatch({ type: FETCH_USER_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: FETCH_USER_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Fetch Single User by ID (Admin Only)
export const fetchUserById = (id) => async (dispatch) => {
  dispatch({ type: FETCH_USER_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/user/${id}`);
    dispatch({ type: FETCH_USER_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: FETCH_USER_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Update User by ID (Admin Only)
export const updateUser = (id, userData) => async (dispatch) => {
  dispatch({ type: UPDATE_USER_REQUEST });
  try {
    const response = await api.put(`${API_BASE_URL}/user/${id}`, userData);
    dispatch({ type: UPDATE_USER_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: UPDATE_USER_FAILED,
      payload: error.response?.data?.message || error.message,
    });
  }
};