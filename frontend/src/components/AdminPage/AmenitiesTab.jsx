// AmenitiesTab.jsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Grid,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
  TablePagination, // Added for pagination
} from "@mui/material";
import { Delete, Edit, MoreHoriz, Search } from "@mui/icons-material";
import * as Icons from "@mui/icons-material";
import { FixedSizeList as List } from "react-window";
import { useDispatch, useSelector } from "react-redux";
import {
  createAmenity,
  deleteAmenity,
  fetchAmenities,
  updateAmenity,
} from "../../redux/amenity/amenity.action";

// Item component for rendering icons in the Popover
const IconMenuItem = ({ index, style, data, onSelect }) => {
  const { label, value } = data[index];
  const IconComponent = Icons[value] || Icons.HelpOutline;
  return (
    <MenuItem style={style} onClick={() => onSelect(value)}>
      <IconComponent style={{ marginRight: 8, color: "#1976d2" }} />
      {label}
    </MenuItem>
  );
};

export default function AmenitiesTab() {
  const dispatch = useDispatch();
  const { amenities, loading, error } = useSelector((state) => state.amenity);

  const [iconAnchorEl, setIconAnchorEl] = useState(null);
  const [anchorEls, setAnchorEls] = useState({});
  const [amenityData, setAmenityData] = useState({
    name: "",
    description: "",
    icon: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [iconSearch, setIconSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination States
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Snackbar State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // 'success' | 'error' | 'warning' | 'info'
  });

  const iconOptions = Object.keys(Icons).map((icon) => ({
    label: icon,
    value: icon,
  }));

  const filteredIcons = iconOptions.filter((icon) =>
    icon.label.toLowerCase().includes(iconSearch.toLowerCase())
  );

  const filteredAmenities = amenities.filter((amenity) =>
    amenity.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    dispatch(fetchAmenities());
  }, [dispatch]);

  // Handle global errors from Redux state
  useEffect(() => {
    if (error) {
      setSnackbar({
        open: true,
        message: error,
        severity: "error",
      });
    }
  }, [error]);

  const handleMenuOpen = (event, amenity) =>
    setAnchorEls((prev) => ({ ...prev, [amenity._id]: event.currentTarget }));

  const handleMenuClose = (id) =>
    setAnchorEls((prev) => ({ ...prev, [id]: null }));

  const handleDialogOpen = (amenity = { name: "", description: "", icon: "" }) => {
    setAmenityData(amenity);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setAmenityData({ name: "", description: "", icon: "" });
    setIconSearch("");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAmenityData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAmenity = () => {
    if (!amenityData.name || !amenityData.description || !amenityData.icon) {
      setSnackbar({
        open: true,
        message: "Please fill out all required fields.",
        severity: "warning",
      });
      return;
    }

    if (amenityData._id) {
      dispatch(updateAmenity(amenityData._id, amenityData))
        .then(() => {
          setSnackbar({
            open: true,
            message: "Amenity updated successfully.",
            severity: "success",
          });
          dispatch(fetchAmenities());
        })
        .catch((err) => {
          setSnackbar({
            open: true,
            message: err.message || "Failed to update amenity.",
            severity: "error",
          });
        });
    } else {
      dispatch(createAmenity(amenityData))
        .then(() => {
          setSnackbar({
            open: true,
            message: "Amenity added successfully.",
            severity: "success",
          });
          dispatch(fetchAmenities());
        })
        .catch((err) => {
          setSnackbar({
            open: true,
            message: err.message || "Failed to add amenity.",
            severity: "error",
          });
        });
    }
    handleDialogClose();
  };

  const handleDeleteAmenity = (id) => {
    dispatch(deleteAmenity(id))
      .then(() => {
        setSnackbar({
          open: true,
          message: "Amenity deleted successfully.",
          severity: "success",
        });
        dispatch(fetchAmenities());
      })
      .catch((err) => {
        setSnackbar({
          open: true,
          message: err.message || "Failed to delete amenity.",
          severity: "error",
        });
      });
    handleMenuClose(id);
  };

  const handleIconClick = (event) => {
    setIconAnchorEl(event.currentTarget);
  };

  const handleIconClose = () => {
    setIconAnchorEl(null);
  };

  const handleIconSelect = (value) => {
    setAmenityData((prev) => ({ ...prev, icon: value }));
    handleIconClose();
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

  // Calculate the sliced amenities for current page
  const paginatedAmenities = filteredAmenities.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search amenities..."
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
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => handleDialogOpen()}
            >
              Add Amenity
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Loading Indicator */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography fontWeight="bold">Name</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Description</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Icon</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography fontWeight="bold">Actions</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAmenities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography>No amenities found.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAmenities.map((amenity) => (
                    <TableRow key={amenity._id}>
                      <TableCell>{amenity.name}</TableCell>
                      <TableCell>{amenity.description}</TableCell>
                      <TableCell>
                        {React.createElement(Icons[amenity.icon] || Icons.HelpOutline, {
                          style: { color: "#1976d2" },
                        })}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() => handleDialogOpen(amenity)}
                          color="primary"
                          aria-label="edit"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, amenity)}
                          color="secondary"
                          aria-label="more"
                        >
                          <MoreHoriz fontSize="small" />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEls[amenity._id]}
                          open={Boolean(anchorEls[amenity._id])}
                          onClose={() => handleMenuClose(amenity._id)}
                        >
                          <MenuItem onClick={() => handleDeleteAmenity(amenity._id)}>
                            <Delete fontSize="small" sx={{ mr: 1, color: "error.main" }} />
                            Delete
                          </MenuItem>
                        </Menu>
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
              Total: {filteredAmenities.length}
            </Typography>
            <TablePagination
              component="div"
              count={filteredAmenities.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Box>
        </>
      )}

      {/* Add/Edit Amenity Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {amenityData._id ? "Edit Amenity" : "Add Amenity"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Amenity Name"
              type="text"
              fullWidth
              required
              value={amenityData.name}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="description"
              label="Amenity Description"
              type="text"
              fullWidth
              required
              value={amenityData.description}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="icon"
              label="Icon"
              type="text"
              fullWidth
              value={amenityData.icon}
              onClick={handleIconClick}
              InputProps={{
                readOnly: true,
              }}
            />
            <Popover
              open={Boolean(iconAnchorEl)}
              anchorEl={iconAnchorEl}
              onClose={handleIconClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Box sx={{ p: 1, width: 300 }}>
                <TextField
                  placeholder="Search icon..."
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={iconSearch}
                  onChange={(e) => setIconSearch(e.target.value)}
                />
                <List
                  height={300}
                  itemCount={filteredIcons.length}
                  itemSize={50}
                  width={300}
                  itemData={filteredIcons}
                >
                  {({ index, style }) => (
                    <IconMenuItem
                      index={index}
                      style={style}
                      data={filteredIcons}
                      onSelect={handleIconSelect}
                    />
                  )}
                </List>
              </Box>
            </Popover>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveAmenity} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}