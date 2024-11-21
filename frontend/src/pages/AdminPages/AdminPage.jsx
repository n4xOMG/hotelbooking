import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  Button,
  IconButton,
  Tab,
  Tabs,
  Typography,
  Link,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import GridIcon from "@mui/icons-material/GridView";
import HomeIcon from "@mui/icons-material/Home";
import BedDoubleIcon from "@mui/icons-material/KingBed";
import AlertCircleIcon from "@mui/icons-material/Report";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import RateReviewIcon from "@mui/icons-material/RateReview";
import MountainIcon from "@mui/icons-material/Terrain";
import CategoriesTab from "../../components/AdminPage/CategoriesTab";
import PropertyTypesTab from "../../components/AdminPage/PropertyTypesTab";
import AmenitiesTab from "../../components/AdminPage/AmenitiesTab";
import UsersTab from "../../components/AdminPage/UsersTab";
import ReportsTab from "../../components/AdminPage/ReportsTab";
import RatingTab from "../../components/AdminPage/RatingTab";

const linkStyles = {
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  color: "inherit",
};

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#ac3b61",
    },
    background: {
      default: "#f4f6f8",
      paper: "#fff",
    },
    text: {
      primary: "#333",
      secondary: "#777",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("categories");
  const navigate = useNavigate();
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const tabs = [
    { name: "Categories", icon: <GridIcon />, id: "categories" },
    { name: "Property Types", icon: <HomeIcon />, id: "propertyTypes" },
    { name: "Amenities", icon: <BedDoubleIcon />, id: "amenities" },
    { name: "Users", icon: <ManageAccountsIcon />, id: "users" },
    { name: "Ratings", icon: <RateReviewIcon />, id: "ratings" },
    { name: "Reports", icon: <AlertCircleIcon />, id: "reports" },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", height: "100vh" }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          open={sidebarOpen}
          onClose={toggleSidebar}
          sx={{
            width: 240,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 240,
              boxSizing: "border-box",
              backgroundColor: theme.palette.primary.main,
              color: "#fff",
            },
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
              <ArrowBackIcon
                sx={{ cursor: "pointer", mr: 1, color: "#fff" }}
                onClick={() => navigate("/")}
              />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Admin Dashboard
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1, p: 2 }}>
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  startIcon={tab.icon}
                  variant={activeTab === tab.id ? "contained" : "text"}
                  sx={{
                    justifyContent: "flex-start",
                    width: "100%",
                    textAlign: "left",
                    color: activeTab === tab.id ? "#fff" : "#ccc",
                    backgroundColor:
                      activeTab === tab.id ? theme.palette.secondary.main : "transparent",
                    opacity: activeTab === tab.id ? 1 : 0.8,
                    mb: 1,
                    "&:hover": {
                      backgroundColor: activeTab === tab.id ? theme.palette.secondary.dark : theme.palette.action.hover,
                    },
                  }}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.name}
                </Button>
              ))}
            </Box>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, overflow: "auto", p: 3 }}>
          {/* Header */}
          <Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 2,
  }}
>
  <Typography
    variant="h4"
    color="text.primary"
    sx={{
      fontWeight: "bold",  // Make the text bold
      color: theme.palette.primary.main,  // Use a contrasting color
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",  // Add a shadow effect for emphasis
    }}
  >
    Manage {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
  </Typography>
  <Link href="/" sx={linkStyles}>
    <MountainIcon sx={{ height: 24, width: 24, mr: 1, color: "blue" }} />
    <Typography sx={{ color: "blue" }}>Acme Hotels</Typography>
  </Link>
  <IconButton onClick={toggleSidebar} sx={{ display: { md: "none" } }}>
    <MenuIcon />
  </IconButton>
</Box>


          <Tabs
            value={activeTab}
            onChange={(event, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.id}
                label={tab.name}
                value={tab.id}
                sx={{
                  color: activeTab === tab.id ? theme.palette.primary.main : "text.secondary",
                  textTransform: "none",
                }}
              />
            ))}
          </Tabs>

          {/* Tab Content */}
          <Box sx={{ py: 2 }}>
            {activeTab === "categories" && <CategoriesTab />}
            {activeTab === "propertyTypes" && <PropertyTypesTab />}
            {activeTab === "amenities" && <AmenitiesTab />}
            {activeTab === "users" && <UsersTab />}
            {activeTab === "ratings" && <RatingTab />}
            {activeTab === "reports" && <ReportsTab />}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
