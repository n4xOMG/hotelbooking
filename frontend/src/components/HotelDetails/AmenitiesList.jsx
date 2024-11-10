import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import BedIcon from "@mui/icons-material/Bed";
import { Wifi, Coffee } from "@mui/icons-material";
export default function AmenitiesList() {
  const amenities = [
    { icon: <RestaurantIcon />, text: "Kitchen" },
    { icon: <Wifi />, text: "Wifi" },
    { icon: <BedIcon />, text: "Pool" },
    { icon: <Coffee />, text: "Washer" },
  ];

  return (
    <Box sx={{ borderTop: 1, borderBottom: 1, py: 2, mb: 2 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
        What this place offers
      </Typography>
      <Grid container spacing={2}>
        {amenities.map((item, index) => (
          <Grid item xs={6} key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {item.icon}
            <Typography>{item.text}</Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
