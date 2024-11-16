import { Avatar, Box, Button, Card, CardContent, CardHeader, List, ListItem, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBookings } from "../../redux/booking/booking.action";
import { getUserRatings } from "../../redux/rating/rating.action";
import { formatDate } from "../../utils/formatDate";
import LoadingSpinner from "../LoadingSpinner";
import RatingDialog from "./RatingDialog";

const BookingHistory = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { bookingsByUser } = useSelector((state) => state.booking);
  const { ratingsByUser } = useSelector((state) => state.rating);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await dispatch(fetchUserBookings());
        await dispatch(getUserRatings());
      } catch (error) {
        console.log("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleOpenDialog = (hotelId) => {
    setSelectedHotelId(hotelId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedHotelId(null);
  };

  const hasUserRated = (hotelId) => {
    return ratingsByUser.some((rating) => rating.hotel.toString() === hotelId.toString());
  };

  return (
    <>
      {loading && !bookingsByUser ? (
        <LoadingSpinner />
      ) : (
        <Card sx={{ mt: 3 }}>
          <CardHeader title="Booking History" subheader="View your recent bookings" />
          <CardContent>
            <List>
              {bookingsByUser?.map((booking) => (
                <ListItem
                  key={booking._id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: 1,
                    borderColor: "divider",
                    pb: 2,
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ mr: 2 }}>{booking.hotel.name[0]}</Avatar>
                    <Box>
                      <Typography fontWeight="medium">{booking.hotel.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Check-in: {formatDate(booking.checkInDate)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Check-out: {formatDate(booking.checkOutDate)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography fontWeight="medium">${booking.totalPrice}</Typography>
                    <Typography fontWeight="medium" color={booking.status === "confirmed" ? "success.main" : "error.main"}>
                      {booking.status}
                    </Typography>
                    {booking.status === "confirmed" && (
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mt: 1 }}
                        onClick={() => handleOpenDialog(booking.hotel._id)}
                        disabled={hasUserRated(booking.hotel._id)}
                      >
                        {hasUserRated(booking.hotel._id) ? "Rated" : "Rate"}
                      </Button>
                    )}
                  </Box>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
      {selectedHotelId && <RatingDialog open={openDialog} handleClose={handleCloseDialog} hotelId={selectedHotelId} />}
    </>
  );
};

export default BookingHistory;
