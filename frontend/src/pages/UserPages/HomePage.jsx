import { Box, Grid2 } from "@mui/material";
import React, { useEffect, useState } from "react";
import HeroSection from "../../components/HomePage/HeroSection";
import SearchBar from "../../components/HomePage/SearchBar";
import HotelCard from "../../components/HomePage/HotelCard";
import Footer from "../../components/HomePage/Footer";
import Header from "../../components/HomePage/Header";
import { fetchHotels } from "../../redux/hotel/hotel.action";
import { Navigate, useNavigate } from "react-router-dom";
import { fetchCategories } from "../../redux/category/category.action";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner";

const categories = ["All", "Resort", "City", "Lodge", "Boutique", "Apartment"];
const tags = ["Luxury", "Beach", "Spa", "Business", "Shopping", "Ski", "Nature", "Romantic", "Historic", "Cultural"];
export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [checkinDate, setCheckinDate] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTags, setSelectedTags] = useState([]);
  const [roomSize, setRoomSize] = useState([0, 100]);
  const [petFriendly, setPetFriendly] = useState("all");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const { hotels } = useSelector((state) => state.hotel);
  const { categories } = useSelector((state) => state.category);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);
    try {
      dispatch(fetchCategories());
      dispatch(fetchHotels());
    } catch (e) {
      console.log("Error loading hotels: ", e);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) || hotel.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || hotel.category === selectedCategory;
    const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => hotel.tags.includes(tag));
    const matchesRoomSize = hotel.roomSize >= roomSize[0] && hotel.roomSize <= roomSize[1];
    const matchesPetFriendly =
      petFriendly === "all" || (petFriendly === "yes" && hotel.petFriendly) || (petFriendly === "no" && !hotel.petFriendly);
    const matchesGuests = hotel.maxGuests >= guests;
    return matchesSearch && matchesCategory && matchesTags && matchesRoomSize && matchesPetFriendly && matchesGuests;
  });

  return (
    <>
      {" "}
      {loading ? (
        <LoadingSpinner />
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
            categories={categories}
            tags={tags}
          />
          <Box sx={{ flex: 1, py: 4, px: { xs: 2, sm: 4 } }}>
            <Grid2
              container
              spacing={3}
              sx={{
                justifyContent: "center",
                margin: "0 auto",
              }}
            >
              {hotels?.map((hotel) => (
                <Grid2 item xs={12} sm={6} md={4} key={hotel.id} onClick={() => navigate(`/hotels/${hotel._id}`)}>
                  <HotelCard hotel={hotel} />
                </Grid2>
              ))}
            </Grid2>
          </Box>
          <Footer />
        </Box>
      )}
    </>
  );
}
