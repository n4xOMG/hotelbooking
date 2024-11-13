import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckoutForm } from "../../components/CheckoutPage/CheckoutForm";
import { fetchHotelById } from "../../redux/hotel/hotel.action";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
export default function HotelCheckout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { hotel } = useSelector((state) => state.hotel);
  const bookingDetails = location.state?.bookingDetails;
  const [formData, setFormData] = useState({
    firstName: user?.firstname || "",
    lastName: user?.lastname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
  });
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchHotelById(id));
  }, [dispatch, id]);

  const subtotal = bookingDetails?.subtotal;
  const serviceFee = bookingDetails?.serviceFee;
  const totalPrice = bookingDetails?.total;
  const dateRange = bookingDetails?.dateRange;
  const numberOfNights = bookingDetails?.numberOfNights;
  const handleSuccess = () => {
    setSuccessDialogOpen(true);
  };

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
    navigate("/");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.100", p: 4 }}>
      <Card sx={{ maxWidth: 800, mx: "auto" }}>
        <CardHeader title="Complete Your Reservation" subheader={hotel?.name} />
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Booking Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                Check-in:
              </Grid>
              <Grid item xs={6}>
                {dateRange[0]?.toLocaleDateString()}
              </Grid>
              <Grid item xs={6}>
                Check-out:
              </Grid>
              <Grid item xs={6}>
                {dateRange[1]?.toLocaleDateString()}
              </Grid>
              <Grid item xs={6}>
                Price per night:
              </Grid>
              <Grid item xs={6}>
                {hotel?.pricePerNight}$
              </Grid>
              <Grid item xs={6}>
                Number of nights:
              </Grid>
              <Grid item xs={6}>
                {numberOfNights}
              </Grid>
              <Grid item xs={6}>
                Service fee:
              </Grid>
              <Grid item xs={6}>
                {serviceFee?.toFixed(2)}$
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">Total:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">{totalPrice?.toFixed(2)}$</Typography>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Guest Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth value={user?.firstname} disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth value={user?.lastname} disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="email" value={user?.email} disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Payment Information
          </Typography>
          <Elements stripe={stripePromise}>
            <CheckoutForm
              bookingDetails={{
                hotelId: id,
                user: user?._id,
                checkInDate: dateRange[0],
                checkOutDate: dateRange[1],
                totalPrice,
              }}
              onSuccess={handleSuccess}
            />
          </Elements>
        </CardContent>
      </Card>

      <Dialog open={successDialogOpen} onClose={handleSuccessDialogClose}>
        <DialogTitle>Booking Confirmed!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your booking has been confirmed and payment processed successfully. You will receive a confirmation email shortly.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
