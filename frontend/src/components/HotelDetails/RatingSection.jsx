import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Avatar, Card, CardHeader, CardContent, CardMedia, Rating, Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchRatingsByHotel } from "../../redux/rating/rating.action";
import LoadingSpinner from "../LoadingSpinner";
import { formatDate } from "../../utils/formatDate";
import ViewImageModal from "./ViewImageModal";

const RatingSection = ({ hotelId }) => {
  const dispatch = useDispatch();
  const { ratingsByHotel, loading } = useSelector((state) => state.rating);
  const [openModal, setOpenModal] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchRatings = async () => {
      await dispatch(fetchRatingsByHotel(hotelId));
    };
    fetchRatings();
  }, [dispatch, hotelId]);

  const handleOpenModal = (images, index) => {
    setCurrentImages(images);
    setCurrentImageIndex(index);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentImages([]);
    setCurrentImageIndex(0);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % currentImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + currentImages.length) % currentImages.length);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Ratings & Reviews
      </Typography>
      {loading ? (
        <LoadingSpinner />
      ) : ratingsByHotel.length === 0 ? (
        <Typography>No ratings yet. Be the first to rate!</Typography>
      ) : (
        <Grid container spacing={2}>
          {ratingsByHotel.map((rating) => (
            <Grid item xs={12} key={rating._id}>
              <Card elevation={3}>
                <CardHeader
                  avatar={<Avatar src={rating.user.avatarUrl}>{rating.user.firstname.charAt(0)}</Avatar>}
                  title={`${rating.user.firstname} ${rating.user.lastname}`}
                  subheader={formatDate(rating.createdAt)}
                  action={<Rating name="read-only" value={rating.value} readOnly precision={0.5} />}
                />
                <Divider />
                <CardContent>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {rating.comment}
                  </Typography>
                  {rating.images && rating.images.length > 0 && (
                    <Grid container spacing={1}>
                      {rating.images.map((img, index) => (
                        <Grid item xs={6} sm={4} md={3} key={index}>
                          <CardMedia
                            component="img"
                            height="100"
                            image={img}
                            alt={`Rating Image ${index + 1}`}
                            sx={{ borderRadius: 1, cursor: "pointer" }}
                            onClick={() => handleOpenModal(rating.images, index)}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <ViewImageModal
        open={openModal}
        onClose={handleCloseModal}
        image={currentImages[currentImageIndex]}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
      />
    </Box>
  );
};

export default RatingSection;
