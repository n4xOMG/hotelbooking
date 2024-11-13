import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/HomePage/Header";
import LoadingSpinner from "../../components/LoadingSpinner";
import PricingAvailability from "../../components/PropertyListingPage/PricingAvailability";
import PropertyDetails from "../../components/PropertyListingPage/PropertyDetails";
import PropertyImages from "../../components/PropertyListingPage/PropertyImages";
import RoomDetails from "../../components/PropertyListingPage/RoomDetails";
import { createHotel, fetchHotelById, updateHotel } from "../../redux/hotel/hotel.action";
import { UploadToCloudinary } from "../../utils/uploadToCloudinary";

export default function PropertyListingPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.user);
  const [loading, setLoading] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState({
    name: "",
    location: "",
    description: "",
    propertyType: "",
    category: "",
    maxGuests: 1,
    petFriendly: false,
    amenities: [],
  });
  const [roomDetails, setRoomDetails] = useState([{ size: "", beds: 0, baths: 0, isAvailable: true }]);
  const [pricingAvailability, setPricingAvailability] = useState({
    pricePerNight: 0,
    isAvailable: true,
  });
  const [images, setImages] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");

  useEffect(() => {
    if (id) {
      setLoading(true);
      dispatch(fetchHotelById(id)).then((response) => {
        const hotelData = response.payload;
        setPropertyDetails({
          name: hotelData.name,
          location: hotelData.location,
          description: hotelData.description,
          propertyType: hotelData.propertyType._id,
          category: hotelData.categories[0]._id,
          maxGuests: hotelData.maxGuests,
          petFriendly: hotelData.petFriendly,
          amenities: hotelData.amenities.map((amenity) => amenity._id),
        });
        setRoomDetails(hotelData.rooms);
        setPricingAvailability({
          pricePerNight: hotelData.pricePerNight,
          isAvailable: hotelData.isAvailable,
        });
        setImages(hotelData.images.map((url) => ({ file: null, preview: url })));
        setLoading(false);
      });
    }
  }, [dispatch, id]);

  const handlePublish = async () => {
    try {
      setLoading(true);
      // Upload images to Cloudinary and retrieve URLs
      const imageUrls = await Promise.all(
        images.map((image) => (image.file ? UploadToCloudinary(image.file, `${user.username}_hotel_images`) : image.preview))
      );

      // Prepare hotel data
      const hotelData = {
        owner: user._id,
        name: propertyDetails.name,
        description: propertyDetails.description,
        location: propertyDetails.location,
        propertyType: propertyDetails.propertyType,
        categories: [propertyDetails.category],
        maxGuests: propertyDetails.maxGuests,
        petFriendly: propertyDetails.petFriendly,
        rooms: roomDetails.map((room) => ({
          size: room.size,
          beds: room.beds,
          baths: room.baths,
          isAvailable: room.isAvailable,
        })),
        totalRooms: roomDetails.length,
        totalBeds: roomDetails.reduce((total, room) => total + room.beds, 0),
        totalBaths: roomDetails.reduce((total, room) => total + room.baths, 0),
        pricePerNight: pricingAvailability.pricePerNight,
        amenities: propertyDetails.amenities,
        images: imageUrls,
        isAvailable: pricingAvailability.isAvailable,
      };

      console.log("Hotel Data", hotelData);
      if (id) {
        await dispatch(updateHotel(id, hotelData));
        setDialogTitle("Success");
        setDialogMessage("Hotel updated successfully.");
      } else {
        await dispatch(createHotel(hotelData));
        setDialogTitle("Success");
        setDialogMessage("Hotel added successfully.");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      setDialogTitle("Error");
      setDialogMessage("Failed to save hotel. Please try again.");
    } finally {
      setLoading(false);
      setDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    navigate("/hotels/manage-hotels");
  };

  return (
    <Container>
      <Header />
      {loading && <LoadingSpinner />}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <PropertyDetails propertyDetails={propertyDetails} setPropertyDetails={setPropertyDetails} />
        <RoomDetails roomDetails={roomDetails} setRoomDetails={setRoomDetails} />
        <PricingAvailability pricingAvailability={pricingAvailability} setPricingAvailability={setPricingAvailability} />
        <PropertyImages images={images} setImages={setImages} />
      </Box>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button variant="outlined" onClick={() => navigate("/")}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handlePublish}>
          {id ? "Update" : "Publish"}
        </Button>
      </Box>
    </Container>
  );
}
