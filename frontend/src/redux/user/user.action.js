import axios from "axios";
import { api, API_BASE_URL } from "../../api/api";
import {
  GET_PROFILE_FAILED,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILED,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
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
