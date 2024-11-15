import { Add, Send } from "@mui/icons-material";
import { Avatar, Box, Button, IconButton, InputBase, Typography } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../../utils/ChatContext";

const MainChatArea = ({ chatId }) => {
  const { sendMessage, messages } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const { user } = useSelector((store) => store.user);

  const handleSendMessage = () => {
    if (newMessage.trim() && chatId && user?._id) {
      sendMessage(chatId, user._id, newMessage);
      setNewMessage("");
    }
  };

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider", display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar alt="Chat Avatar" src="/placeholder.svg" />
          <Box>
            <Typography fontWeight="bold">Chat Room</Typography>
            <Typography variant="body2" color="green">
              User is typing...
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton>
            <Add />
          </IconButton>
          <IconButton>
            <Send />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {/* Messages */}
        {messages.map((msg, index) => (
          <Box key={index} sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Avatar alt={msg.sender?.firstname || "Unknown"} src={msg.sender?.avatarUrl || "/placeholder.svg"} />
            <Box>
              <Typography fontWeight="bold">{msg.sender?.username || "Unknown"}</Typography>
              <Typography variant="body2">{msg.message}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton>
          <Add />
        </IconButton>
        <InputBase
          placeholder="Write a message..."
          sx={{ flex: 1 }}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
              e.preventDefault();
            }
          }}
        />
        <Button variant="contained" onClick={handleSendMessage}>
          <Send />
        </Button>
      </Box>
    </Box>
  );
};

export default MainChatArea;
