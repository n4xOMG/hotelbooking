import { Box, FormControlLabel, Switch, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function PricingAvailability({ pricingAvailability, setPricingAvailability }) {
  const [errors, setErrors] = useState({
    pricePerNight: "",
  });

  // Validation function for individual fields
  const validateField = (fieldName, value) => {
    let errorMessage = "";

    switch (fieldName) {
      case "pricePerNight":
        if (value === "" || value === null) {
          errorMessage = "Price is required.";
        } else if (isNaN(value)) {
          errorMessage = "Price must be a number.";
        } else if (Number(value) <= 0) {
          errorMessage = "Price must be a positive number.";
        } else if (Number(value) > 10000) {
          errorMessage = "Price seems too high.";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: errorMessage,
    }));
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setPricingAvailability((prev) => ({ ...prev, [name]: newValue }));

    // Validate the specific field on change
    validateField(name, newValue);
  };

  return (
    <Box sx={{ p: 2, boxShadow: 1, bgcolor: "white", borderRadius: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Pricing & Availability
      </Typography>
      <TextField
        fullWidth
        required
        label="Price per Night"
        name="pricePerNight"
        type="number"
        value={pricingAvailability.pricePerNight}
        error={Boolean(errors.pricePerNight)}
        helperText={errors.pricePerNight}
        onChange={handleChange}
        sx={{ mb: 2 }}
        InputProps={{
          inputProps: {
            min: 0,
            step: "0.01",
          },
        }}
      />

      <FormControlLabel
        control={<Switch name="isAvailable" checked={pricingAvailability.isAvailable} onChange={handleChange} color="primary" />}
        label="Available for Booking"
        sx={{ mb: 2 }}
      />
    </Box>
  );
}
