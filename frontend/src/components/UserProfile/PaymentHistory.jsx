import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPaymentHistory } from "../../redux/payment/payment.action";
import { formatDate } from "../../utils/formatDate";
import LoadingSpinner from "../LoadingSpinner";

export default function PaymentHistory() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { paymentHistory } = useSelector((state) => state.payment);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        await dispatch(getPaymentHistory());
      } catch (error) {
        console.log("Error fetching payment: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [dispatch]);

  const filteredPayments = paymentHistory.filter(
    (payment) =>
      payment.booking.hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "All" || payment.paymentStatus === statusFilter)
  );

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
            Payment History
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              label="Search hotels..."
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} displayEmpty sx={{ minWidth: 180 }}>
              <MenuItem value="All">All Statuses</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </Box>
          <Card>
            <CardContent>
              <List>
                {filteredPayments.map((payment) => (
                  <ListItem
                    key={payment._id}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      borderBottom: 1,
                      borderColor: "divider",
                      pb: 2,
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar sx={{ mr: 2 }}>{payment.booking.hotel.name[0]}</Avatar>
                        <Box>
                          <Typography fontWeight="medium">{payment.booking.hotel.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Location: {payment.booking.hotel.location}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography fontWeight="medium">${payment.amount / 100}</Typography>
                        <Typography fontWeight="medium">{payment.paymentMethod}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ mt: 2, width: "100%" }}>
                      <Typography variant="body2" color="text.secondary">
                        Booking Date: {formatDate(payment.booking.bookingDate)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Check-in: {formatDate(payment.booking.checkInDate)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Check-out: {formatDate(payment.booking.checkOutDate)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Payment Status: {payment.paymentStatus}
                      </Typography>
                    </Box>
                    <Button variant="outlined" sx={{ mt: 2 }} onClick={() => setSelectedPayment(payment)}>
                      View Details
                    </Button>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
          {filteredPayments.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: "center" }}>
              No payments found matching your search criteria.
            </Typography>
          )}
          <Dialog open={Boolean(selectedPayment)} onClose={() => setSelectedPayment(null)}>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogContent>
              {selectedPayment && (
                <>
                  <DialogContentText>
                    <strong>Hotel:</strong> {selectedPayment.booking.hotel.name}
                  </DialogContentText>
                  <DialogContentText>
                    <strong>Location:</strong> {selectedPayment.booking.hotel.location}
                  </DialogContentText>
                  <DialogContentText>
                    <strong>Booking Date:</strong> {formatDate(selectedPayment.booking.bookingDate)}
                  </DialogContentText>
                  <DialogContentText>
                    <strong>Check-in:</strong> {formatDate(selectedPayment.booking.checkInDate)}
                  </DialogContentText>
                  <DialogContentText>
                    <strong>Check-out:</strong> {formatDate(selectedPayment.booking.checkOutDate)}
                  </DialogContentText>
                  <DialogContentText>
                    <strong>Amount:</strong> ${selectedPayment.amount / 100}
                  </DialogContentText>
                  <DialogContentText>
                    <strong>Status:</strong> {selectedPayment.paymentStatus}
                  </DialogContentText>
                  <DialogContentText>
                    <strong>Payment Method:</strong> {selectedPayment.paymentMethod}
                  </DialogContentText>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedPayment(null)}>Close</Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </>
  );
}
