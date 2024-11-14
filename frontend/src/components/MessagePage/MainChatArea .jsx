import { Add, Call, MoreVert, Send, VideoCall } from "@mui/icons-material";
import { Avatar, Box, Button, IconButton, InputBase, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useChat } from "../../utils/ChatContext";
import { useSelector } from "react-redux";

const MainChatArea = ({ user2Id, chatId }) => {
  const { joinChat, sendMessage, messages } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    if (user?.id && user2Id) {
      joinChat(user.id, user2Id);
    }
  }, [user?.id, user2Id, joinChat]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(chatId, user?.id, newMessage);
      setNewMessage("");
    }
  };

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider", display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar alt="United Family" src="/placeholder.svg" />
          <Box>
            <Typography fontWeight="bold">United Family</Typography>
            <Typography variant="body2" color="green">
              Rashford is typing...
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton>
            <VideoCall />
          </IconButton>
          <IconButton>
            <Call />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {/* Messages */}
        {messages.map((msg, index) => (
          <Box key={index} sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Avatar alt={msg.sender.firstname} src="/placeholder.svg" />
            <Box>
              <Typography fontWeight="bold">{msg.sender.firstname}</Typography>
              <Typography variant="body2">{msg.message}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton>
          <Add />
        </IconButton>
        <InputBase placeholder="Write a message..." sx={{ flex: 1 }} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
        <Button variant="contained" onClick={handleSendMessage}>
          <Send />
        </Button>
      </Box>
    </Box>
  );
};

export default MainChatArea;
