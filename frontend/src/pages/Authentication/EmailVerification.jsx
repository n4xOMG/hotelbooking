import { Box, Button, Card, CardContent, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyEmailLink } from "../../redux/user/user.action";

const EmailVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    const verifyEmail = async () => {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get("token");
      const email = queryParams.get("email");

      try {
        const response = await dispatch(verifyEmailLink(token, email));
        setMessage(response?.data?.message);
      } catch (error) {
        setMessage("Verification failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [location.search]);

  const handleGoToLogin = () => {
    navigate("/sign-in");
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", bgcolor: "grey.100" }}>
      <Card sx={{ maxWidth: 400, p: 3 }}>
        <CardContent>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Email Verification
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {message}
              </Typography>
              <Button variant="contained" fullWidth onClick={handleGoToLogin}>
                Go to Login
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default EmailVerification;
