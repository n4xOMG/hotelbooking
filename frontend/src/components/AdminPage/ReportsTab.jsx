// ReportsTab.jsx

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Paper,
  Tooltip,
  Snackbar,
  Alert,
  Grid,
  TablePagination, // Added for pagination
} from "@mui/material";
import { Edit, Delete, Visibility, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  fetchReports,
  updateReport,
  deleteReport,
} from "../../redux/report/report.action";
import LoadingSpinner from "../LoadingSpinner";

export default function ReportsTab() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { reports, loading, error } = useSelector((state) => state.report);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState({
    reason: "",
    status: "",
  });

  const statusColors = {
    Rejected: "#f44336", // Red
    Resolved: "#4caf50", // Green
    Pending: "#2196f3", // Blue
  };

  // Pagination States
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Snackbar State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  const filteredReports = useMemo(() => {
    return (reports || []).filter((report) => {
      const matchesSearch =
        (report.reportedBy?.username
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) || false) ||
        (report.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          false);

      const mathchesType = typeFilter ? report.type === typeFilter : true;

      const matchesStatus = statusFilter
        ? report.status === statusFilter
        : true;

      const matchesDate = dateFilter
        ? new Date(report.createdAt).toLocaleDateString() ===
          new Date(dateFilter).toLocaleDateString()
        : true;

      return matchesSearch && mathchesType && matchesStatus && matchesDate;
    });
  }, [reports, searchQuery, typeFilter, statusFilter, dateFilter]);

  // Calculate paginated reports
  const paginatedReports = useMemo(() => {
    return filteredReports.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredReports, page, rowsPerPage]);

  const handleView = (reportId) => {
    navigate(`/hotels/${reportId}`);
  };

  const handleEdit = (report) => {
    setSelectedReport(report);
    setReportData({
      reason: report.reason,
      status: report.status,
    });
    setOpenEditDialog(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteReport(id))
      .then(() => {
        setSnackbar({
          open: true,
          message: "Report deleted successfully.",
          severity: "success",
        });
        dispatch(fetchReports());
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Failed to delete report.",
          severity: "error",
        });
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = () => {
    if (reportData.reason.trim() && reportData.status.trim()) {
      const updatedReport = {
        ...selectedReport,
        reason: reportData.reason,
        status: reportData.status,
      };

      dispatch(updateReport(selectedReport._id, updatedReport))
        .then(() => {
          setSnackbar({
            open: true,
            message: "Report updated successfully.",
            severity: "success",
          });
          setOpenEditDialog(false);
          dispatch(fetchReports());
        })
        .catch(() => {
          setSnackbar({
            open: true,
            message: "Failed to update report.",
            severity: "error",
          });
        });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setDateFilter("");
    setTypeFilter("");
    dispatch(fetchReports());
    setPage(0); // Reset to first page on filter clear
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Pagination Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3 }}>
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

      <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by user or reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Type</InputLabel>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                label="Type"
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                <MenuItem value="Hotel">Hotel</MenuItem>
                <MenuItem value="Comment">Comment</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {/* <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Creation Date"
              type="date"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </Grid> */}
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={handleClearFilters}
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography fontWeight="bold">User</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Type</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Reason</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Status</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Created At</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography fontWeight="bold">Actions</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography>No reports found.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedReports.map((report) => (
                    <TableRow
                      key={report._id}
                      sx={{
                        opacity: report.hidden ? 0.5 : 1,
                        backgroundColor: report.hidden ? "grey.100" : "inherit",
                      }}
                    >
                      <TableCell>
                        {report.reportedBy?.username || "Unknown User"}
                      </TableCell>
                      <TableCell>{report.type}</TableCell>
                      <TableCell>{report.reason}</TableCell>
                      <TableCell
                        style={{
                          color: statusColors[report.status] || "#000", // Use color based on status
                          fontWeight: "bold",
                        }}
                      >
                        {report.status}
                      </TableCell>
                      <TableCell>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Report">
                          <IconButton onClick={() => handleView(report.itemId)}>
                            <Visibility color="primary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Report">
                          <IconButton onClick={() => handleEdit(report)}>
                            <Edit color="info" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Report">
                          <IconButton onClick={() => handleDelete(report._id)}>
                            <Delete color="error" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination and Total Count */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Typography variant="body2" sx={{ mr: 2 }}>
              Total: {filteredReports.length}
            </Typography>
            <TablePagination
              component="div"
              count={filteredReports.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Box>
        </>
      )}

      {/* Edit Report Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Report</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              margin="dense"
              name="reason"
              label="Reason"
              type="text"
              fullWidth
              required
              value={reportData.reason}
              onChange={handleInputChange}
            />
            <FormControl fullWidth margin="dense" required>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={reportData.status}
                onChange={handleInputChange}
                label="Status"
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            color="primary"
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}