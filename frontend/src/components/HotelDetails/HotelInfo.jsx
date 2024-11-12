import React from "react";
import { Box, Typography } from "@mui/material";
export default function HotelInfo({ hotel }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h5" fontWeight="bold">
        {hotel.propertyType.type}
      </Typography>
      <Typography color="text.secondary">
        {hotel.maxGuests} guests · {hotel.rooms.length} bedrooms · {hotel.totalBeds} beds · {hotel.totalBaths} baths
      </Typography>
    </Box>
  );
}
