import { BarChart, Home, People, Settings } from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
export function Sidebar({ selectedView, setSelectedView }) {
  const navItems = [
    { label: "Dashboard", icon: <Home />, view: "dashboard" },
    { label: "Bookings", icon: <People />, view: "bookings" },
  ];

  return (
    <Box sx={{ width: 250, bgcolor: "background.paper", p: 2 }}>
      <Typography variant="h5" fontWeight="bold">
        Hotel Manager
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.label}
            selected={selectedView === item.view}
            onClick={() => setSelectedView(item.view)}
            sx={{
              color: selectedView === item.view ? "primary.main" : "text.primary",
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
