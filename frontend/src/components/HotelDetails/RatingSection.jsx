import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, CardMedia, Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchRatingsByHotel } from "../../redux/rating/rating.action";

const RatingSection = ({ hotelId }) => {
  const dispatch = useDispatch();
  const { ratings } = useSelector((state) => state.rating);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true);
      try {
        await dispatch(fetchRatingsByHotel(hotelId));
      } catch (error) {
        console.error("Error fetching ratings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [dispatch, hotelId]);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Ratings & Reviews
      </Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        ratings.map((rating) => (
          <Card key={rating._id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ mr: 2 }}>{rating.user.firstname[0]}</Avatar>
                <Typography variant="subtitle1" fontWeight="bold">
                  {rating.user.firstname} {rating.user.lastname}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {rating.comment}
              </Typography>
              {rating.images && rating.images.length > 0 && (
                <Grid container spacing={2}>
                  {rating.images.map((image, index) => (
                    <Grid item xs={6} sm={4} md={3} key={index}>
                      <CardMedia component="img" src={image} alt={`Rating image ${index + 1}`} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default RatingSection;
