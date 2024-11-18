import { Avatar, Box, Button, Card, CardContent, CardHeader, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { getOptimizedImageUrl } from "../../utils/optimizeImages";
import { useChat } from "../../utils/ChatContext"; // Import useChat

const OwnerCard = ({ owner, currentUser }) => {
  const isOwner = currentUser?._id === owner?._id;
  const navigate = useNavigate();
  const { joinChat } = useChat(); // Destructure joinChat from ChatContext

  const handleMessageClick = async () => {
    try {
      // Join or create chat with the owner
      const chat = await joinChat(currentUser._id, owner._id);
      console.log("Chat joined:", chat);

      // Navigate to the message page with chatId and user2Id
      navigate(`/messages/${chat._id}/${owner._id}`);
    } catch (error) {
      console.error("Failed to join chat:", error);
      // Optionally, display an error message to the user
    }
  };

  return (
    <Card sx={{ mt: 3, borderRadius: 2, boxShadow: 3 }}>
      <CardHeader
        sx={{
          backgroundImage: "linear-gradient(to right, #6a11cb, #2575fc)",
          color: "white",
          borderRadius: "8px 8px 0 0",
          padding: 2,
        }}
        avatar={<Avatar src={getOptimizedImageUrl(owner?.avatarUrl)} sx={{ width: 56, height: 56, border: "2px solid white" }} />}
        title={
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {owner.username}
          </Typography>
        }
        subheader={
          <Typography variant="body2" sx={{ color: "white" }}>
            {owner.email}
          </Typography>
        }
      />
      <CardContent>
        {!isOwner && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button variant="contained" color="primary" sx={{ textTransform: "none" }} onClick={handleMessageClick}>
              Message
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default OwnerCard;
