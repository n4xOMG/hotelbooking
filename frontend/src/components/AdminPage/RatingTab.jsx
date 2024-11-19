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
} from "@mui/material";
import { Edit, Delete, Visibility, Reply } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  getAllRatings,
  updateRating,
  deleteRating,
} from "../../redux/rating/rating.action";
import LoadingSpinner from "../LoadingSpinner";

export default function RatingTab() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ratings, loading, error } = useSelector((state) => state.rating);
  const [searchQuery, setSearchQuery] = useState("");
  const [starFilter, setStarFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [openReplyDialog, setOpenReplyDialog] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    dispatch(getAllRatings());
  }, [dispatch]);

  const filteredRatings = useMemo(() => {
    return (ratings || []).filter((rating) => {
      const matchesSearch =
        (rating.user?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) || false) ||
        (rating.comment?.toLowerCase()?.includes(searchQuery.toLowerCase()) || false);

      const matchesStar = starFilter ? rating.stars === parseInt(starFilter) : true;

      const matchesDate = dateFilter
        ? new Date(rating.createdAt).toLocaleDateString() ===
          new Date(dateFilter).toLocaleDateString()
        : true;

      return matchesSearch && matchesStar && matchesDate;
    });
  }, [ratings, searchQuery, starFilter, dateFilter]);

  const handleView = (id) => {
    navigate(`/ratings/${id}`);
  };

  const handleHide = (rating) => {
    const updatedRating = { ...rating, hidden: true };
    dispatch(updateRating(rating._id, updatedRating));
  };

  const handleReply = (rating) => {
    setSelectedRating(rating);
    setOpenReplyDialog(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteRating(id));
  };

  const handleReplySubmit = () => {
    // Implement reply logic here
    // For example, dispatch an action to add a reply to the rating
    setOpenReplyDialog(false);
    setReplyContent("");
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <FormControl variant="outlined" sx={{ minWidth: 150 }}>
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

        <TextField
          label="Creation Date"
          type="date"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(getAllRatings())}
        >
          Reset Filters
        </Button>
      </Box>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Stars</TableCell>
                <TableCell>Comment</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRatings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No ratings found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRatings.map((rating) => (
                  <TableRow key={rating._id} sx={{ opacity: rating.hidden ? 0.5 : 1 }}>
                    <TableCell>{rating.user?.name || "Unknown User"}</TableCell>
                    <TableCell>{rating.stars}</TableCell>
                    <TableCell>{rating.comment}</TableCell>
                    <TableCell>
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleView(rating._id)}>
                        <Visibility />
                      </IconButton>
                      <IconButton onClick={() => handleHide(rating)}>
                        <Delete />
                      </IconButton>
                      <IconButton onClick={() => handleReply(rating)}>
                        <Reply />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Reply Dialog */}
      <Dialog open={openReplyDialog} onClose={() => setOpenReplyDialog(false)}>
        <DialogTitle>Reply to Rating</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            {selectedRating?.comment || "No comment"}
          </Typography>
          <TextField
            label="Your Reply"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReplyDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleReplySubmit} color="primary">
            Submit Reply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
