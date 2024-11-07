import { Box, FormControlLabel, Switch, TextField, Typography } from "@mui/material";

export default function PricingAvailability() {
  return (
    <Box sx={{ p: 2, boxShadow: 1, bgcolor: "white", borderRadius: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Pricing & Availability
      </Typography>
      <TextField fullWidth label="Price per Night" type="number" sx={{ mb: 2 }} />

      <FormControlLabel control={<Switch />} label="Available for Booking" sx={{ mb: 2 }} />
    </Box>
  );
}
