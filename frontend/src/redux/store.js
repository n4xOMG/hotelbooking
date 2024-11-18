import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import { authReducer } from "./auth/auth.reducer";
import { userReducer } from "./user/user.reducer";
import paymentReducer from "./payment/payment.reducer";
import categoryReducer from "./category/category.reducer";
import propertyTypeReducer from "./propertyType/propertyType.reducer";
import amenityReducer from "./amenity/amenity.reducer";
import hotelReducer from "./hotel/hotel.reducer";

import { reportReducer } from "./report/report.reducer";

import bookingReducer from "./booking/booking.reducer";
import ratingReducer from "./rating/rating.reducer";
import chatReducer from "./chat/chat.reducer";


const rootReducers = combineReducers({
  auth: authReducer,
  user: userReducer,
  hotel: hotelReducer,
  booking: bookingReducer,
  payment: paymentReducer,
  chat: chatReducer,
  rating: ratingReducer,
  category: categoryReducer,
  propertyType: propertyTypeReducer,
  amenity: amenityReducer,
  report: reportReducer,
});
export const store = legacy_createStore(rootReducers, applyMiddleware(thunk));
