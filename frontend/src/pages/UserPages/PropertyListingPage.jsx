import { Box, Button, Container } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../../components/HomePage/Header";
import LoadingSpinner from "../../components/LoadingSpinner";
import PricingAvailability from "../../components/PropertyListingPage/PricingAvailability";
import PropertyDetails from "../../components/PropertyListingPage/PropertyDetails";
import PropertyImages from "../../components/PropertyListingPage/PropertyImages";
import RoomDetails from "../../components/PropertyListingPage/RoomDetails";
import { createHotel } from "../../redux/hotel/hotel.action";
import { UploadToCloudinary } from "../../utils/uploadToCloudinary";

export default function PropertyListingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.user);
  const [propertyDetails, setPropertyDetails] = useState({
    name: "",
    location: "",
    description: "",
    propertyType: "",
    category: "",
    amenities: [],
  });

  const [roomDetails, setRoomDetails] = useState([{ roomType: "", size: "", beds: 0, price: 0, isAvailable: true }]);

  const [pricingAvailability, setPricingAvailability] = useState({
    pricePerNight: 0,
    isAvailable: true,
  });

  const [images, setImages] = useState([]);

  const handlePublish = async () => {
    try {
      setLoading(true);
      // Upload images to Cloudinary and retrieve URLs
      const imageUrls = await Promise.all(images.map((image) => UploadToCloudinary(image.file, `${user.username}_hotel_images`)));

      // Prepare hotel data
      const hotelData = {
        owner: user._id,
        name: propertyDetails.name,
        description: propertyDetails.description,
        location: propertyDetails.location,
        propertyType: propertyDetails.propertyType,
        categories: [propertyDetails.category],
        rooms: roomDetails.map((room) => ({
          roomType: room.roomType,
          size: room.size,
          beds: room.beds,
          baths: room.baths,
          price: room.price,
          isAvailable: room.isAvailable,
        })),
        totalRooms: roomDetails.length,
        totalBeds: roomDetails.reduce((total, room) => total + room.beds, 1),
        totalBaths: roomDetails.reduce((total, room) => total + room.baths, 1),
        price: pricingAvailability.pricePerNight,
        amenities: propertyDetails.amenities,
        images: imageUrls,
        isAvailable: pricingAvailability.isAvailable,
      };

      console.log("Hotel Data", hotelData);
      dispatch(createHotel(hotelData));
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
          <Header />
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <PropertyDetails propertyDetails={propertyDetails} setPropertyDetails={setPropertyDetails} />
              <RoomDetails roomDetails={roomDetails} setRoomDetails={setRoomDetails} />
              <PricingAvailability pricingAvailability={pricingAvailability} setPricingAvailability={setPricingAvailability} />
              <PropertyImages images={images} setImages={setImages} />
            </Box>
            <Box sx={{ mb: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button variant="outlined">Save Draft</Button>
              <Button variant="contained" onClick={handlePublish}>
                Publish
              </Button>
            </Box>
          </Container>
        </Box>
      )}
    </>
  );
}
