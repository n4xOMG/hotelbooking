import {
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILED,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILED,
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILED,
} from "./user.actionType";

const initialState = {
  error: null,
  user: null,
  users: [],
  loading: false,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PROFILE_REQUEST:
    case UPDATE_PROFILE_REQUEST:
    case FETCH_USER_REQUEST:
    case UPDATE_USER_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_PROFILE_SUCCESS:
    case UPDATE_PROFILE_SUCCESS:
      return { ...state, loading: false, error: null, user: action.payload };

    case FETCH_USER_SUCCESS:
      return { ...state, loading: false, error: null, users: action.payload };

    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        users: state.users.map((user) => (user._id === action.payload._id ? action.payload : user)),
      };

    case GET_PROFILE_FAILED:
    case UPDATE_PROFILE_FAILED:
    case FETCH_USER_FAILURE:
    case UPDATE_USER_FAILED:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};