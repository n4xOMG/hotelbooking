import axios from "axios";
import { API_BASE_URL } from "../../api/api";
import {
  FORGOT_PASSWORD_FAILED,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCEED,
  LOGIN_FAILED,
  LOGIN_REQUEST,
  LOGIN_SUCCEED,
  LOGOUT,
  REGISTER_FAILED,
  REGISTER_REQUEST,
  REGISTER_SUCCEED,
  RESET_PASSWORD_FAILED,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCEED,
} from "./auth.actionType";
export const loginUserAction = (loginData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/login`, loginData.data);
    if (data.token) {
      localStorage.setItem("jwt", data.token);
    }
    dispatch({ type: LOGIN_SUCCEED, payload: data.token });
    return { payload: data };
  } catch (error) {
    if (error.response) {
      console.log("Error response data: ", error.response.data);
      console.log("Error response status: ", error.response.status);

      if (error.response.status === 403) {
        dispatch({ type: LOGIN_FAILED, payload: error.response.data.message });
      } else {
        dispatch({ type: LOGIN_FAILED, payload: error.response.data.message });
      }
    } else {
      console.log("No response from server");
      dispatch({ type: LOGIN_FAILED, payload: "No response from server" });
    }
  }
};

export const registerUserAction = (registerData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/register`, registerData.data);
    dispatch({ type: REGISTER_SUCCEED, payload: data.token });
  } catch (error) {
    if (error.response) {
      console.log("Error response data: ", error.response.data);
      console.log("Error response status: ", error.response.status);

      if (error.response.status === 406) {
        dispatch({ type: REGISTER_FAILED, payload: error.response.data.message });
      } else {
        dispatch({ type: REGISTER_FAILED, payload: error.message });
      }
    } else {
      console.log("No response from server");
      dispatch({ type: REGISTER_FAILED, payload: "No response from server" });
    }
  }
};

export const sendForgotPasswordMail = (email) => async (dispatch) => {
  dispatch({ type: FORGOT_PASSWORD_REQUEST });
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });

    dispatch({ type: FORGOT_PASSWORD_SUCCEED, payload: data.message });
  } catch (error) {
    console.log("Api error: ", error.message);
    dispatch({ type: FORGOT_PASSWORD_FAILED, payload: error.message });
  }
};

export const resetPasswordAction = (code, newPassword) => async (dispatch) => {
  dispatch({ type: RESET_PASSWORD_REQUEST });
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/reset-password/${code}`, { newPassword });

    dispatch({ type: RESET_PASSWORD_SUCCEED, payload: data.message });
  } catch (error) {
    console.log("Api error: ", error.message);
    dispatch({ type: RESET_PASSWORD_FAILED, payload: error.message });
  }
};

export const logoutAction = () => ({
  type: LOGOUT,
});
