import React from "react";
import { Avatar, Box, IconButton, Typography, Divider } from "@mui/material";
import { Close, Link } from "@mui/icons-material";

const RightSidebar = () => (
  <Box sx={{ width: 280, borderLeft: 1, borderColor: "divider", display: "flex", flexDirection: "column" }}>
    <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider", display: "flex", justifyContent: "space-between" }}>
      <Typography fontWeight="bold">Detail group</Typography>
      <IconButton>
        <Close />
      </IconButton>
    </Box>
    <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Avatar alt="United Family" src="/placeholder.svg" sx={{ width: 80, height: 80, mb: 1 }} />
        <Typography fontWeight="bold">United Family</Typography>
      </Box>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Descriptions
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Hey lads, tough game yesterday...
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Link group
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", color: "primary.main", gap: 1 }}>
        <Link fontSize="small" />
        <Typography variant="body2">https://ws.140hoam/</Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Media
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1 }}>
        {[...Array(9)].map((_, i) => (
          <Box key={i} sx={{ bgcolor: "grey.200", height: 80, borderRadius: 1 }} />
        ))}
      </Box>
    </Box>
  </Box>
);

export default RightSidebar;
