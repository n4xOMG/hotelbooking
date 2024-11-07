import React from "react";
import React from "react";
import { Box, Button, Container, Divider, Grid2, IconButton, InputBase, Typography, Card, CardContent, CardMedia } from "@mui/material";
import { Search, CalendarToday, Tune, Favorite } from "@mui/icons-material";
const categories = [
  { name: "All", icon: Search },
  { name: "Amazing pools", icon: Search },
  { name: "Rooms", icon: Search },
  { name: "Amazing views", icon: Search },
  { name: "Tropical", icon: Search },
  { name: "Trending", icon: Search },
  { name: "Lake", icon: Search },
  { name: "Beachfront", icon: Search },
  { name: "Countryside", icon: Search },
];

export default function SearchResults() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          width: "100%",
          bgcolor: "background.paper",
          backdropFilter: "blur(5px)",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Container sx={{ height: 80, display: "flex", alignItems: "center" }}>
          <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 2, maxWidth: 640, mx: "auto" }}>
            <InputBase placeholder="Search destinations" sx={{ flex: 1, borderRadius: 1, p: 1, bgcolor: "background.paper" }} />
            <IconButton sx={{ color: "text.secondary" }}>
              <CalendarToday fontSize="small" />
            </IconButton>
            <IconButton sx={{ color: "text.secondary" }}>
              <Tune fontSize="small" />
            </IconButton>
            <Button variant="contained" startIcon={<Search />}>
              Search
            </Button>
          </Box>
        </Container>
        <Divider />
        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            p: 2,
            gap: 2,
            borderTop: 1,
            borderColor: "divider",
            whiteSpace: "nowrap",
          }}
        >
          {categories.map((category) => (
            <Button key={category.name} variant="text" sx={{ flexDirection: "column", alignItems: "center", gap: 0.5 }}>
              <category.icon fontSize="small" />
              <Typography variant="caption">{category.name}</Typography>
            </Button>
          ))}
        </Box>
      </Box>

      <Container component="main" sx={{ py: 6 }}>
        <Grid2 container spacing={3}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid2 item xs={12} sm={6} md={4} lg={3} key={i}>
              <Card>
                <Box sx={{ position: "relative" }}>
                  <CardMedia component="img" height="200" image="/placeholder.svg" alt="Property" />
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      color: "common.white",
                      bgcolor: "rgba(0, 0, 0, 0.5)",
                      "&:hover": { bgcolor: "rgba(0, 0, 0, 0.7)" },
                    }}
                  >
                    <Favorite fontSize="small" />
                  </IconButton>
                </Box>
                <CardContent>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      Property Title
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Typography variant="body2">4.9</Typography>
                      <Typography variant="body2" color="text.secondary">
                        (123)
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Available dates
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    $199 / night
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </Box>
  );
}
