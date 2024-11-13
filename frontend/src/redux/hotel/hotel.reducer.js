import {
  CREATE_HOTEL_FAILURE,
  CREATE_HOTEL_REQUEST,
  CREATE_HOTEL_SUCCESS,
  DELETE_HOTEL_SUCCESS,
  FETCH_HOTELS_BY_USER_FAILURE,
  FETCH_HOTELS_BY_USER_SUCCESS,
  FETCH_HOTELS_FAILURE,
  FETCH_HOTELS_REQUEST,
  FETCH_HOTELS_SUCCESS,
  FETCH_HOTEL_FAILURE,
  FETCH_HOTEL_REQUEST,
  FETCH_HOTEL_SUCCESS,
  UPDATE_HOTEL_FAILURE,
  UPDATE_HOTEL_REQUEST,
  UPDATE_HOTEL_SUCCESS,
} from "./hotel.actionType";

const initialState = {
  hotels: [],
  hotelsByUser: [],
  hotel: null,
  loading: false,
  error: null,
};

const hotelReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_HOTELS_REQUEST:
    case FETCH_HOTEL_REQUEST:
    case CREATE_HOTEL_REQUEST:
    case UPDATE_HOTEL_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_HOTELS_SUCCESS:
      return {
        ...state,
        loading: false,
        hotels: action.payload,
      };
    case FETCH_HOTELS_BY_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        hotelsByUser: action.payload,
      };
    case FETCH_HOTEL_SUCCESS:
      return {
        ...state,
        loading: false,
        hotel: action.payload,
      };
    case CREATE_HOTEL_SUCCESS:
      return {
        ...state,
        loading: false,
        hotelsByUser: [...state.hotelsByUser, action.payload],
      };
    case UPDATE_HOTEL_SUCCESS:
      return {
        ...state,
        loading: false,
        hotel: action.payload,
        hotelsByUser: state.hotelsByUser.map((hotel) => (hotel._id === action.payload._id ? action.payload : hotel)),
      };
    case DELETE_HOTEL_SUCCESS:
      return {
        ...state,
        loading: false,
        hotelsByUser: state.hotelsByUser.filter((hotel) => hotel._id !== action.payload),
      };
    case FETCH_HOTELS_FAILURE:
    case FETCH_HOTELS_BY_USER_FAILURE:
    case FETCH_HOTEL_FAILURE:
    case CREATE_HOTEL_FAILURE:
    case UPDATE_HOTEL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default hotelReducer;
