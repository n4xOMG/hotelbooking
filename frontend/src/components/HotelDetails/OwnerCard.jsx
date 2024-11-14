import { Avatar, Box, Button, Card, CardContent, CardHeader, Typography } from "@mui/material";
import React from "react";
import { getOptimizedImageUrl } from "../../utils/optimizeImages";

const OwnerCard = ({ owner, currentUser }) => {
  const isOwner = currentUser?._id === owner?._id;

  return (
    <Card sx={{ mt: 3, borderRadius: 2, boxShadow: 3 }}>
      <CardHeader
        sx={{
          backgroundImage: "linear-gradient(to right, #6a11cb, #2575fc)",
          color: "white",
          borderRadius: "8px 8px 0 0",
          padding: 2,
        }}
        avatar={<Avatar src={getOptimizedImageUrl(owner?.avatarUrl)} sx={{ width: 56, height: 56, border: "2px solid white" }} />}
        title={
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {owner.username}
          </Typography>
        }
        subheader={
          <Typography variant="body2" sx={{ color: "white" }}>
            {owner.email}
          </Typography>
        }
      />
      <CardContent>
        {!isOwner && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button variant="contained" color="primary" sx={{ textTransform: "none" }}>
              Message
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default OwnerCard;
