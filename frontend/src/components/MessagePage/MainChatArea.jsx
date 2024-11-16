import { Add, Send, Image as ImageIcon } from "@mui/icons-material";
import { Avatar, Box, Button, IconButton, InputBase, Typography, Dialog, DialogContent, DialogTitle } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../../utils/ChatContext";
import UploadToCloudinary from "../../utils/uploadToCloudinary";
import { getOptimizedImageUrl } from "../../utils/optimizeImages";

const MainChatArea = ({ chatId }) => {
  const { sendMessage, messages } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const { user } = useSelector((store) => store.user);

  // State for Image Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogImage, setDialogImage] = useState("");

  const handleSendMessage = async () => {
    if (newMessage.trim() || selectedImages.length > 0) {
      let imageUrls = [];

      if (selectedImages.length > 0) {
        try {
          // Upload each image and collect the URLs
          const uploads = selectedImages.map((image) => UploadToCloudinary(image, "chat_images"));

          imageUrls = await Promise.all(uploads);
        } catch (error) {
          console.error("Image upload failed:", error);
          alert("Failed to upload images. Please try again.");
          return;
        }
      }

      sendMessage(chatId, user._id, newMessage, imageUrls);
      setNewMessage("");
      setSelectedImages([]);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // Optionally, limit the number of images
    if (files.length > 5) {
      alert("You can only upload up to 5 images at a time.");
      return;
    }
    setSelectedImages(files);
  };

  const removeImage = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };

  // Handlers for Image Dialog
  const handleOpenDialog = (imgUrl) => {
    setDialogImage(imgUrl);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogImage("");
  };

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
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
          <IconButton onClick={handleSendMessage}>
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
                  {msg.images && msg.images.length > 0 && (
                    <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {msg.images.map((imgUrl, idx) => (
                        <img
                          key={idx}
                          src={getOptimizedImageUrl(imgUrl)}
                          alt={`attachment-${idx}`}
                          style={{
                            maxWidth: "200px",
                            maxHeight: "200px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleOpenDialog(getOptimizedImageUrl(imgUrl))}
                        />
                      ))}
                    </Box>
                  )}
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

      {/* Image Previews */}
      {selectedImages.length > 0 && (
        <Box
          sx={{
            p: 2,
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            overflowX: "auto",
          }}
        >
          {selectedImages.map((image, index) => (
            <Box key={index} sx={{ position: "relative" }}>
              <img
                src={URL.createObjectURL(image)}
                alt={`preview-${index}`}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bgcolor: "rgba(0,0,0,0.5)",
                  color: "white",
                }}
                onClick={() => removeImage(index)}
              >
                &times;
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      {/* Message Input */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        {/* Image Upload Button */}
        <IconButton component="label">
          <ImageIcon />
          <input type="file" hidden multiple accept="image/*" onChange={handleImageChange} />
        </IconButton>
        <InputBase
          placeholder="Write a message..."
          sx={{
            flex: 1,
            bgcolor: "grey.100",
            borderRadius: 1,
            px: 2,
            py: 1,
          }}
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

      {/* Image Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg">
        <DialogTitle>Image Preview</DialogTitle>
        <DialogContent>
          <img
            src={dialogImage}
            alt="Full View"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px",
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MainChatArea;
