import { Box, Typography, TextField, Button } from "@mui/material";

export default function RoomDetails() {
  return (
    <Box sx={{ p: 2, boxShadow: 1, bgcolor: "white", borderRadius: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Room Details
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField fullWidth label="Room Type" />
        <TextField fullWidth label="Room Size" />
        <TextField fullWidth label="Bed Count" type="number" />
        <TextField fullWidth label="Room Price" type="number" />
      </Box>
      <Button variant="outlined" sx={{ mt: 2 }}>
        + Add Another Room
      </Button>
    </Box>
  );
}
