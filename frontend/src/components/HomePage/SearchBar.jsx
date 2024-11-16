import React, { useState, useEffect } from "react";
import { Box, Button, IconButton, Menu, MenuItem, TextField, Typography, Autocomplete } from "@mui/material";
import {
  Search,
  Add as AddIcon,
  Remove as RemoveIcon,
  CalendarMonth as CalendarMonthIcon,
  PinDrop as PinDropIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { fetchLocationSuggestions } from "../../utils/fetchLocationSuggestions";

export default function SearchBar() {
  const [where, setWhere] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [anchorElGuests, setAnchorElGuests] = useState(null);
  const [anchorElCheckIn, setAnchorElCheckIn] = useState(null);
  const [anchorElCheckOut, setAnchorElCheckOut] = useState(null);

  const [locationOptions, setLocationOptions] = useState([]);

  const navigate = useNavigate();

  const handleGuestsOpen = (event) => setAnchorElGuests(event.currentTarget);
  const handleGuestsClose = () => setAnchorElGuests(null);

  const handleCheckInOpen = (event) => setAnchorElCheckIn(event.currentTarget);
  const handleCheckInClose = () => setAnchorElCheckIn(null);

  const handleCheckOutOpen = (event) => setAnchorElCheckOut(event.currentTarget);
  const handleCheckOutClose = () => setAnchorElCheckOut(null);

  const handleSearch = () => {
    if (checkIn && checkOut && new Date(checkIn) >= new Date(checkOut)) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    // Construct query parameters
    const queryParams = new URLSearchParams({
      location: where,
      checkIn,
      checkOut,
      maxGuests: guests,
    }).toString();

    // Navigate to SearchResults page with query parameters
    navigate(`/search-results?${queryParams}`);
  };

  // Fetch location suggestions with debounce
  useEffect(() => {
    const getSuggestions = async () => {
      if (where.length < 3) {
        setLocationOptions([]);
        return;
      }
      const suggestions = await fetchLocationSuggestions(where);
      setLocationOptions(suggestions);
    };

    const delayDebounceFn = setTimeout(() => {
      getSuggestions();
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [where]);

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
      {/* Location Input with Autocomplete */}
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
            <Autocomplete
              freeSolo
              options={locationOptions.map((option) => option.description)}
              inputValue={where}
              onInputChange={(event, newInputValue) => {
                setWhere(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search destinations"
                  variant="standard"
                  sx={{ height: "auto", border: 0, p: 0, fontSize: 14 }}
                />
              )}
            />
          </Box>
        </Box>
      </Button>

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
      <Button variant="contained" color="primary" sx={{ borderRadius: "50px", ml: 1, px: 3 }} onClick={handleSearch}>
        <Search fontSize="small" sx={{ mr: 1 }} />
        Search
      </Button>
    </Box>
  );
}
