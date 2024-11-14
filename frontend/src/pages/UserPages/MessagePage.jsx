import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/HomePage/Header";
import { useChat } from "../../utils/ChatContext";
import LeftSidebar from "../../components/MessagePage/LeftSiderbar";
import MainChatArea from "../../components/MessagePage/MainChatArea ";

export default function MessagePage() {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState("all");
  const { joinChat } = useChat();

  useEffect(() => {
    if (userId) {
      joinChat(userId);
    }
  }, [userId, joinChat]);

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
