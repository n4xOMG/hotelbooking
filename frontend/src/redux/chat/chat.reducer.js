import {
  FETCH_USER_CHATS_REQUEST,
  FETCH_USER_CHATS_SUCCESS,
  FETCH_USER_CHATS_FAILURE,
  FETCH_CHAT_BY_ID_REQUEST,
  FETCH_CHAT_BY_ID_SUCCESS,
  FETCH_CHAT_BY_ID_FAILURE,
} from "./chat.actionType";

const initialState = {
  chats: [],
  currentChat: null,
  loading: false,
  error: null,
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_CHATS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_USER_CHATS_SUCCESS:
      return {
        ...state,
        loading: false,
        chats: action.payload,
      };
    case FETCH_USER_CHATS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_CHAT_BY_ID_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_CHAT_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        currentChat: action.payload,
      };
    case FETCH_CHAT_BY_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default chatReducer;
