// RatingTab.jsx

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Paper,
  Tooltip,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import { Edit, Delete, Visibility, Report, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  getAllRatings,
  updateRating,
  deleteRating,
  createRating,
} from "../../redux/rating/rating.action";
import LoadingSpinner from "../LoadingSpinner";

export default function RatingTab() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ratings, loading, error } = useSelector((state) => state.rating);
  const [searchQuery, setSearchQuery] = useState("");
  const [starFilter, setStarFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [reportContent, setReportContent] = useState("");

  // Snackbar State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    dispatch(getAllRatings());
  }, [dispatch]);

  const filteredRatings = useMemo(() => {
    return (ratings || []).filter((rating) => {
      const matchesSearch =
        (rating.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (rating.comment?.toLowerCase().includes(searchQuery.toLowerCase()) || false);

      const matchesStar = starFilter ? rating.value === parseInt(starFilter) : true;

      const matchesDate = dateFilter
        ? new Date(rating.createdAt).toLocaleDateString() ===
          new Date(dateFilter).toLocaleDateString()
        : true;

      return matchesSearch && matchesStar && matchesDate && !rating.hidden;
    });
  }, [ratings, searchQuery, starFilter, dateFilter]);

  const handleView = (hotelId) => {
    navigate(`/hotels/${hotelId}`);
  };

  const handleHide = (rating) => {
    const updatedRating = { ...rating, hidden: true };
    dispatch(updateRating(rating._id, updatedRating))
      .then(() => {
        setSnackbar({
          open: true,
          message: "Rating hidden successfully.",
          severity: "success",
        });
        dispatch(getAllRatings());
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Failed to hide rating.",
          severity: "error",
        });
      });
  };

  const handleReport = (rating) => {
    setSelectedRating(rating);
    setReportContent("");
    setOpenReportDialog(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteRating(id))
      .then(() => {
        setSnackbar({
          open: true,
          message: "Rating deleted successfully.",
          severity: "success",
        });
        dispatch(getAllRatings());
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Failed to delete rating.",
          severity: "error",
        });
      });
  };

  const handleReportSubmit = () => {
    if (reportContent.trim()) {
      const reportData = {
        ratingId: selectedRating._id,
        comment: reportContent,
        value: 0,
        user: {
          username: "Admin",
        },
      };

      dispatch(createRating(reportData))
        .then(() => {
          setSnackbar({
            open: true,
            message: "Report submitted successfully.",
            severity: "success",
          });
          dispatch(getAllRatings());
        })
        .catch(() => {
          setSnackbar({
            open: true,
            message: "Failed to submit report.",
            severity: "error",
          });
        });
    }
    setOpenReportDialog(false);
    setReportContent("");
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStarFilter("");
    setDateFilter("");
    dispatch(getAllRatings());
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ p: 3 }}>
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


      <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by user or comment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Star Rating</InputLabel>
              <Select
                value={starFilter}
                onChange={(e) => setStarFilter(e.target.value)}
                label="Star Rating"
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {[1, 2, 3, 4, 5].map((star) => (
                  <MenuItem key={star} value={star}>
                    {star} Star{star > 1 && "s"}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Creation Date"
              type="date"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={handleClearFilters}
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography fontWeight="bold">User</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Stars</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Comment</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Created At</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography fontWeight="bold">Actions</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRatings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography>No ratings found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRatings.map((rating) => (
                  <TableRow
                    key={rating._id}
                    sx={{
                      opacity: rating.hidden ? 0.5 : 1,
                      backgroundColor: rating.hidden ? "grey.100" : "inherit",
                    }}
                  >
                    <TableCell>{rating.user?.username || "Unknown User"}</TableCell>
                    <TableCell>{rating.value}</TableCell>
                    <TableCell>{rating.comment}</TableCell>
                    <TableCell>
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Rating">
                        <IconButton onClick={() => handleView(rating.hotel)}>
                          <Visibility color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Rating">
                        <IconButton onClick={() => handleDelete(rating._id)}>
                          <Delete color="error" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Report Rating">
                        <IconButton onClick={() => handleReport(rating)}>
                          <Report color="secondary" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Report Dialog */}
      <Dialog
        open={openReportDialog}
        onClose={() => setOpenReportDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Report Rating</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            {selectedRating?.comment || "No comment"}
          </Typography>
          <TextField
            label="Your report"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={reportContent}
            onChange={(e) => setReportContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReportDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleReportSubmit}
            color="primary"
            variant="contained"
          >
            Submit Report
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}