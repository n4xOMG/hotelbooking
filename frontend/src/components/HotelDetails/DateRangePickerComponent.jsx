import React from "react";
import { Box, TextField, Typography } from "@mui/material";

export default function DateRangePickerComponent({ dateRange, setDateRange }) {
  const handleStartDateChange = (event) => {
    setDateRange([new Date(event.target.value), dateRange[1]]);
  };

  const handleEndDateChange = (event) => {
    setDateRange([dateRange[0], new Date(event.target.value)]);
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
        Select Dates
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <TextField
          label="Check-in"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dateRange[0] ? dateRange[0].toISOString().substring(0, 10) : ""}
          onChange={handleStartDateChange}
          fullWidth
        />
        <TextField
          label="Check-out"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dateRange[1] ? dateRange[1].toISOString().substring(0, 10) : ""}
          onChange={handleEndDateChange}
          fullWidth
        />
      </Box>
    </Box>
  );
}
