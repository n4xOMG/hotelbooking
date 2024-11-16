
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
import { api, API_BASE_URL } from "../../api/api";

// Create a new report
export const createReport = (reportData) => async (dispatch) => {
  dispatch({ type: CREATE_REPORT_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/reports`, reportData)
    dispatch({ type: CREATE_REPORT_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch({ type: CREATE_REPORT_FAILURE, payload: errorMessage });
  }
};

// Fetch all reports (admin only)
export const fetchReports = () => async (dispatch) => {
  dispatch({ type: FETCH_REPORTS_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/reports`)
    dispatch({ type: FETCH_REPORTS_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch({ type: FETCH_REPORTS_FAILURE, payload: errorMessage });
  }
};

// Update report status (admin only)
export const updateReportStatus = (id, status) => async (dispatch) => {
  dispatch({ type: UPDATE_REPORT_STATUS_REQUEST });
  try {
    const { data } = await api.put( `${API_BASE_URL}/reports/${id}`)
    dispatch({ type: UPDATE_REPORT_STATUS_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch({ type: UPDATE_REPORT_STATUS_FAILURE, payload: errorMessage });
  }
};
