import { Add } from "@mui/icons-material";
import { Box, Button, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../../components/HomePage/Header";
import LoadingSpinner from "../../components/LoadingSpinner";
import { DashboardOverview } from "../../components/ManageHotelPage/DashboardOverview";
import { HotelList } from "../../components/ManageHotelPage/HotelList";
import { deleteHotel, fetchHotelByUser } from "../../redux/hotel/hotel.action";
import BookingManagement from "../../components/ManageHotelPage/BookingManagement";
import { fetchManagedBookings } from "../../redux/booking/booking.action";

export default function ManageHotelPage() {
  const { user } = useSelector((store) => store.user);
  const { hotelsByUser } = useSelector((store) => store.hotel);
  const { bookings } = useSelector((state) => state.booking);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        await dispatch(fetchHotelByUser(user?._id));
        await dispatch(fetchManagedBookings(user?._id));
      } catch (e) {
        console.log("Error loading hotels: ", e);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [dispatch, user?._id]);

  const handleCreateHotel = () => {
    navigate("/list-properties");
  };

  const handleEditHotel = (id) => {
    navigate(`/list-properties/${id}`);
  };

  const handleDeleteHotel = (id) => {
    setSelectedHotelId(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    await dispatch(deleteHotel(selectedHotelId));
    await dispatch(fetchHotelByUser(user?._id));
    setDialogOpen(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      {loading || bookingsLoading ? (
        <LoadingSpinner />
      ) : (
        <Box display="flex">
          <CssBaseline />
          <Box component="main" flex={1} bgcolor="grey.100">
            <Header />
            <Box display="flex" justifyContent="space-between" alignItems="center" p={4} mb={4}>
              <Typography variant="h4" fontWeight="bold">
                Dashboard
              </Typography>
              <Button variant="contained" startIcon={<Add />} onClick={handleCreateHotel}>
                Create New Hotel
              </Button>
            </Box>
            <DashboardOverview hotels={hotelsByUser} />
            <HotelList hotels={hotelsByUser} onEditHotel={handleEditHotel} onDeleteHotel={handleDeleteHotel} />
            <BookingManagement bookings={bookings} />
          </Box>
        </Box>
      )}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this hotel?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
