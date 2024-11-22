import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

export default function RoomDetails({ roomDetails, setRoomDetails }) {
  const [errors, setErrors] = useState([]);

  // Initialize errors state based on roomDetails length
  useEffect(() => {
    setErrors(
      roomDetails.map(() => ({
        size: "",
        beds: "",
        baths: "",
      }))
    );
  }, [roomDetails.length]);

  const handleChange = (index, e) => {
    const { name, value, type } = e.target;
    const updatedRooms = [...roomDetails];
    updatedRooms[index] = {
      ...updatedRooms[index],
      [name]: type === "number" ? Number(value) : value,
    };
    setRoomDetails(updatedRooms);

    // Validate the specific field on change
    validateField(index, name, value);
  };

  const handleAddRoom = () => {
    setRoomDetails([...roomDetails, { size: "", beds: 0, baths: 0 }]);
    setErrors([...errors, { size: "", beds: "", baths: "" }]);
  };

  const handleRemoveRoom = (index) => {
    const updatedRooms = roomDetails.filter((_, i) => i !== index);
    setRoomDetails(updatedRooms);
    const updatedErrors = errors.filter((_, i) => i !== index);
    setErrors(updatedErrors);
  };

  // Validation function for individual fields
  const validateField = (index, fieldName, value) => {
    const updatedErrors = [...errors];
    let errorMessage = "";

    switch (fieldName) {
      case "size":
        if (!value || value <= 0) {
          errorMessage = "Size must be a positive number.";
        }
        break;
      case "beds":
        if (value < 0) {
          errorMessage = "Number of beds cannot be negative.";
        }
        break;
      case "baths":
        if (value < 0) {
          errorMessage = "Number of bathrooms cannot be negative.";
        }
        break;
      default:
        break;
    }

    updatedErrors[index][fieldName] = errorMessage;
    setErrors(updatedErrors);
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
            error={Boolean(errors[index]?.size)}
            helperText={errors[index]?.size}
            InputProps={{ inputProps: { min: 0 } }}
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
            error={Boolean(errors[index]?.beds)}
            helperText={errors[index]?.beds}
            InputProps={{ inputProps: { min: 0 } }}
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
            error={Boolean(errors[index]?.baths)}
            helperText={errors[index]?.baths}
            InputProps={{ inputProps: { min: 0 } }}
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
