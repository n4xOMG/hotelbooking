import { api, API_BASE_URL } from "../../api/api";
import {
  CREATE_PAYMENT_INTENT_REQUEST,
  CREATE_PAYMENT_INTENT_SUCCESS,
  CREATE_PAYMENT_INTENT_FAILURE,
  CONFIRM_PAYMENT_REQUEST,
  CONFIRM_PAYMENT_SUCCESS,
  CONFIRM_PAYMENT_FAILURE,
  GET_PAYMENT_HISTORY_REQUEST,
  GET_PAYMENT_HISTORY_SUCCESS,
  GET_PAYMENT_HISTORY_FAILURE,
} from "./payment.actionType";

// Create Payment Intent
export const createPaymentIntent = (paymentData) => async (dispatch) => {
  dispatch({ type: CREATE_PAYMENT_INTENT_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/payments/create-payment-intent`, paymentData);
    dispatch({ type: CREATE_PAYMENT_INTENT_SUCCESS, payload: data });
    console.log("Data: ", data);
    return data; // Ensure the response data is returned
  } catch (error) {
    dispatch({ type: CREATE_PAYMENT_INTENT_FAILURE, payload: error.message });
    throw error;
  }
};

// Confirm Payment
export const confirmPayment = (paymentData) => async (dispatch) => {
  dispatch({ type: CONFIRM_PAYMENT_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/payments/confirm-payment`, paymentData);
    dispatch({ type: CONFIRM_PAYMENT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: CONFIRM_PAYMENT_FAILURE, payload: error.message });
  }
};

// Get Payment History
export const getPaymentHistory = () => async (dispatch) => {
  dispatch({ type: GET_PAYMENT_HISTORY_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/payments/history`);
    dispatch({ type: GET_PAYMENT_HISTORY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_PAYMENT_HISTORY_FAILURE, payload: error.message });
  }
};
