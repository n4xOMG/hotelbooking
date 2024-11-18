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
  VERIFY_EMAIL_REQUEST,
  VERIFY_EMAIL_SUCCESS,
  VERIFY_EMAIL_FAILED,
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILED,
} from "./user.actionType";


export const getCurrentUserByJwt = (jwt) => async (dispatch) => {
  dispatch({ type: GET_PROFILE_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    dispatch({ type: GET_PROFILE_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      dispatch({ type: GET_PROFILE_FAILED, payload: "Session expired. Please sign in again." });
      return { error: "UNAUTHORIZED" };
    }
    dispatch({ type: GET_PROFILE_FAILED, payload: error.message });
  }
};

export const updateUserProfile = (reqData) => async (dispatch) => {
  dispatch({ type: UPDATE_PROFILE_REQUEST });
  try {
    const { data } = await api.put(`${API_BASE_URL}/user/profile`, reqData);

    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("Api error: ", error.message);
    dispatch({ type: UPDATE_PROFILE_FAILED, payload: error.message });
  }
};

export const sendEmailVerificationLink = (newEmail) => async (dispatch) => {
  try {
    await api.post(`${API_BASE_URL}/user/send-verification-email`, { newEmail });
  } catch (error) {
    console.log("Api error: ", error.message);
  }
};

export const verifyEmailLink = (token, email) => async (dispatch) => {
  dispatch({ type: VERIFY_EMAIL_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/user/verify-email`, { token, email });
    dispatch({ type: VERIFY_EMAIL_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("Api error: ", error.message);
    dispatch({ type: VERIFY_EMAIL_FAILED, payload: error.message });
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