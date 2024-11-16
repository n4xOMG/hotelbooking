import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import { authReducer } from "./auth/auth.reducer";
import { userReducer } from "./user/user.reducer";
import paymentReducer from "./payment/payment.reducer";
import categoryReducer from "./category/category.reducer";
import propertyTypeReducer from "./propertyType/propertyType.reducer";
import amenityReducer from "./amenity/amenity.reducer";
import hotelReducer from "./hotel/hotel.reducer";
import reportReducer from "./report/report.reducer";

const rootReducers = combineReducers({
  auth: authReducer,
  user: userReducer,
  hotel: hotelReducer,
  payment: paymentReducer,
  category: categoryReducer,
  propertyType: propertyTypeReducer,
  amenity: amenityReducer,
  report: reportReducer,
});
export const store = legacy_createStore(rootReducers, applyMiddleware(thunk));
