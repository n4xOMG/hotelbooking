import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import PetsIcon from "@mui/icons-material/Pets";
import StarIcon from "@mui/icons-material/Star";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import React from "react";
export default function HotelCard({ hotel }) {
  return (
    <Card sx={{ textAlign: "left" }}>
      <CardMedia component="img" height="140" image={hotel.images[0]} alt={hotel.name} />
      <CardContent>
        <Typography variant="h6">{hotel.name}</Typography>
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <StarIcon color="primary" />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {hotel.avgRating ? hotel.avgRating : 5}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <LocationOnIcon color="action" />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {hotel.location}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <PetsIcon color="action" />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {hotel.petFriendly ? "Pet Friendly" : "No Pets"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <PeopleIcon color="action" />
          <Typography variant="body2" sx={{ ml: 1 }}>
            Up to {hotel.maxGuests} guests
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" fullWidth>
          Book Now
        </Button>
      </CardActions>
    </Card>
  );
}
