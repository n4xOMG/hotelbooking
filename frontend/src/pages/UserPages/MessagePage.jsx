import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Header from "../../components/HomePage/Header";
import LeftSidebar from "../../components/MessagePage/LeftSiderbar";
import MainChatArea from "../../components/MessagePage/MainChatArea";
import { useChat } from "../../utils/ChatContext";

export default function MessagePage() {
  const { chatId, user2Id } = useParams();
  const [activeTab, setActiveTab] = useState("all");
  const { joinChat, isConnected } = useChat();
  const { user } = useSelector((store) => store.user);
  const [currentChatId, setCurrentChatId] = useState(null);

  useEffect(() => {
    if (isConnected && user?._id && chatId && user2Id) {
      console.log("Joining chat with:", { chatId, user2Id });
      joinChat(user._id, user2Id)
        .then((chat) => {
          console.log("Chat joined:", chat);
          setCurrentChatId(chat._id);
        })
        .catch((error) => {
          console.error("Failed to join chat:", error);
        });
    }
  }, [isConnected, user?._id, chatId, user2Id, joinChat]);

  return (
    <Box sx={{ maxHeight: "100vh" }}>
      <Header />
      <Box sx={{ display: "flex", height: "100vh", bgcolor: "background.default" }}>
        <LeftSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <MainChatArea chatId={currentChatId} />
      </Box>
    </Box>
  );
}
