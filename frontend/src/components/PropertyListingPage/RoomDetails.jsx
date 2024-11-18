import React from "react";
import { Box, Button, TextField, Typography, IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

export default function RoomDetails({ roomDetails, setRoomDetails }) {
  const handleChange = (index, e) => {
    const { name, value, type } = e.target;
    const updatedRooms = [...roomDetails];

    updatedRooms[index] = {
      ...updatedRooms[index],
      [name]: type === "number" ? Number(value) : value,
    };

    setRoomDetails(updatedRooms);
  };

  const handleAddRoom = () => {
    setRoomDetails([...roomDetails, { size: "", beds: 0, baths: 0 }]);
  };

  const handleRemoveRoom = (index) => {
    const updatedRooms = roomDetails.filter((_, i) => i !== index);
    setRoomDetails(updatedRooms);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Room Details
      </Typography>
      {roomDetails.map((room, index) => (
        <Box
          key={index}
          sx={{
            border: "1px solid #ccc",
            borderRadius: 2,
            p: 2,
            mb: 2,
            position: "relative",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Room {index + 1}
          </Typography>
          <TextField
            fullWidth
            required
            label="Size (sq ft)"
            name="size"
            type="number"
            value={room.size}
            onChange={(e) => handleChange(index, e)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            required
            label="Number of Beds"
            name="beds"
            type="number"
            value={room.beds}
            onChange={(e) => handleChange(index, e)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            required
            label="Number of Bathrooms"
            name="baths"
            type="number"
            value={room.baths}
            onChange={(e) => handleChange(index, e)}
            sx={{ mb: 2 }}
          />
          {roomDetails.length > 1 && (
            <IconButton onClick={() => handleRemoveRoom(index)} sx={{ position: "absolute", top: 8, right: 8 }}>
              <RemoveCircleOutlineIcon color="error" />
            </IconButton>
          )}
        </Box>
      ))}
      <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} onClick={handleAddRoom}>
        Add Another Room
      </Button>
    </Box>
  );
}
