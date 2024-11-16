import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  IconButton,
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
import { Edit, Search, Reply } from "@mui/icons-material";
import { fetchReports, updateReportStatus, createReport } from "../../redux/report/report.action";
import LoadingSpinner from "../LoadingSpinner";

export default function ReportsTab() {
  const dispatch = useDispatch();
  const { reports, loading } = useSelector((state) => state.report);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [reportData, setReportData] = useState({ reportedBy: "", type: "", reason: "", status: "", reply: "" });
  const [searchQuery, setSearchQuery] = useState(""); // state for report search
  const [statusFilter, setStatusFilter] = useState(""); // state for status filter

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  // Filter the reports based on search query and selected status
  const filteredReports = useMemo(() => {
    return Array.isArray(reports)
      ? reports.filter(
          (report) =>
            ((report.reportedBy && report.reportedBy.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (report.type && report.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (report.reason && report.reason.toLowerCase().includes(searchQuery.toLowerCase()))) &&
            (statusFilter === "" || report.status === statusFilter)
        )
      : [];
  }, [reports, searchQuery, statusFilter]);

  const handleDialogOpen = (report = { reportedBy: "", type: "", reason: "", status: "", reply: "" }, editing = false, replying = false) => {
    setReportData(report);
    setIsEditing(editing);
    setIsReplying(replying);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setReportData({ reportedBy: "", type: "", reason: "", status: "", reply: "" });
    setIsEditing(false);
    setIsReplying(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setReportData({ ...reportData, [name]: value });
  };

  const handleSaveReport = () => {
    if (isEditing) {
      // Updating existing report
      dispatch(updateReportStatus(reportData._id, reportData.status));
    } else if (isReplying) {
      // Replying to a report
      // Assuming you have an action to handle replying to a report
      dispatch(updateReportStatus(reportData._id, reportData.reply));
    } else {
      // Creating a new report
      dispatch(createReport(reportData));
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
            <Button variant="contained" color="primary" onClick={() => handleDialogOpen()}>
              Add Report
            </Button>
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
                    <TableCell>{report.status}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDialogOpen(report, true, false)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleDialogOpen(report, false, true)}>
                        <Reply fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={openDialog} onClose={handleDialogClose}>
            <DialogTitle>{isEditing ? "Edit Report" : isReplying ? "Reply to Report" : "Add Report"}</DialogTitle>
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
                disabled={isEditing || isReplying}
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
                disabled={isEditing || isReplying}
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
                disabled={isEditing || isReplying}
              />
              {isReplying ? (
                <TextField
                  margin="dense"
                  name="reply"
                  label="Reply"
                  type="text"
                  fullWidth
                  required
                  value={reportData.reply}
                  onChange={handleInputChange}
                />
              ) : (
                <TextField
                  margin="dense"
                  name="status"
                  label="Status"
                  type="text"
                  fullWidth
                  required
                  value={reportData.status}
                  onChange={handleInputChange}
                  disabled
                />
              )}
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