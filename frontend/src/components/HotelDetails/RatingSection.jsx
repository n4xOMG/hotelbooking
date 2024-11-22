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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchRatingsByHotel } from "../../redux/rating/rating.action";
import LoadingSpinner from "../LoadingSpinner";
import { formatDate } from "../../utils/formatDate";
import ViewImageModal from "./ViewImageModal";
import { Reply, Report } from "@mui/icons-material";
import { getCurrentUserByJwt } from "../../redux/user/user.action";
import { createReport } from "../../redux/report/report.action";

const RatingSection = ({ hotelId }) => {
  const dispatch = useDispatch();
  const { ratingsByHotel, loading } = useSelector((state) => state.rating);
  const [openModal, setOpenModal] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { user, loading: userLoading, error: userError } = useSelector((state) => state.user);

  const [openDialog, setOpenDialog] = useState(false);
  const [reason, setReason] = useState("");
  const [currentRatingId, setCurrentRatingId] = useState(null);

  useEffect(() => {
    const fetchRatings = async () => {
      const jwt = localStorage.getItem("token");
      if (jwt) {
        await dispatch(getCurrentUserByJwt(jwt));
      } else {
        console.warn("JWT token not found. User might not be authenticated.");
      }
      await dispatch(fetchRatingsByHotel(hotelId));
    };
    fetchRatings();
    dispatch(getCurrentUserByJwt());
  }, [dispatch, hotelId]);

  // Snackbar State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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

  const handleOpenDialog = (ratingId) => {
    setCurrentRatingId(ratingId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setReason("");
    setCurrentRatingId(null);
  };

  const handleSubmitReport = () => {
    if (reason.trim() !== "") {
      const reportData = {
        reportedBy: user.username,
        type: "Comment",
        itemId: currentRatingId,
        reason,
      };
      dispatch(createReport(reportData))
        .then(() => {
          setSnackbar({
            open: true,
            message: "Report created successfully.",
            severity: "success",
          });
        })
        .catch(() => {
          setSnackbar({
            open: true,
            message: "Failed to create report.",
            severity: "error",
          });
        });
      handleCloseDialog();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleReply = (ratingId) => {
    console.log(`Reply to rating with ID: ${ratingId}`);
  };

  const isAdmin = user?.role === "admin";

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Ratings & Reviews
      </Typography>
      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
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
                    rating.user && rating.user.avatarUrl ? (
                      <Avatar src={rating.user.avatarUrl}>{rating.user.firstname.charAt(0)}</Avatar>
                    ) : (
                      <Avatar>Ano</Avatar>
                    )
                  }
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
                  <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Stack direction="row" spacing={1}>
                      {/* <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleReply(rating._id)}
                        startIcon={<Reply />}
                      >
                        Reply
                      </Button> */}
                      {isAdmin && (
                        <Button variant="contained" color="error" onClick={() => handleOpenDialog(rating._id)} startIcon={<Report />}>
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

      {/* Report Reason Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Report Rating</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            Please provide a reason for reporting this rating:
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Reason"
            type="text"
            fullWidth
            variant="outlined"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitReport} color="error" disabled={reason.trim() === ""}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RatingSection;
