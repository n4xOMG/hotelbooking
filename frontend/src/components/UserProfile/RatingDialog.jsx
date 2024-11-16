import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Rating, Grid, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createRating } from "../../redux/rating/rating.action";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import UploadToCloudinary from "../../utils/uploadToCloudinary";
import LoadingSpinner from "../LoadingSpinner";

const RatingDialog = ({ open, handleClose, hotelId }) => {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.rating);
  const [value, setValue] = useState(5);
  const [comment, setComment] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [localError, setLocalError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(imageUrls);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!value) {
        setLocalError("Please provide a rating value.");
        return;
      }

      const uploadedImages = await Promise.all(selectedFiles.map((file) => UploadToCloudinary(file, "ratings")));

      const ratingData = {
        value,
        comment,
        images: uploadedImages,
        hotel: hotelId,
      };

      await dispatch(createRating(ratingData));
      handleClose();
    } catch (error) {
      console.error("Error submitting rating:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle>Rate Your Stay</DialogTitle>
          <DialogContent>
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            {localError && (
              <Typography color="error" sx={{ mb: 2 }}>
                {localError}
              </Typography>
            )}
            <Rating
              name="rating"
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Comment"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" component="label" startIcon={<PhotoCamera />}>
              Upload Images
              <input type="file" hidden multiple accept="image/*" onChange={handleImageChange} />
            </Button>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {previewImages.map((img, index) => (
                <Grid item key={index}>
                  <img src={img} alt={`upload-${index}`} width={100} />
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Submit Rating
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default RatingDialog;
