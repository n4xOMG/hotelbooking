import React from "react";
import { Box, Typography, TextField, Button, FormControlLabel, Switch } from "@mui/material";

export default function RoomDetails({ roomDetails, setRoomDetails }) {
  const handleChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedRooms = [...roomDetails];

    if (type === "checkbox") {
      updatedRooms[index] = {
        ...updatedRooms[index],
        [name]: checked,
      };
    } else {
      updatedRooms[index] = {
        ...updatedRooms[index],
        [name]: type === "number" ? Number(value) : value,
      };
    }

    setRoomDetails(updatedRooms);
  };

  const handleAddRoom = () => {
    setRoomDetails([...roomDetails, { size: "", beds: 0, baths: 0, price: 0, isAvailable: true }]);
  };

  return (
    <Box sx={{ p: 2, boxShadow: 1, bgcolor: "white", borderRadius: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Room Details
      </Typography>

      {roomDetails.map((room, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Typography variant="h7" sx={{ fontWeight: "bold", mb: 2 }}>
            Room {index + 1}
          </Typography>
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
          <FormControlLabel
            control={<Switch name="isAvailable" checked={room.isAvailable} onChange={(e) => handleChange(index, e)} />}
            label="Available for Booking"
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
