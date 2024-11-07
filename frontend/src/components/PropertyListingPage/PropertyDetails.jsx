import { Box, Typography, TextField, MenuItem, Checkbox, FormControlLabel } from "@mui/material";

export default function PropertyDetails() {
  return (
    <Box sx={{ p: 2, boxShadow: 1, bgcolor: "white", borderRadius: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Property Details
      </Typography>

      <TextField fullWidth label="Property Name" sx={{ mb: 2 }} />
      <TextField fullWidth label="Location" sx={{ mb: 2 }} />
      <TextField fullWidth label="Description" multiline rows={4} sx={{ mb: 2 }} />

      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField select label="Property Type" fullWidth>
          <MenuItem value="apartment">Apartment</MenuItem>
          <MenuItem value="house">House</MenuItem>
          <MenuItem value="guesthouse">Guesthouse</MenuItem>
        </TextField>
        <TextField select label="Category" fullWidth>
          <MenuItem value="vacation">Vacation</MenuItem>
          <MenuItem value="business">Business</MenuItem>
        </TextField>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "medium", mb: 1 }}>
          Amenities
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <FormControlLabel control={<Checkbox />} label="Wi-Fi" />
          <FormControlLabel control={<Checkbox />} label="Air Conditioning" />
          <FormControlLabel control={<Checkbox />} label="Kitchen" />
        </Box>
      </Box>
    </Box>
  );
}
