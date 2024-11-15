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
      {/* Header */}
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

      {/* Messages */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {messages.length > 0 ? (
          messages.map((msg, index) => {
            const isCurrentUser = msg.sender?._id === user._id;
            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: isCurrentUser ? "row-reverse" : "row",
                  gap: 2,
                  mb: 3,
                }}
              >
                <Avatar
                  alt={isCurrentUser ? "You" : msg.sender?.firstname || "Unknown"}
                  src={isCurrentUser ? user.avatarUrl || "/placeholder.svg" : msg.sender?.avatarUrl || "/placeholder.svg"}
                />
                <Box
                  sx={{
                    maxWidth: "60%",
                    bgcolor: isCurrentUser ? "primary.main" : "grey.300",
                    color: isCurrentUser ? "white" : "black",
                    borderRadius: 2,
                    p: 1.5,
                  }}
                >
                  <Typography fontWeight="bold">{isCurrentUser ? "You" : msg.sender?.username || "Unknown"}</Typography>
                  <Typography variant="body2">{msg.message}</Typography>
                </Box>
              </Box>
            );
          })
        ) : (
          <Typography variant="body2" color="text.secondary">
            No messages yet. Start the conversation!
          </Typography>
        )}
      </Box>

      {/* Message Input */}
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
