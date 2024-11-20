import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Avatar,
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Rating,
  Divider,
  Button,
  Stack,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchRatingsByHotel } from "../../redux/rating/rating.action";
import LoadingSpinner from "../LoadingSpinner";
import { formatDate } from "../../utils/formatDate";
import ViewImageModal from "./ViewImageModal";
import { Reply, Report } from "@mui/icons-material";
import { getCurrentUserByJwt } from "../../redux/user/user.action";

const RatingSection = ({ hotelId }) => {
  const dispatch = useDispatch();
  const { ratingsByHotel, loading } = useSelector((state) => state.rating);
  const [openModal, setOpenModal] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { user, loading: userLoading, error: userError } = useSelector(
    (state) => state.user
  );
  
  useEffect(() => {
    const fetchRatings = async () => {
      // Retrieve JWT from localStorage or any other secure storage
      const jwt = localStorage.getItem("token");
      if (jwt) {
        // Dispatch action to fetch current user profile
        await dispatch(getCurrentUserByJwt(jwt));
      } else {
        console.warn("JWT token not found. User might not be authenticated.");
      }
      await dispatch(fetchRatingsByHotel(hotelId));
    };
    fetchRatings();
    dispatch(getCurrentUserByJwt());
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
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + currentImages.length) % currentImages.length
    );
  };

  const handleReport = (ratingId) => {
    console.log(`Report rating with ID: ${ratingId}`);
    // Add your reporting logic here.
  };

  const handleReply = (ratingId) => {
    console.log(`Reply to rating with ID: ${ratingId}`);
    // Add your reply logic here.
  };


  const isAdmin = user?.role === "admin";
  
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
                  avatar={
                    <Avatar src={rating.user.avatarUrl}>
                      {rating.user.firstname.charAt(0)}
                    </Avatar>
                  }
                  title={`${rating.user.firstname} ${rating.user.lastname}`}
                  subheader={formatDate(rating.createdAt)}
                  action={
                    <Rating
                      name="read-only"
                      value={rating.value}
                      readOnly
                      precision={0.5}
                    />
                  }
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
                            onClick={() =>
                              handleOpenModal(rating.images, index)
                            }
                          />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                  <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleReply(rating._id)}
                        startIcon={<Reply />}
                      >
                        Reply
                      </Button>
                      {isAdmin && (
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleReport(rating._id)}
                          startIcon={<Report />}
                        >
                          Report
                        </Button>
                      )}
                    </Stack>
                  </Box>
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
