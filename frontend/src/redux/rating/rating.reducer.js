import {
  CREATE_RATING_REQUEST,
  CREATE_RATING_SUCCESS,
  CREATE_RATING_FAILURE,
  GET_USER_RATINGS_REQUEST,
  GET_USER_RATINGS_SUCCESS,
  GET_USER_RATINGS_FAILURE,
  GET_ALL_RATINGS_REQUEST,
  GET_ALL_RATINGS_SUCCESS,
  GET_ALL_RATINGS_FAILURE,
  GET_RATING_REQUEST,
  GET_RATING_SUCCESS,
  GET_RATING_FAILURE,
  UPDATE_RATING_REQUEST,
  UPDATE_RATING_SUCCESS,
  UPDATE_RATING_FAILURE,
  DELETE_RATING_REQUEST,
  DELETE_RATING_SUCCESS,
  DELETE_RATING_FAILURE,
  FETCH_RATINGS_BY_HOTEL_REQUEST,
  FETCH_RATINGS_BY_HOTEL_SUCCESS,
  FETCH_RATINGS_BY_HOTEL_FAILURE,
} from "./rating.actionType";

const initialState = {
  ratings: [],
  ratingsByHotel: [],
  rating: null,
  loading: false,
  error: null,
};

const ratingReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_RATING_REQUEST:
    case GET_USER_RATINGS_REQUEST:
    case GET_ALL_RATINGS_REQUEST:
    case GET_RATING_REQUEST:
    case UPDATE_RATING_REQUEST:
    case DELETE_RATING_REQUEST:
    case FETCH_RATINGS_BY_HOTEL_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CREATE_RATING_SUCCESS:
      return {
        ...state,
        loading: false,
        ratings: [...state.ratings, action.payload],
      };
    case GET_USER_RATINGS_SUCCESS:
    case GET_ALL_RATINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        ratings: action.payload,
      };
    case FETCH_RATINGS_BY_HOTEL_SUCCESS:
      return {
        ...state,
        loading: false,
        ratingsByHotel: action.payload,
      };
    case GET_RATING_SUCCESS:
      return {
        ...state,
        loading: false,
        rating: action.payload,
      };
    case UPDATE_RATING_SUCCESS:
      return {
        ...state,
        loading: false,
        ratings: state.ratings.map((rating) => (rating.id === action.payload.id ? action.payload : rating)),
      };
    case DELETE_RATING_SUCCESS:
      return {
        ...state,
        loading: false,
        ratings: state.ratings.filter((rating) => rating.id !== action.payload),
      };
    case CREATE_RATING_FAILURE:
    case GET_USER_RATINGS_FAILURE:
    case GET_ALL_RATINGS_FAILURE:
    case GET_RATING_FAILURE:
    case UPDATE_RATING_FAILURE:
    case DELETE_RATING_FAILURE:
    case FETCH_RATINGS_BY_HOTEL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default ratingReducer;
