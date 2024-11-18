// HotelList.js
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
export function HotelList({ hotels, onEditHotel, onDeleteHotel }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [sortOption, setSortOption] = useState("name");
  const [filteredHotels, setFilteredHotels] = useState(hotels);

  useEffect(() => {
    setFilteredHotels(
      hotels
        .filter((hotel) => {
          if (availabilityFilter === "all") return true;
          return availabilityFilter === "available" ? hotel.isAvailable : !hotel.isAvailable;
        })
        .filter((hotel) => {
          return hotel.name.toLowerCase().includes(searchQuery.toLowerCase());
        })
        .sort((a, b) => {
          if (sortOption === "name") {
            return a.name.localeCompare(b.name);
          } else if (sortOption === "location") {
            return a.location.localeCompare(b.location);
          }
          return 0;
        })
    );
  }, [hotels, searchQuery, availabilityFilter, sortOption]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAvailabilityFilterChange = (event) => {
    setAvailabilityFilter(event.target.value);
  };

  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
  };

  return (
    <Box component={Paper} sx={{ mt: 4, p: 2 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Your Hotels
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box display="flex" gap={2}>
          <TextField label="Search hotels" variant="outlined" value={searchQuery} onChange={handleSearchChange} />
          <Select value={availabilityFilter} onChange={handleAvailabilityFilterChange}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="booked">Booked</MenuItem>
          </Select>
        </Box>
        <Select value={sortOption} onChange={handleSortOptionChange}>
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="location">Location</MenuItem>
        </Select>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Max Guests</TableCell>
              <TableCell>Pet Allowed</TableCell>
              <TableCell>Rooms</TableCell>
              <TableCell>Price per Night</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredHotels.map((hotel) => (
              <TableRow key={hotel._id}>
                <TableCell>{hotel.name}</TableCell>
                <TableCell>{hotel.description}</TableCell>
                <TableCell>{hotel.location}</TableCell>
                <TableCell>{hotel.maxGuests}</TableCell>
                <TableCell>
                  <Typography
                    component="span"
                    sx={{
                      bgcolor: hotel.petFriendly ? "success.light" : "error.light",
                      color: hotel.petFriendly ? "success.dark" : "error.dark",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: "0.75rem",
                    }}
                  >
                    {hotel.petFriendly ? "Yes" : "No"}
                  </Typography>
                </TableCell>
                <TableCell>{hotel.rooms.length}</TableCell>
                <TableCell>{hotel.pricePerNight}</TableCell>
                <TableCell>
                  <Typography
                    component="span"
                    sx={{
                      bgcolor: hotel.isAvailable ? "success.light" : "error.light",
                      color: hotel.isAvailable ? "success.dark" : "error.dark",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: "0.75rem",
                    }}
                  >
                    {hotel.isAvailable ? "Yes" : "No"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button variant="contained" size="small" onClick={() => onEditHotel(hotel._id)} sx={{ mr: 1 }}>
                    Edit
                  </Button>
                  <Button variant="outlined" size="small" onClick={() => onDeleteHotel(hotel._id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
