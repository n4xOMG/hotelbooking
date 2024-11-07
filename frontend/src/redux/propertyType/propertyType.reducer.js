import {
  CREATE_PROPERTY_TYPE_REQUEST,
  CREATE_PROPERTY_TYPE_SUCCESS,
  CREATE_PROPERTY_TYPE_FAILURE,
  GET_PROPERTY_TYPES_REQUEST,
  GET_PROPERTY_TYPES_SUCCESS,
  GET_PROPERTY_TYPES_FAILURE,
  GET_PROPERTY_TYPE_REQUEST,
  GET_PROPERTY_TYPE_SUCCESS,
  GET_PROPERTY_TYPE_FAILURE,
  UPDATE_PROPERTY_TYPE_REQUEST,
  UPDATE_PROPERTY_TYPE_SUCCESS,
  UPDATE_PROPERTY_TYPE_FAILURE,
  DELETE_PROPERTY_TYPE_REQUEST,
  DELETE_PROPERTY_TYPE_SUCCESS,
  DELETE_PROPERTY_TYPE_FAILURE,
} from "./propertyType.actionType";

const initialState = {
  propertyTypes: [],
  propertyType: null,
  loading: false,
  error: null,
};

const propertyTypeReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_PROPERTY_TYPE_REQUEST:
    case GET_PROPERTY_TYPES_REQUEST:
    case GET_PROPERTY_TYPE_REQUEST:
    case UPDATE_PROPERTY_TYPE_REQUEST:
    case DELETE_PROPERTY_TYPE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CREATE_PROPERTY_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        propertyTypes: [...state.propertyTypes, action.payload],
      };
    case GET_PROPERTY_TYPES_SUCCESS:
      return {
        ...state,
        loading: false,
        propertyTypes: action.payload,
      };
    case GET_PROPERTY_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        propertyType: action.payload,
      };
    case UPDATE_PROPERTY_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        propertyTypes: state.propertyTypes.map((type) => (type._id === action.payload._id ? action.payload : type)),
      };

    case DELETE_PROPERTY_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        propertyTypes: state.propertyTypes.filter((type) => type.id !== action.payload),
      };
    case CREATE_PROPERTY_TYPE_FAILURE:
    case GET_PROPERTY_TYPES_FAILURE:
    case GET_PROPERTY_TYPE_FAILURE:
    case UPDATE_PROPERTY_TYPE_FAILURE:
    case DELETE_PROPERTY_TYPE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default propertyTypeReducer;
