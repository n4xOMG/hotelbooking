import { Alert, Box, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { checkAvailability } from "../../redux/booking/booking.action";
import { formatDate } from "../../utils/formatDate";

export default function DateRangePickerComponent({ dateRange, setDateRange, hotelId }) {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  const handleDateChange = async (startDate, endDate) => {
    if (!startDate || !endDate) return;

    try {
      const { isAvailable } = await dispatch(checkAvailability(hotelId, formatDate(startDate), formatDate(endDate)));

      if (!isAvailable) {
        setError("Hotel is not available for selected dates");
        return false;
      }

      setError(null);
      return true;
    } catch (err) {
      setError("Error checking availability");
      return false;
    }
  };

  const handleStartDateChange = async (event) => {
    const newStartDate = new Date(event.target.value);
    if (await handleDateChange(newStartDate, dateRange[1])) {
      setDateRange([newStartDate, dateRange[1]]);
    }
  };

  const handleEndDateChange = async (event) => {
    const newEndDate = new Date(event.target.value);
    if (await handleDateChange(dateRange[0], newEndDate)) {
      setDateRange([dateRange[0], newEndDate]);
    }
  };

  // Get today's date for min date
  const today = new Date().toISOString().split("T")[0];

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
          inputProps={{ min: today }}
          fullWidth
        />
        <TextField
          label="Check-out"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dateRange[1] ? dateRange[1].toISOString().substring(0, 10) : ""}
          onChange={handleEndDateChange}
          inputProps={{
            min: dateRange[0] ? new Date(dateRange[0].getTime() + 86400000).toISOString().split("T")[0] : today,
          }}
          fullWidth
        />
      </Box>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
