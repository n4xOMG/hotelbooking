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
} from "@mui/material";
import { Favorite, Report } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { createReport } from "../../redux/report/report.action";

export default function HotelDetailHeader({ title }) {
  const dispatch = useDispatch();
  const { user, loading: userLoading } = useSelector((state) => state.user);
  const { hotel } = useSelector((state) => state.hotel);

  const isAdmin = user?.role === "admin";

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
        type: "hotel",
        itemId: hotel._id, // Hotel ID
        reason, // User-provided reason
      };
      dispatch(createReport(reportData));
      handleCloseDialog();
    }
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