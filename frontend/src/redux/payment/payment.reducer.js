import {
  CREATE_PAYMENT_INTENT_REQUEST,
  CREATE_PAYMENT_INTENT_SUCCESS,
  CREATE_PAYMENT_INTENT_FAILURE,
  CONFIRM_PAYMENT_REQUEST,
  CONFIRM_PAYMENT_SUCCESS,
  CONFIRM_PAYMENT_FAILURE,
  GET_PAYMENT_HISTORY_REQUEST,
  GET_PAYMENT_HISTORY_SUCCESS,
  GET_PAYMENT_HISTORY_FAILURE,
} from "./payment.actionType";

const initialState = {
  loading: false,
  paymentIntent: null,
  paymentConfirmation: null,
  paymentHistory: [],
  error: null,
};

const paymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_PAYMENT_INTENT_REQUEST:
    case CONFIRM_PAYMENT_REQUEST:
    case GET_PAYMENT_HISTORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CREATE_PAYMENT_INTENT_SUCCESS:
      return {
        ...state,
        loading: false,
        paymentIntent: action.payload,
      };
    case CONFIRM_PAYMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        paymentConfirmation: action.payload,
      };
    case GET_PAYMENT_HISTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        paymentHistory: action.payload,
      };
    case CREATE_PAYMENT_INTENT_FAILURE:
    case CONFIRM_PAYMENT_FAILURE:
    case GET_PAYMENT_HISTORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default paymentReducer;
