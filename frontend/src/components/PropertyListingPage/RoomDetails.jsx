import React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

export default function RoomDetails({ roomDetails, setRoomDetails }) {
  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRooms = [...roomDetails];
    updatedRooms[index] = { ...updatedRooms[index], [name]: value };
    setRoomDetails(updatedRooms);
  };

  const handleAddRoom = () => {
    setRoomDetails([...roomDetails, { roomType: "", size: "", beds: 0, baths: 0, price: 0, isAvailable: true }]);
  };

  return (
    <Box sx={{ p: 2, boxShadow: 1, bgcolor: "white", borderRadius: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Room Details
      </Typography>

      {roomDetails.map((room, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Room Type"
            name="roomType"
            value={room.roomType}
            onChange={(e) => handleChange(index, e)}
            sx={{ mb: 2 }}
          />
          <TextField fullWidth label="Room Size" name="size" value={room.size} onChange={(e) => handleChange(index, e)} sx={{ mb: 2 }} />
          <TextField
            fullWidth
            label="Bed Count"
            name="beds"
            type="number"
            value={room.beds}
            onChange={(e) => handleChange(index, e)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Bathroom Count"
            name="baths"
            type="number"
            value={room.baths}
            onChange={(e) => handleChange(index, e)}
            sx={{ mb: 2 }}
          />
        </Box>
      ))}

      <Button variant="outlined" onClick={handleAddRoom}>
        + Add Another Room
      </Button>
    </Box>
  );
}
