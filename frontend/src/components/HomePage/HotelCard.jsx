import React from "react";
import { Card, CardMedia, CardContent, CardActions, Typography, Button, Box } from "@mui/material";
import { Star, LocationOn, Wifi, Restaurant, FitnessCenter } from "@mui/icons-material";

export default function HotelCard({ hotel }) {
  return (
    <Card>
      <CardMedia component="img" height="140" image={hotel.image} alt={hotel.name} />
      <CardContent>
        <Typography variant="h6">{hotel.name}</Typography>
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <Star color="primary" />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {hotel.rating}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <LocationOn color="action" />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {hotel.location}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          {hotel.amenities.includes("wifi") && <Wifi color="primary" />}
          {hotel.amenities.includes("restaurant") && <Restaurant color="primary" />}
          {hotel.amenities.includes("gym") && <FitnessCenter color="primary" />}
        </Box>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {hotel.petFriendly ? "Pet Friendly" : "No Pets"}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Up to {hotel.maxGuests} guests
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" fullWidth>
          Book Now
        </Button>
      </CardActions>
    </Card>
  );
}
