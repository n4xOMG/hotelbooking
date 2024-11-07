import { Box } from "@mui/material";
import React, { useState } from "react";
import LeftSidebar from "../../components/MessagePage/LeftSiderbar";
import MainChatArea from "../../components/MessagePage/MainChatArea ";
import Header from "../../components/HomePage/Header";
export default function MessagePage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <>
      <Header />
      <Box sx={{ display: "flex", height: "100vh", bgcolor: "background.default" }}>
        <LeftSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <MainChatArea />
      </Box>
    </>
  );
}
