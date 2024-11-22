import { Grid, Paper, Typography } from "@mui/material";

export function DashboardOverview({ hotels }) {
  const totalRatings = hotels.reduce((acc, hotel) => acc + hotel.avgRating, 0);
  const avgRating = ((totalRatings / hotels.length).toFixed(2), 0);

  // Tính số lượng Booking
  const totalBookings = hotels.reduce((acc, hotel) => acc + hotel.ratings.length, 0);

  const stats = [
    { label: "Total Hotels", value: `${hotels.length}` },
    { label: "Active Bookings", value: `${totalBookings}` },
    { label: "Average Rating", value: `${avgRating ? avgRating : 0}` },
  ];

  return (
    <Grid container spacing={2} mb={4}>
      {stats.map((stat) => (
        <Grid item xs={12} md={4} key={stat.label}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" fontWeight="bold">
              {stat.label}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {stat.value}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
