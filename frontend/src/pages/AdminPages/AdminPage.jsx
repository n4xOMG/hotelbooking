import { Menu } from "@mui/icons-material";
import GridIcon from "@mui/icons-material/GridView";
import HomeIcon from "@mui/icons-material/Home";
import BedDoubleIcon from "@mui/icons-material/KingBed";
import AlertCircleIcon from "@mui/icons-material/Report";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts"
import { Box, Drawer, Button, IconButton, Tab, Tabs, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoriesTab from "../../components/AdminPage/CategoriesTab";
import PropertyTypesTab from "../../components/AdminPage/PropertyTypesTab";
import AmenitiesTab from "../../components/AdminPage/AmenitiesTab";
import UsersTab from "../../components/AdminPage/UsersTab";
export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("categories");
  const navigate = useNavigate();
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const tabs = [
    { name: "Categories", icon: <GridIcon />, id: "categories" },
    { name: "Property Types", icon: <HomeIcon />, id: "propertyTypes" },
    { name: "Reports", icon: <AlertCircleIcon />, id: "reports" },
    { name: "Amenities", icon: <BedDoubleIcon />, id: "amenities" },
    { name: "Users", icon: <ManageAccountsIcon />, id: "users" },
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "grey.100" }}>
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
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
            <ArrowBackIcon sx={{ cursor: "pointer", mr: 1 }} onClick={() => navigate("/")} />
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
                  color: activeTab === tab.id ? "white" : "text.secondary",
                  backgroundColor: activeTab === tab.id ? "primary.main" : "transparent",
                  opacity: activeTab === tab.id ? 1 : 0.8,
                  mb: 1,
                  "&:hover": {
                    backgroundColor: activeTab === tab.id ? "primary.dark" : "action.hover",
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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h4" color="text.primary">
            Manage {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </Typography>
          <IconButton onClick={toggleSidebar} sx={{ display: { md: "none" } }}>
            <Menu />
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
                color: activeTab === tab.id ? "primary.main" : "text.secondary",
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
        </Box>
      </Box>
    </Box>
  );
}
