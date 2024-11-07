import React from "react";
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
export default function ProfileSidebar({ categories, activeTab, onTabChange }) {
  return (
    <Box component="aside" sx={{ width: { xs: "100%", md: 250 }, bgcolor: "grey.200", p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        User Profile
      </Typography>
      <List>
        {categories.map((category) => (
          <ListItem key={category.value} button selected={activeTab === category.value} onClick={() => onTabChange(category.value)}>
            <ListItemIcon>{category.icon}</ListItemIcon>
            <ListItemText primary={category.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
