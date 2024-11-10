import { Box, FormControlLabel, Switch, TextField, Typography } from "@mui/material";

export default function PricingAvailability({ pricingAvailability, setPricingAvailability }) {
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setPricingAvailability((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  return (
    <Box sx={{ p: 2, boxShadow: 1, bgcolor: "white", borderRadius: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Pricing & Availability
      </Typography>
      <TextField
        fullWidth
        label="Price per Night"
        name="pricePerNight"
        type="number"
        value={pricingAvailability.pricePerNight}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <FormControlLabel
        control={<Switch name="available" checked={pricingAvailability.isAvailable} onChange={handleChange} />}
        label="Available for Booking"
        sx={{ mb: 2 }}
      />
    </Box>
  );
}
