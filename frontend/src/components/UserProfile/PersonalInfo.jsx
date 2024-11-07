import React from "react";
import { Card, CardHeader, CardContent, TextField, Button, Box } from "@mui/material";

export default function PersonalInfo() {
  return (
    <Card>
      <CardHeader title="Personal Information" subheader="Manage your personal details" />
      <CardContent sx={{ display: "grid", gap: 2 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
          <TextField label="First Name" variant="outlined" fullWidth />
          <TextField label="Last Name" variant="outlined" fullWidth />
        </Box>
        <TextField label="Email" variant="outlined" fullWidth />
        <TextField label="Phone Number" variant="outlined" fullWidth />
        <Button variant="contained" sx={{ mt: 2 }}>
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}
