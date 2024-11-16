import {
  CREATE_REPORT_REQUEST,
  CREATE_REPORT_SUCCESS,
  CREATE_REPORT_FAILURE,
  FETCH_REPORTS_REQUEST,
  FETCH_REPORTS_SUCCESS,
  FETCH_REPORTS_FAILURE,
  UPDATE_REPORT_STATUS_REQUEST,
  UPDATE_REPORT_STATUS_SUCCESS,
  UPDATE_REPORT_STATUS_FAILURE,
} from "./report.actionType";

const initialState = {
  reports: [],
  loading: false,
  error: null,
};

export const reportReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_REPORT_REQUEST:
    case FETCH_REPORTS_REQUEST:
    case UPDATE_REPORT_STATUS_REQUEST:
      return { ...state, loading: true, error: null };

    case CREATE_REPORT_SUCCESS:
      return { ...state, loading: false, reports: [...state.reports, action.payload], error: null };

    case FETCH_REPORTS_SUCCESS:
      return { ...state, loading: false, reports: action.payload, error: null };

    case UPDATE_REPORT_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        reports: state.reports.map((report) =>
          report._id === action.payload._id ? action.payload : report
        ),
        error: null,
      };

    case CREATE_REPORT_FAILURE:
    case FETCH_REPORTS_FAILURE:
    case UPDATE_REPORT_STATUS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};