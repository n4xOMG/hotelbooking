import { Grid, Paper, Typography } from "@mui/material";

export function DashboardOverview({ hotels }) {
  const stats = [
    { label: "Total Hotels", value: `${hotels.length}` },
    { label: "Active Bookings", value: 48 },
    { label: "Average Rating", value: 4.6 },
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
