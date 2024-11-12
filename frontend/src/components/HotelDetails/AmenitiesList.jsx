import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import * as Icons from "@mui/icons-material";
export default function AmenitiesList({ amenities }) {
  return (
    <Box sx={{ borderTop: 1, borderBottom: 1, py: 2, mb: 2 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
        What this place offers
      </Typography>
      <Grid container spacing={2}>
        {amenities.map((item, index) => (
          <Grid item xs={6} key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {React.createElement(Icons[item.icon])} {item.description}
            <Typography>{item.text}</Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
