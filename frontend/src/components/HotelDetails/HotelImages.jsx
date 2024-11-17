import { Box, Grid, Button } from "@mui/material";
import React from "react";
import { getOptimizedImageUrl } from "../../utils/optimizeImages";
import { useNavigate } from "react-router-dom";

export default function HotelImages({ hotelId, images }) {
  const navigate = useNavigate();
  const maxImagesToShow = 5;
  const imagesToDisplay = images.slice(0, maxImagesToShow);

  const handleShowAllImages = () => {
    navigate(`/hotels/${hotelId}/images`);
  };

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid item xs={12} md={8} sx={{ position: "relative" }}>
        <img
          srcSet={imagesToDisplay[0]}
          src={getOptimizedImageUrl(imagesToDisplay[0])}
          alt="Main property image"
          width={800}
          height={600}
          style={{
            borderRadius: "8px",
            objectFit: "cover",
            width: "100%",
            height: "400px",
          }}
        />
        {images.length > maxImagesToShow && (
          <Button
            onClick={handleShowAllImages}
            sx={{
              position: "absolute",
              bottom: 16,
              right: 16,
              bgcolor: "rgba(255, 255, 255, 0.8)",
              color: "black",
              textTransform: "none",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 1)",
              },
            }}
          >
            Show All Images
          </Button>
        )}
      </Grid>
      <Grid item xs={12} md={4} container spacing={2}>
        {imagesToDisplay.slice(1).map((img, i) => (
          <Grid item xs={6} key={i}>
            <img
              src={getOptimizedImageUrl(img)}
              alt={`Property image ${i + 2}`}
              width={400}
              height={300}
              style={{
                borderRadius: "8px",
                objectFit: "cover",
                width: "100%",
                height: "190px",
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
