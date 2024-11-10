import React from "react";
import { Box, Typography } from "@mui/material";
export default function HotelInfo({ hotel }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h5" fontWeight="bold">
        {hotel.propertyType.type}
      </Typography>
      <Typography color="text.secondary">
        300 guests · {hotel.rooms.size()} bedrooms · {hotel.totalBeds} beds · {hotel.totalBaths} baths
      </Typography>
    </Box>
  );
}
