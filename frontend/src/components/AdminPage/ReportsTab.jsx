import { Search } from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React from "react";

export function ReportsTab() {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => setMenuAnchorEl(event.currentTarget);
  const handleMenuClose = () => setMenuAnchorEl(null);

  const reports = [
    { reportedBy: "John Doe", type: "Comment", reason: "Inappropriate content", status: "Pending" },
    { reportedBy: "Jane Smith", type: "Hotel", reason: "Misleading information", status: "Resolved" },
    { reportedBy: "Mike Johnson", type: "Comment", reason: "Spam", status: "Pending" },
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <TextField
          variant="outlined"
          placeholder="Search reports..."
          InputProps={{
            startAdornment: <Search sx={{ mr: 1 }} />,
          }}
          sx={{ width: 250 }}
        />
        <Button variant="outlined" endIcon={<KeyboardArrowDownIcon />}>
          Filter
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
            {reports.map((report, index) => (
              <TableRow key={index}>
                <TableCell>{report.reportedBy}</TableCell>
                <TableCell>{report.type}</TableCell>
                <TableCell>{report.reason}</TableCell>
                <TableCell>
                  <Select value={report.status} sx={{ minWidth: 120 }} endIcon={<KeyboardArrowDownIcon />}>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Resolved">Resolved</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="text">View Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
