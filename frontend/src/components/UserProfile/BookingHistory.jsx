import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, CardHeader, List, ListItem, Typography, Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBookings } from "../../redux/booking/booking.action";
import LoadingSpinner from "../LoadingSpinner";
import { formatDate } from "../../utils/formatDate";

const BookingHistory = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { bookingsByUser } = useSelector((state) => state.booking);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        await dispatch(fetchUserBookings());
      } catch (error) {
        console.log("Error fetching bookings: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [dispatch]);

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
                  </Box>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default BookingHistory;
