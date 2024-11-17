import React from "react";
import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText, Divider, Avatar, useTheme } from "@mui/material";

const ProfileSidebar = ({ categories, activeTab, onTabChange, user }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: { xs: "100%", md: 250 },
        bgcolor: theme.palette.background.paper,
        p: 3,
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[3],
      }}
      component="aside"
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 3, overflow: "hidden" }}>
        <Avatar src={user.avatarUrl} alt={user.name} sx={{ width: 56, height: 56, mr: 2 }} />
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List>
        {categories.map((category) => (
          <ListItemButton
            key={category.value}
            selected={activeTab === category.value}
            onClick={() => onTabChange(category.value)}
            sx={{
              borderRadius: 1,
              mb: 1,
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "primary.contrastText",
                "& .MuiListItemIcon-root": {
                  color: "primary.contrastText",
                },
              },
              "&:hover": {
                bgcolor: "primary.light",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{category.icon}</ListItemIcon>
            <ListItemText primary={category.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default ProfileSidebar;
