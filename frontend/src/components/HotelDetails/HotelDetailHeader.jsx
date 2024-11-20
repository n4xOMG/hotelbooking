// HotelDetailHeader.jsx

import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { Favorite, Report } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { createReport } from "../../redux/report/report.action";

export default function HotelDetailHeader({ title }) {
  const dispatch = useDispatch();
  const { user, loading: userLoading } = useSelector((state) => state.user);
  const { hotel } = useSelector((state) => state.hotel);

  const isAdmin = user?.role === "admin";

   // Snackbar State
   const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // State to control Dialog visibility
  const [openDialog, setOpenDialog] = useState(false);
  // State to store the report reason
  const [reason, setReason] = useState("");

  // Open the dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Close the dialog and reset reason
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setReason("");
  };

  // Handle the submission of the report
  const handleSubmitReport = () => {
    if (isAdmin && reason.trim() !== "") {
      const reportData = {
        reportedBy: user.username, // UserName
        type: "Hotel",
        itemId: hotel._id, // Hotel ID
        reason, // User-provided reason
      };
      dispatch(createReport(reportData))
      .then(() => {
        setSnackbar({
          open: true,
          message: "Report created successfully.",
          severity: "success",
        });
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Failed to create report.",
          severity: "error",
        });
      });
      handleCloseDialog();
    }
  };
  
  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        my: 2,
      }}
    >
      <Typography variant="h4" fontWeight="bold">
        {title}
      </Typography>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Grouping Buttons Together */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="outlined" size="small" sx={{ minWidth: 0 }}>
          <Favorite />
        </Button>
        {isAdmin && (
          <>
            <Button
              variant="outlined"
              size="small"
              color="error"
              sx={{ minWidth: 0 }}
              onClick={handleOpenDialog}
              disabled={userLoading}
            >
              <Report />
            </Button>

            {/* Report Reason Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>Report Hotel</DialogTitle>
              <DialogContent>
                <Typography variant="body2" gutterBottom>
                  Please provide a reason for reporting this hotel:
                </Typography>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Reason"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  multiline
                  rows={4}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitReport}
                  color="error"
                  disabled={reason.trim() === ""}
                >
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Box>
    </Box>
  );
}