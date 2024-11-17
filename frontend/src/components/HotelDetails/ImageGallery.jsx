import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, IconButton, ImageList, ImageListItem, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getOptimizedImageUrl } from "../../utils/optimizeImages";
import { fetchHotelById } from "../../redux/hotel/hotel.action";
import LoadingSpinner from "../LoadingSpinner";

const ImageGallery = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hotel } = useSelector((state) => state.hotel);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!hotel || hotel._id !== id) {
      setLoading(true);
      try {
        dispatch(fetchHotelById(id));
      } catch (e) {
        console.log("Error loading hotels: ", e);
      } finally {
        setLoading(false);
      }
    }
  }, [dispatch, id]);

  if (!hotel || !hotel.images) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6">No images available.</Typography>
        <Button variant="contained" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box sx={{ p: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" fontWeight="bold">
              Image Gallery
            </Typography>
          </Box>
          <ImageList variant="masonry" cols={3} gap={16}>
            {hotel.images.map((img, index) => (
              <ImageListItem key={index}>
                <img
                  src={`${getOptimizedImageUrl(img)}?w=248&fit=crop&auto=format`}
                  srcSet={`${getOptimizedImageUrl(img)}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  alt={`Hotel Image ${index + 1}`}
                  loading="lazy"
                  style={{ borderRadius: "8px", cursor: "pointer" }}
                />
              </ImageListItem>
            ))}
          </ImageList>
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button variant="contained" onClick={() => navigate(-1)}>
              Back to Details
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ImageGallery;
