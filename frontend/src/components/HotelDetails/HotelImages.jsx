import { Box, Grid, Button } from "@mui/material";
import React from "react";
import { getOptimizedImageUrl } from "../../utils/optimizeImages";

export default function HotelImages({ images }) {
  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid item xs={12} md={8} sx={{ position: "relative" }}>
        <img
          srcSet={images[0]}
          src={getOptimizedImageUrl(images[0])}
          alt="Main property image"
          width={800}
          height={600}
          style={{ borderRadius: "8px", objectFit: "cover", width: "100%", height: "400px" }}
        />
        <Button sx={{ position: "absolute", bottom: 16, right: 16, bgcolor: "white", color: "black" }}>Show all images</Button>
      </Grid>
      <Grid item xs={12} md={4} container spacing={2}>
        {images.map((_, i) => (
          <Grid item xs={6} key={i}>
            <img
              src={getOptimizedImageUrl(images[i])}
              alt={`Property image ${i + 1}`}
              width={400}
              height={300}
              style={{ borderRadius: "8px", objectFit: "cover", width: "100%", height: "190px" }}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
