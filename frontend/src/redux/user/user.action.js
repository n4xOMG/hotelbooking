import axios from "axios";
import { api, API_BASE_URL } from "../../api/api";
import {
  GET_PROFILE_FAILED,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILED,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,

 
  FETCH_USER_FAILURE,
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  UPDATE_USER_FAILED,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,

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
    const { data } = await api.put(`${API_BASE_URL}/api/user/profile`, reqData.data);

    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("Api error: ", error.message);
    dispatch({ type: UPDATE_PROFILE_FAILED, payload: error.message });
  }
};

export const fetchUsers = () => async (dispatch) => {
  dispatch({ type: FETCH_USER_REQUEST });
  try {
    const response = await fetch('/api/users'); // Adjust the API endpoint as necessary
    const data = await response.json();
    dispatch({ type: FETCH_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_USER_FAILURE, error });
  }
};

export const updateUser = (id, user) => async (dispatch) => {
  dispatch({ type: UPDATE_USER_REQUEST });
  try {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    const data = await response.json();
    dispatch({ type: UPDATE_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: UPDATE_USER_FAILED, error });
  }
};

