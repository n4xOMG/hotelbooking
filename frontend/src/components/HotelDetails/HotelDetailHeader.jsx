import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Favorite } from "@mui/icons-material";
export default function HotelDetailHeader({ title }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
      <Typography variant="h4" fontWeight="bold">
        {title}
      </Typography>
      <Button variant="outlined" size="small" sx={{ minWidth: 0 }}>
        <Favorite />
      </Button>
    </Box>
  );
}
