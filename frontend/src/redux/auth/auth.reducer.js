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

const initialState = {
  jwt: null,
  error: null,
  user: null,
  loading: false,
  forgotPasswordMessage: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
    case FORGOT_PASSWORD_REQUEST:
    case RESET_PASSWORD_REQUEST:
      return { ...state, loading: true, error: null };

    case RESET_PASSWORD_SUCCEED:
      return { ...state, loading: false, error: null, user: action.payload };
    case LOGIN_SUCCEED:
    case REGISTER_SUCCEED:
      return { ...state, jwt: action.payload, loading: false };

    case FORGOT_PASSWORD_SUCCEED:
      return { ...state, loading: false, forgotPasswordMessage: action.payload };

    case LOGIN_FAILED:
    case REGISTER_FAILED:
    case FORGOT_PASSWORD_FAILED:
    case RESET_PASSWORD_FAILED:
      return { ...state, loading: false, error: action.payload };

    case LOGOUT:
      return {
        ...initialState,
        loading: false,
      };

    default:
      return state;
  }
};
