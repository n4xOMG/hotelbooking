import { CalendarToday, Favorite, PinDrop as PinDropIcon } from "@mui/icons-material";
import { Box, Container, Grid, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api/api";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function SearchResults() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchLocation = queryParams.get("location") || "";
  const checkIn = queryParams.get("checkIn") || "";
  const checkOut = queryParams.get("checkOut") || "";
  const maxGuests = queryParams.get("maxGuests") || 1;

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/hotels/search`, {
          params: {
            location: searchLocation,
            maxGuests,
            checkIn,
            checkOut,
          },
        });
        setHotels(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching hotels:", err);
        setError("Failed to fetch hotels");
        setLoading(false);
      }
    };

    fetchHotels();
  }, [searchLocation, maxGuests, checkIn, checkOut]);

  if (error) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (hotels.length === 0) {
    return (
      <Box sx={{ minHeight: "100vh", p: 4 }}>
        <Typography variant="h6">No hotels found matching your criteria.</Typography>
      </Box>
    );
  }

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
          <Box
            component="header"
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 50,
              width: "100%",
              bgcolor: "background.paper",
              backdropFilter: "blur(5px)",
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Container sx={{ py: 4 }}>
              <Typography variant="h5">Search Results</Typography>
              <Typography variant="body2" color="text.secondary">
                {hotels.length} hotel(s) found for "{searchLocation}" with {maxGuests} guest(s)
              </Typography>
              {checkIn && checkOut && (
                <Typography variant="body2" color="text.secondary">
                  Check-in: {checkIn} | Check-out: {checkOut}
                </Typography>
              )}
            </Container>
          </Box>

          <Container component="main" sx={{ py: 6 }}>
            <Grid container spacing={4}>
              {hotels.map((hotel) => (
                <Grid item key={hotel._id} xs={12} sm={6} md={4} lg={3}>
                  <Card
                    sx={{ height: "100%", display: "flex", flexDirection: "column", cursor: "pointer" }}
                    onClick={() => navigate(`/hotel/${hotel._id}`)}
                  >
                    <Box sx={{ position: "relative" }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={hotel.images && hotel.images.length > 0 ? hotel.images[0] : "/placeholder.svg"}
                        alt={hotel.name}
                      />
                      <IconButton
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          color: "common.white",
                          bgcolor: "rgba(0, 0, 0, 0.5)",
                          "&:hover": { bgcolor: "rgba(0, 0, 0, 0.7)" },
                        }}
                      >
                        <Favorite fontSize="small" />
                      </IconButton>
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="h2">
                        {hotel.name}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <PinDropIcon fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                          {hotel.location}
                        </Typography>
                      </Box>
                      {checkIn && checkOut && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}>
                          <CalendarToday fontSize="small" />
                          <Typography variant="body2" color="text.secondary">
                            Check-in: {checkIn}
                          </Typography>
                          <CalendarToday fontSize="small" />
                          <Typography variant="body2" color="text.secondary">
                            Check-out: {checkOut}
                          </Typography>
                        </Box>
                      )}
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Max Guests: {hotel.maxGuests}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>
                        ${hotel.pricePerNight} / night
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}
    </>
  );
}
