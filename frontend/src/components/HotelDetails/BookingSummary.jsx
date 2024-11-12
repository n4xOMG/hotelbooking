import React from "react";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
export default function BookingSummary({ pricePerNight, numberOfNights }) {
  const subtotal = pricePerNight * numberOfNights;
  const serviceFee = 0.1 * subtotal;
  const total = subtotal + serviceFee;

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            RM{pricePerNight.toLocaleString()}/night
          </Typography>
          <Button variant="contained">Reserve</Button>
        </Box>
        <Typography variant="body2" color="text.secondary">
          You won't be charged yet
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>
              RM{pricePerNight.toLocaleString()} x {numberOfNights} nights
            </Typography>
            <Typography>RM{subtotal.toLocaleString()}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>Service fee</Typography>
            <Typography>RM{serviceFee.toLocaleString()}</Typography>
          </Box>
        </Box>

        <Box sx={{ borderTop: 1, pt: 2, display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
          <Typography>Total</Typography>
          <Typography>RM{total.toLocaleString()}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
