import React, { useState } from "react";
import { Box, Container, Tabs, Tab } from "@mui/material";
import PersonalInfo from "../../components/UserProfile/PersonalInfo";
import PaymentHistory from "../../components/UserProfile/PaymentHistory";
import ProfileSidebar from "../../components/UserProfile/ProfileSidebar";
const categories = [
  { label: "Personal Info", value: "personal-info" },
  { label: "Payment History", value: "payment-history" },
];

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("personal-info");

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <ProfileSidebar categories={categories} activeTab={activeTab} onTabChange={setActiveTab} />

      <Container component="main" sx={{ flex: 1, p: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 3 }}
        >
          {categories.map((category) => (
            <Tab key={category.value} label={category.label} value={category.value} />
          ))}
        </Tabs>

        {activeTab === "personal-info" && <PersonalInfo />}
        {activeTab === "payment-history" && <PaymentHistory />}
      </Container>
    </Box>
  );
}
