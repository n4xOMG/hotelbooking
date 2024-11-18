import { api, API_BASE_URL } from "../../api/api";
import {
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_FAILURE,
  FETCH_CATEGORY_REQUEST,
  FETCH_CATEGORY_SUCCESS,
  FETCH_CATEGORY_FAILURE,
  CREATE_CATEGORY_REQUEST,
  CREATE_CATEGORY_SUCCESS,
  CREATE_CATEGORY_FAILURE,
  UPDATE_CATEGORY_REQUEST,
  UPDATE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_FAILURE,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAILURE,
} from "./category.actionType";

// Fetch all categories
export const fetchCategories = () => async (dispatch) => {
  dispatch({ type: FETCH_CATEGORIES_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/categories`);
    dispatch({ type: FETCH_CATEGORIES_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch({ type: FETCH_CATEGORIES_FAILURE, payload: errorMessage });
  }
};

// Fetch a single category by ID
export const fetchCategory = (id) => async (dispatch) => {
  dispatch({ type: FETCH_CATEGORY_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/categories/${id}`);
    dispatch({ type: FETCH_CATEGORY_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch({ type: FETCH_CATEGORY_FAILURE, payload: errorMessage });
  }
};

// Create a new category (admin only)
export const createCategory = (categoryData) => async (dispatch) => {
  dispatch({ type: CREATE_CATEGORY_REQUEST });
  try {
    const { data } = await api.post("/categories", categoryData);
    dispatch({ type: CREATE_CATEGORY_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch({ type: CREATE_CATEGORY_FAILURE, payload: errorMessage });
  }
};

// Update a category (admin only)
export const updateCategory = (id, categoryData) => async (dispatch) => {
  dispatch({ type: UPDATE_CATEGORY_REQUEST });
  try {
    const { data } = await api.put(`/categories/${id}`, categoryData);
    dispatch({ type: UPDATE_CATEGORY_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch({ type: UPDATE_CATEGORY_FAILURE, payload: errorMessage });
  }
};

// Delete a category (admin only)
export const deleteCategory = (id) => async (dispatch) => {
  dispatch({ type: DELETE_CATEGORY_REQUEST });
  try {
    await api.delete(`/categories/${id}`);
    dispatch({ type: DELETE_CATEGORY_SUCCESS, payload: id });
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch({ type: DELETE_CATEGORY_FAILURE, payload: errorMessage });
  }
};
