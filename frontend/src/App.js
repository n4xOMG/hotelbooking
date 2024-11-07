import logo from "./logo.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import UserProfile from "./pages/UserPages/UserProfile";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import ResetPassword from "./pages/Authentication/ResetPassword";
import HomePage from "./pages/UserPages/HomePage";
import MessagePage from "./pages/UserPages/MessagePage";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getCurrentUserByJwt } from "./redux/user/user.action";
import { isTokenExpired } from "./utils/isTokenExpired";
import LoadingSpinner from "./components/LoadingSpinner";
import PropertyListingPage from "./pages/UserPages/PropertyListingPage";
import AdminPage from "./pages/AdminPages/AdminPage";
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
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/message" element={<MessagePage />} />
        <Route path="/list-properties" element={<PropertyListingPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/admin/*" element={user?.role === "admin" ? <AdminPage /> : <HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
