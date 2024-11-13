import {
  BOOK_HOTEL_REQUEST,
  BOOK_HOTEL_SUCCESS,
  BOOK_HOTEL_FAILURE,
  FETCH_BOOKINGS_REQUEST,
  FETCH_BOOKINGS_SUCCESS,
  FETCH_BOOKINGS_FAILURE,
  FETCH_BOOKING_REQUEST,
  FETCH_BOOKING_SUCCESS,
  FETCH_BOOKING_FAILURE,
  UPDATE_BOOKING_REQUEST,
  UPDATE_BOOKING_SUCCESS,
  UPDATE_BOOKING_FAILURE,
  DELETE_BOOKING_REQUEST,
  DELETE_BOOKING_SUCCESS,
  DELETE_BOOKING_FAILURE,
  FETCH_BOOKINGS_BY_HOTEL_REQUEST,
  FETCH_BOOKINGS_BY_HOTEL_SUCCESS,
  FETCH_BOOKINGS_BY_HOTEL_FAILURE,
  FETCH_MANAGED_BOOKINGS_REQUEST,
  FETCH_MANAGED_BOOKINGS_SUCCESS,
  FETCH_MANAGED_BOOKINGS_FAILURE,
  FETCH_USER_BOOKINGS_REQUEST,
  FETCH_USER_BOOKINGS_SUCCESS,
  FETCH_USER_BOOKINGS_FAILURE,
} from "./booking.actionType";

const initialState = {
  bookings: [],
  bookingsByUser: [],
  booking: null,
  loading: false,
  error: null,
};

const bookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case BOOK_HOTEL_REQUEST:
    case FETCH_BOOKINGS_REQUEST:
    case FETCH_BOOKING_REQUEST:
    case UPDATE_BOOKING_REQUEST:
    case DELETE_BOOKING_REQUEST:
    case FETCH_BOOKINGS_BY_HOTEL_REQUEST:
    case FETCH_MANAGED_BOOKINGS_REQUEST:
    case FETCH_USER_BOOKINGS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case BOOK_HOTEL_SUCCESS:
      return {
        ...state,
        loading: false,
        bookings: [...state.bookings, action.payload],
      };
    case FETCH_BOOKINGS_SUCCESS:
    case FETCH_BOOKINGS_BY_HOTEL_SUCCESS:
    case FETCH_MANAGED_BOOKINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        bookings: action.payload,
      };
    case FETCH_USER_BOOKINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        bookingsByUser: action.payload,
      };
    case FETCH_BOOKING_SUCCESS:
      return {
        ...state,
        loading: false,
        booking: action.payload,
      };
    case UPDATE_BOOKING_SUCCESS:
      return {
        ...state,
        loading: false,
        bookings: state.bookings.map((booking) => (booking._id === action.payload._id ? action.payload : booking)),
      };
    case DELETE_BOOKING_SUCCESS:
      return {
        ...state,
        loading: false,
        bookings: state.bookings.filter((booking) => booking._id !== action.payload),
      };
    case BOOK_HOTEL_FAILURE:
    case FETCH_BOOKINGS_FAILURE:
    case FETCH_BOOKING_FAILURE:
    case UPDATE_BOOKING_FAILURE:
    case DELETE_BOOKING_FAILURE:
    case FETCH_BOOKINGS_BY_HOTEL_FAILURE:
    case FETCH_MANAGED_BOOKINGS_FAILURE:
    case FETCH_USER_BOOKINGS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default bookingReducer;
