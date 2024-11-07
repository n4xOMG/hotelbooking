import { Box, Grid2 } from "@mui/material";
import React, { useState } from "react";
import HeroSection from "../../components/HomePage/HeroSection";
import SearchBar from "../../components/HomePage/SearchBar";
import HotelCard from "../../components/HomePage/HotelCard";
import Footer from "../../components/HomePage/Footer";
import Header from "../../components/HomePage/Header";
const hotels = [
  {
    id: 1,
    name: "Luxury Resort & Spa",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.8,
    location: "Maldives",
    price: 350,
    amenities: ["wifi", "restaurant", "gym"],
    category: "Resort",
    tags: ["Luxury", "Beach", "Spa"],
    roomSize: 50,
    petFriendly: false,
    maxGuests: 4,
  },
  {
    id: 2,
    name: "City Center Hotel",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.5,
    location: "New York",
    price: 200,
    amenities: ["wifi", "restaurant"],
    category: "City",
    tags: ["Business", "Shopping"],
    roomSize: 30,
    petFriendly: true,
    maxGuests: 2,
  },
  {
    id: 3,
    name: "Mountain View Lodge",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.2,
    location: "Swiss Alps",
    price: 180,
    amenities: ["wifi", "gym"],
    category: "Lodge",
    tags: ["Ski", "Nature"],
    roomSize: 40,
    petFriendly: true,
    maxGuests: 6,
  },
  {
    id: 4,
    name: "Beachfront Paradise",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.6,
    location: "Bali",
    price: 280,
    amenities: ["wifi", "restaurant", "gym"],
    category: "Resort",
    tags: ["Beach", "Romantic"],
    roomSize: 45,
    petFriendly: false,
    maxGuests: 3,
  },
  {
    id: 5,
    name: "Historic Downtown Inn",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.3,
    location: "Prague",
    price: 150,
    amenities: ["wifi"],
    category: "Boutique",
    tags: ["Historic", "Cultural"],
    roomSize: 25,
    petFriendly: false,
    maxGuests: 2,
  },
  {
    id: 6,
    name: "Skyline Apartments",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.7,
    location: "Dubai",
    price: 300,
    amenities: ["wifi", "gym"],
    category: "Apartment",
    tags: ["Luxury", "Business"],
    roomSize: 60,
    petFriendly: true,
    maxGuests: 4,
  },
];

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
            margin: "0 auto", // Center the container
          }}
        >
          {filteredHotels.map((hotel) => (
            <Grid2 item xs={12} sm={6} md={4} key={hotel.id}>
              <HotelCard hotel={hotel} />
            </Grid2>
          ))}
        </Grid2>
      </Box>
      <Footer />
    </Box>
  );
}
