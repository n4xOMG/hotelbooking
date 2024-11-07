import React from "react";
import { Box, Typography, Button } from "@mui/material";

export default function HeroSection() {
  return (
    <Box sx={{ bgcolor: "primary.main", color: "white", py: 8, textAlign: "center" }}>
      <Typography variant="h3" component="h1">
        Discover Your Perfect Stay
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: 600, mx: "auto", mt: 2 }}>
        Explore our handpicked selection of luxurious hotels and resorts worldwide.
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
        <Button variant="contained" color="secondary">
          Book Now
        </Button>
        <Button variant="outlined" color="inherit">
          Learn More
        </Button>
      </Box>
    </Box>
  );
}
