import {
  GET_PROFILE_FAILED,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILED,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
} from "./user.actionType";

const initialState = {
  error: null,
  user: null,
  loading: false,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PROFILE_REQUEST:
    case UPDATE_PROFILE_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_PROFILE_SUCCESS:
    case UPDATE_PROFILE_SUCCESS:
      return { ...state, loading: false, error: null, user: action.payload };

    case GET_PROFILE_FAILED:
    case UPDATE_PROFILE_FAILED:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
