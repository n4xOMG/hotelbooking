import { api, API_BASE_URL } from "../../api/api";
import { FETCH_USER_CHATS_REQUEST, FETCH_USER_CHATS_SUCCESS, FETCH_USER_CHATS_FAILURE } from "./chat.actionType";

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
