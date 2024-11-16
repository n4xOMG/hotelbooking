import React, { useEffect, useState } from "react";
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
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Edit, Search } from "@mui/icons-material";
import { fetchReports, updateReportStatus } from "../../redux/report/report.action";
import LoadingSpinner from "../LoadingSpinner";

export default function ReportsTab() {
  const dispatch = useDispatch();
  const { reports, loading } = useSelector((state) => state.report);
  const [openDialog, setOpenDialog] = useState(false);
  const [reportData, setReportData] = useState({ reportedBy: "", type: "", reason: "", status: "" });
  const [searchQuery, setSearchQuery] = useState(""); // state for report search
  const [statusFilter, setStatusFilter] = useState(""); // state for status filter

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  const filteredReports = Array.isArray(reports) ? reports.filter((report) =>
    (report.reportedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.reason.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (statusFilter === "" || report.status === statusFilter)
  ) : [];

  const handleDialogOpen = (report = { reportedBy: "", type: "", reason: "", status: "" }) => {
    setReportData(report);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setReportData({ reportedBy: "", type: "", reason: "", status: "" });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setReportData({ ...reportData, [name]: value });
  };

  const handleSaveReport = () => {
    if (reportData._id) {
      dispatch(updateReportStatus(reportData._id, reportData.status));
    }
    handleDialogClose();
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <TextField
              variant="outlined"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Reported By</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report._id}>
                    <TableCell>{report.reportedBy}</TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>{report.reason}</TableCell>
                    <TableCell>
                      <Select
                        value={report.status}
                        onChange={(e) => dispatch(updateReportStatus(report._id, e.target.value))}
                        sx={{ minWidth: 120 }}
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Resolved">Resolved</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button variant="text" onClick={() => handleDialogOpen(report)}>View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={openDialog} onClose={handleDialogClose}>
            <DialogTitle>{reportData._id ? "Edit Report" : "Add Report"}</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                name="reportedBy"
                label="Reported By"
                type="text"
                fullWidth
                required
                value={reportData.reportedBy}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="type"
                label="Type"
                type="text"
                fullWidth
                required
                value={reportData.type}
                onChange={handleInputChange}
              />
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
              <TextField
                margin="dense"
                name="status"
                label="Status"
                type="text"
                fullWidth
                required
                value={reportData.status}
                onChange={handleInputChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="primary">
                Cancel
              </Button>
              <Button color="primary" onClick={handleSaveReport}>
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </>
  );
}