import { FETCH_USER_CHATS_REQUEST, FETCH_USER_CHATS_SUCCESS, FETCH_USER_CHATS_FAILURE } from "./chat.actionType";

const initialState = {
  chats: [],
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
    default:
      return state;
  }
};

export default chatReducer;
