// HotelDetailHeader.jsx

import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Favorite, Report } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { reportHotel } from "../../redux/hotel/hotel.action";

export default function HotelDetailHeader({ title, hotelId }) {
  const dispatch = useDispatch();
  const { user, loading: userLoading } = useSelector((state) => state.user);

  const isAdmin = user?.role === "admin";

  const handleReport = () => {
    if (isAdmin) {
      dispatch(reportHotel(hotelId));
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        my: 2,
      }}
    >
      <Typography variant="h4" fontWeight="bold">
        {title}
      </Typography>
      
      {/* Grouping Buttons Together */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="outlined" size="small" sx={{ minWidth: 0 }}>
          <Favorite />
        </Button>
        {isAdmin && (
          <Button
            variant="outlined"
            size="small"
            color="error"
            sx={{ minWidth: 0 }}
            onClick={handleReport}
            disabled={userLoading}
          >
            <Report />
          </Button>
        )}
      </Box>
    </Box>
  );
}