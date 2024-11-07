import React from "react";
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box sx={{ py: 2, textAlign: "center", borderTop: "1px solid #e0e0e0" }}>
      <Typography variant="caption" color="textSecondary">
        © 2024 Acme Hotels. All rights reserved.
      </Typography>
    </Box>
  );
}
