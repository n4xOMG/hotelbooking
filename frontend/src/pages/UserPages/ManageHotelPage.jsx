import { useEffect, useState } from "react";
import { Box, Button, CssBaseline, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { HotelList } from "../../components/ManageHotelPage/HotelList";
import { Sidebar } from "../../components/ManageHotelPage/Sidebar";
import { DashboardOverview } from "../../components/ManageHotelPage/DashboardOverview";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { fetchHotelByUser, deleteHotel } from "../../redux/hotel/hotel.action";
import { Add } from "@mui/icons-material";
import Header from "../../components/HomePage/Header";

export default function ManageHotelPage() {
  const [selectedView, setSelectedView] = useState("dashboard");
  const { user } = useSelector((store) => store.user);
  const { hotels } = useSelector((store) => store.hotel);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState(null);

  useEffect(() => {
    try {
      setLoading(true);
      dispatch(fetchHotelByUser(user?._id));
    } catch (e) {
      console.log("Error loading hotels: ", e);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

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
      {loading && !hotels ? (
        <LoadingSpinner />
      ) : (
        <Box display="flex">
          <CssBaseline />
          <Sidebar selectedView={selectedView} setSelectedView={setSelectedView} />
          <Box component="main" flex={1} p={4} bgcolor="grey.100">
            <Header />
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Typography variant="h4" fontWeight="bold">
                Dashboard
              </Typography>
              <Button variant="contained" startIcon={<Add />} onClick={handleCreateHotel}>
                Create New Hotel
              </Button>
            </Box>
            <DashboardOverview />
            <HotelList hotels={hotels} onEditHotel={handleEditHotel} onDeleteHotel={handleDeleteHotel} />
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
