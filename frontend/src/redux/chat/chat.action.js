import { api, API_BASE_URL } from "../../api/api";
import {
  FETCH_USER_CHATS_REQUEST,
  FETCH_USER_CHATS_SUCCESS,
  FETCH_USER_CHATS_FAILURE,
  FETCH_CHAT_BY_ID_REQUEST,
  FETCH_CHAT_BY_ID_SUCCESS,
  FETCH_CHAT_BY_ID_FAILURE,
} from "./chat.actionType";

// Fetch user chats
export const fetchUserChats = () => async (dispatch) => {
  dispatch({ type: FETCH_USER_CHATS_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/chats`);
    dispatch({ type: FETCH_USER_CHATS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_USER_CHATS_FAILURE, payload: error.message });
  }
};

// Fetch chat by ID
export const fetchChatById = (chatId) => async (dispatch) => {
  dispatch({ type: FETCH_CHAT_BY_ID_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/chats/${chatId}`);
    dispatch({ type: FETCH_CHAT_BY_ID_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    dispatch({ type: FETCH_CHAT_BY_ID_FAILURE, payload: error.message });
    throw error;
  }
};
