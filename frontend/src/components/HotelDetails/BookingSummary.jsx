import React, { useState } from "react";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkAvailability } from "../../redux/booking/booking.action";

export default function BookingSummary({ pricePerNight, numberOfNights, dateRange, hotelId }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  const subtotal = pricePerNight * numberOfNights;
  const serviceFee = 0.1 * subtotal;
  const total = subtotal + serviceFee;

  const handleReserve = async () => {
    try {
      const { isAvailable } = await dispatch(checkAvailability(hotelId, dateRange[0], dateRange[1]));

      if (!isAvailable) {
        setError("Selected dates are not available");
        return;
      }

      navigate(`/checkout/${hotelId}`, {
        state: {
          bookingDetails: {
            pricePerNight,
            numberOfNights,
            subtotal,
            serviceFee,
            total,
            dateRange,
          },
        },
      });
    } catch (err) {
      setError("Error checking availability");
    }
  };

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            {pricePerNight.toLocaleString()}$/night
          </Typography>
          <Button variant="contained" onClick={handleReserve}>
            Reserve
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary">
          You won't be charged yet
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>
              {pricePerNight.toLocaleString()}$ x {numberOfNights} nights
            </Typography>
            <Typography>{subtotal.toLocaleString()}$</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>Service fee</Typography>
            <Typography>{serviceFee.toLocaleString()}$</Typography>
          </Box>
        </Box>

        <Box sx={{ borderTop: 1, pt: 2, display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
          <Typography>Total</Typography>
          <Typography>{total.toLocaleString()}$</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
