import React, { useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  TextField,
  Stack,
} from "@mui/material";
import { PendingActions, CheckCircle, Cancel, Person, CalendarMonth, AttachMoney } from "@mui/icons-material";

export default function BookingManagement({ bookings }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate statistics
  const totalBookings = bookings?.length || 0;
  const pendingBookings = bookings?.filter((booking) => booking.status === "pending").length || 0;
  const confirmedBookings = bookings?.filter((booking) => booking.status === "confirmed").length || 0;
  const canceledBookings = bookings?.filter((booking) => booking.status === "canceled").length || 0;
  const totalRevenue = bookings?.reduce((sum, booking) => (booking.status === "confirmed" ? sum + booking.totalPrice : sum), 0) || 0;

  // Filter bookings
  const filteredBookings = bookings?.filter((booking) => {
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    const matchesSearch =
      booking.user.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.user.lastname.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusChipProps = (status) => {
    switch (status) {
      case "pending":
        return { color: "warning", icon: <PendingActions /> };
      case "confirmed":
        return { color: "success", icon: <CheckCircle /> };
      case "canceled":
        return { color: "error", icon: <Cancel /> };
      default:
        return { color: "default", icon: null };
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Booking Management
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Person color="primary" />
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Total Bookings
                  </Typography>
                  <Typography variant="h4">{totalBookings}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <PendingActions color="warning" />
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Pending
                  </Typography>
                  <Typography variant="h4">{pendingBookings}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <CheckCircle color="success" />
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Confirmed
                  </Typography>
                  <Typography variant="h4">{confirmedBookings}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <AttachMoney color="primary" />
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Total Revenue
                  </Typography>
                  <Typography variant="h4">${totalRevenue}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        <TextField size="small" label="Search guest name" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <Select size="small" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="confirmed">Confirmed</MenuItem>
          <MenuItem value="canceled">Canceled</MenuItem>
        </Select>
      </Box>

      {/* Bookings Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Guest Name</TableCell>
              <TableCell>Check In</TableCell>
              <TableCell>Check Out</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Booking Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings?.map((booking) => {
              const { color, icon } = getStatusChipProps(booking.status);
              return (
                <TableRow key={booking._id}>
                  <TableCell>{`${booking.user.firstname} ${booking.user.lastname}`}</TableCell>
                  <TableCell>{new Date(booking.checkInDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(booking.checkOutDate).toLocaleDateString()}</TableCell>
                  <TableCell>${booking.totalPrice}</TableCell>
                  <TableCell>
                    <Chip icon={icon} label={booking.status} color={color} size="small" />
                  </TableCell>
                  <TableCell>{new Date(booking.bookingDate).toLocaleDateString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
