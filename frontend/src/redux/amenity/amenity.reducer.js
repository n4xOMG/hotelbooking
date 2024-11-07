import {
  CREATE_AMENITY_REQUEST,
  CREATE_AMENITY_SUCCESS,
  CREATE_AMENITY_FAILURE,
  FETCH_AMENITIES_REQUEST,
  FETCH_AMENITIES_SUCCESS,
  FETCH_AMENITIES_FAILURE,
  FETCH_AMENITY_REQUEST,
  FETCH_AMENITY_SUCCESS,
  FETCH_AMENITY_FAILURE,
  UPDATE_AMENITY_REQUEST,
  UPDATE_AMENITY_SUCCESS,
  UPDATE_AMENITY_FAILURE,
  DELETE_AMENITY_REQUEST,
  DELETE_AMENITY_SUCCESS,
  DELETE_AMENITY_FAILURE,
} from "./amenity.actionType";

const initialState = {
  amenities: [],
  amenity: null,
  loading: false,
  error: null,
};

const amenityReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_AMENITY_REQUEST:
    case FETCH_AMENITIES_REQUEST:
    case FETCH_AMENITY_REQUEST:
    case UPDATE_AMENITY_REQUEST:
    case DELETE_AMENITY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CREATE_AMENITY_SUCCESS:
      return {
        ...state,
        loading: false,
        amenities: [...state.amenities, action.payload],
      };
    case FETCH_AMENITIES_SUCCESS:
      return {
        ...state,
        loading: false,
        amenities: action.payload,
      };
    case FETCH_AMENITY_SUCCESS:
      return {
        ...state,
        loading: false,
        amenity: action.payload,
      };
    case UPDATE_AMENITY_SUCCESS:
      return {
        ...state,
        loading: false,
        amenities: state.amenities.map((amenity) => (amenity.id === action.payload.id ? action.payload : amenity)),
      };
    case DELETE_AMENITY_SUCCESS:
      return {
        ...state,
        loading: false,
        amenities: state.amenities.filter((amenity) => amenity.id !== action.payload),
      };
    case CREATE_AMENITY_FAILURE:
    case FETCH_AMENITIES_FAILURE:
    case FETCH_AMENITY_FAILURE:
    case UPDATE_AMENITY_FAILURE:
    case DELETE_AMENITY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default amenityReducer;
