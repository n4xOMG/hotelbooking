import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoadingSpinner from "./components/LoadingSpinner";
import AdminPage from "./pages/AdminPages/AdminPage";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import ResetPassword from "./pages/Authentication/ResetPassword";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import HomePage from "./pages/UserPages/HomePage";
import HotelDetails from "./pages/UserPages/HotelDetails";
import MessagePage from "./pages/UserPages/MessagePage";
import PropertyListingPage from "./pages/UserPages/PropertyListingPage";
import UserProfile from "./pages/UserPages/UserProfile";
import { getCurrentUserByJwt } from "./redux/user/user.action";
import { isTokenExpired } from "./utils/isTokenExpired";
import ManageHotelPage from "./pages/UserPages/ManageHotelPage";
import HotelCheckout from "./pages/UserPages/HotelCheckout";
import EmailVerification from "./pages/Authentication/EmailVerification";
import SearchResults from "./pages/UserPages/SearchResults";
function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user, shallowEqual);
  const jwt = localStorage.getItem("jwt");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        if (jwt && !isTokenExpired(jwt) && !user) {
          await dispatch(getCurrentUserByJwt(jwt));
        }
      } catch (e) {
        console.log("Error loading app: ", e);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [jwt, dispatch]);

  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/profile" element={user?.username ? <UserProfile /> : <HomePage />} />
        <Route path="/messages" element={user ? <MessagePage /> : <HomePage />} />
        <Route path="/messages/:chatId/:user2Id" element={user ? <MessagePage /> : <HomePage />} />
        <Route path="/hotels/:id" element={<HotelDetails />} />
        <Route path="/list-properties" element={<PropertyListingPage />} />
        <Route path="/list-properties/:id" element={<PropertyListingPage />} />
        <Route path="/checkout/:id" element={<HotelCheckout />} />
        <Route path="/hotels/manage-hotels" element={user?.username ? <ManageHotelPage /> : <HomePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/admin/*" element={user?.role === "admin" ? <AdminPage /> : <HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
