// user.reducer.js

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
  user: null,    // For individual user profile
  users: [],     // For list of users (admin)
  loading: false,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    // Get Current User Profile
    case GET_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
      };
    case GET_PROFILE_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Update Current User Profile
    case UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
      };
    case UPDATE_PROFILE_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Fetch All Users (Admin)
    case FETCH_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
      };
    case FETCH_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Update User by ID (Admin)
    case UPDATE_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_USER_SUCCESS:
      // Update the specific user in the users array
      const updatedUsers = state.users.map((user) =>
        user._id === action.payload._id ? action.payload : user
      );
      return {
        ...state,
        loading: false,
        users: updatedUsers,
      };
    case UPDATE_USER_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Default case
    default:
      return state;
  }
};

export default userReducer;