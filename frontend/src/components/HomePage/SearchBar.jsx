import { Search } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PinDropIcon from "@mui/icons-material/PinDrop";
import RemoveIcon from "@mui/icons-material/Remove";
import { Box, Button, IconButton, Menu, MenuItem, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
export default function SearchBar() {
  const [where, setWhere] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [anchorElGuests, setAnchorElGuests] = useState(null);
  const [anchorElWhere, setAnchorElWhere] = useState(null);
  const [anchorElCheckIn, setAnchorElCheckIn] = useState(null);
  const [anchorElCheckOut, setAnchorElCheckOut] = useState(null);

  const handleGuestsOpen = (event) => setAnchorElGuests(event.currentTarget);
  const handleGuestsClose = () => setAnchorElGuests(null);

  const handleWhereOpen = (event) => setAnchorElWhere(event.currentTarget);
  const handleWhereClose = () => setAnchorElWhere(null);

  const handleCheckInOpen = (event) => setAnchorElCheckIn(event.currentTarget);
  const handleCheckInClose = () => setAnchorElCheckIn(null);

  const handleCheckOutOpen = (event) => setAnchorElCheckOut(event.currentTarget);
  const handleCheckOutClose = () => setAnchorElCheckOut(null);

  return (
    <Box
      sx={{
        display: "flex",
        maxWidth: "100%",
        border: 1,
        borderRadius: "50px",
        alignItems: "center",
        boxShadow: 3,
        p: 2,
        bgcolor: "background.paper",
        overflow: "hidden",
      }}
    >
      {/* Location Input */}
      <Button
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "flex-start",
          borderRight: 1,
          borderColor: "divider",
          textTransform: "none",
          p: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", width: "100%", px: 2 }}>
          <PinDropIcon sx={{ mr: 1 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption">Where</Typography>
            <TextField
              value={where}
              onChange={(e) => setWhere(e.target.value)}
              placeholder="Search destinations"
              variant="standard"
              sx={{ height: "auto", border: 0, p: 0, fontSize: 14 }}
            />
          </Box>
          <IconButton size="small" onClick={handleWhereOpen} sx={{ ml: 1 }}>
            <ExpandMoreIcon />
          </IconButton>
        </Box>
      </Button>

      <Menu anchorEl={anchorElWhere} open={Boolean(anchorElWhere)} onClose={handleWhereClose} sx={{ mt: 1, width: 260 }}>
        {["London", "Paris", "New York", "Tokyo"].map((city) => (
          <MenuItem
            key={city}
            onClick={() => {
              setWhere(city);
              handleWhereClose();
            }}
          >
            <PinDropIcon fontSize="small" sx={{ mr: 1 }} />
            {city}
          </MenuItem>
        ))}
      </Menu>

      {/* Check-in */}
      <Button
        onClick={handleCheckInOpen}
        variant="text"
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "flex-start",
          borderRight: 1,
          borderColor: "divider",
          textTransform: "none",
        }}
      >
        <CalendarMonthIcon sx={{ mr: 1 }} />
        <Box>
          <Typography variant="caption">Check-in</Typography>
          <Typography variant="body2">{checkIn || "Add date"}</Typography>
        </Box>
      </Button>
      <Menu anchorEl={anchorElCheckIn} open={Boolean(anchorElCheckIn)} onClose={handleCheckInClose} sx={{ mt: 1, width: 250 }}>
        <MenuItem>
          <TextField type="date" value={checkIn || ""} onChange={(e) => setCheckIn(e.target.value)} variant="outlined" fullWidth />
        </MenuItem>
      </Menu>

      {/* Check-out */}
      <Button
        onClick={handleCheckOutOpen}
        variant="text"
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "flex-start",
          borderRight: 1,
          borderColor: "divider",
          textTransform: "none",
        }}
      >
        <CalendarMonthIcon sx={{ mr: 1 }} />
        <Box>
          <Typography variant="caption">Check-out</Typography>
          <Typography variant="body2">{checkOut || "Add date"}</Typography>
        </Box>
      </Button>
      <Menu anchorEl={anchorElCheckOut} open={Boolean(anchorElCheckOut)} onClose={handleCheckOutClose} sx={{ mt: 1, width: 250 }}>
        <MenuItem>
          <TextField type="date" value={checkOut || ""} onChange={(e) => setCheckOut(e.target.value)} variant="outlined" fullWidth />
        </MenuItem>
      </Menu>

      {/* Guests */}
      <Button
        variant="text"
        onClick={handleGuestsOpen}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Typography variant="caption">Who</Typography>
        <Typography variant="body2">
          {guests} {guests === 1 ? "guest" : "guests"}
        </Typography>
      </Button>
      <Menu anchorEl={anchorElGuests} open={Boolean(anchorElGuests)} onClose={handleGuestsClose} sx={{ mt: 1, width: 260 }}>
        <MenuItem>
          <Typography variant="caption">Guests</Typography>
          <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
            <IconButton onClick={() => setGuests(Math.max(1, guests - 1))} disabled={guests <= 1}>
              <RemoveIcon fontSize="small" />
            </IconButton>
            <Typography sx={{ mx: 1 }}>{guests}</Typography>
            <IconButton onClick={() => setGuests(guests + 1)}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
        </MenuItem>
      </Menu>

      {/* Search Button */}
      <Button variant="contained" color="primary" sx={{ borderRadius: "50px", ml: 1, px: 3 }}>
        <Search fontSize="small" sx={{ mr: 1 }} />
        Search
      </Button>
    </Box>
  );
}
