import { Box, CircularProgress, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/HomePage/Footer";
import Header from "../../components/HomePage/Header";
import HeroSection from "../../components/HomePage/HeroSection";
import HotelCard from "../../components/HomePage/HotelCard";
import SearchBar from "../../components/HomePage/SearchBar";
import { fetchAvailableHotels } from "../../redux/hotel/hotel.action"; // Ensure this action fetches using /search

const categoriesList = ["All", "Resort", "City", "Lodge", "Boutique", "Apartment"];
const tagsList = ["Luxury", "Beach", "Spa", "Business", "Shopping", "Ski", "Nature", "Romantic", "Historic", "Cultural"];

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [checkinDate, setCheckinDate] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTags, setSelectedTags] = useState([]);
  const [roomSize, setRoomSize] = useState([0, 100]);
  const [petFriendly, setPetFriendly] = useState("all");
  const [guests, setGuests] = useState(1);
  const { hotels, loading, error } = useSelector((state) => state.hotel);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = () => {
      dispatch(fetchAvailableHotels());
    };

    fetchHotels();
  }, [dispatch, searchTerm, checkinDate, checkoutDate, guests]);

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) || hotel.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || hotel.propertyType === selectedCategory;
    const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => hotel.amenities.includes(tag));
    const matchesRoomSize = hotel.maxGuests >= roomSize[0] && hotel.maxGuests <= roomSize[1];
    const matchesPet =
      petFriendly === "all" || (petFriendly === "yes" && hotel.petFriendly) || (petFriendly === "no" && !hotel.petFriendly);

    return matchesSearch && matchesCategory && matchesTags && matchesRoomSize && matchesPet;
  });

  return (
    <>
      {loading ? (
        <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Header />
          <HeroSection />
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            checkinDate={checkinDate}
            setCheckinDate={setCheckinDate}
            checkoutDate={checkoutDate}
            setCheckoutDate={setCheckoutDate}
            roomSize={roomSize}
            setRoomSize={setRoomSize}
            petFriendly={petFriendly}
            setPetFriendly={setPetFriendly}
            guests={guests}
            setGuests={setGuests}
            categories={categoriesList}
            tags={tagsList}
          />
          <Box sx={{ flex: 1, py: 4, px: { xs: 2, sm: 4 } }}>
            <Grid
              container
              spacing={3}
              sx={{
                justifyContent: "center",
                margin: "0 auto",
              }}
            >
              {filteredHotels?.map((hotel) => (
                <Grid item xs={12} sm={6} md={4} key={hotel._id} onClick={() => navigate(`/hotels/${hotel._id}`)}>
                  <HotelCard hotel={hotel} />
                </Grid>
              ))}
            </Grid>
          </Box>
          <Footer />
        </Box>
      )}
    </>
  );
}
