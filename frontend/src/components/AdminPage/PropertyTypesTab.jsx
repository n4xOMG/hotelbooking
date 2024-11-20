// PropertyTypesTab.jsx

import React, { useEffect, useState } from "react";
import * as Icons from "@mui/icons-material";
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
  Menu,
  MenuItem,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Popover,
  InputAdornment,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import { Delete, Edit, MoreHoriz, Search } from "@mui/icons-material";
import {
  fetchPropertyTypes,
  createPropertyType,
  updatePropertyType,
  deletePropertyType,
} from "../../redux/propertyType/propertyType.action";
import LoadingSpinner from "../LoadingSpinner";
import { FixedSizeList as List } from "react-window";
import { IconMenuItem } from "../IconMenuItem";

export default function PropertyTypesTab() {
  const dispatch = useDispatch();
  const { propertyTypes, loading, error } = useSelector((store) => store.propertyType);
  const [menuAnchorEls, setMenuAnchorEls] = useState({});
  const [selectedPropertyType, setSelectedPropertyType] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [propertyTypeData, setPropertyTypeData] = useState({ type: "", description: "", icon: "" });
  const [iconAnchorEl, setIconAnchorEl] = useState(null);
  const [iconSearch, setIconSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState(false); // To handle loading for save/delete actions
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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

  const filteredPropertyTypes = propertyTypes.filter((propertyType) =>
    propertyType.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    dispatch(fetchPropertyTypes());
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

  const handleMenuOpen = (event, id) => {
    setMenuAnchorEls((prev) => ({ ...prev, [id]: event.currentTarget }));
    setSelectedPropertyType(propertyTypes.find((type) => type._id === id));
  };

  const handleMenuClose = (id) => {
    setMenuAnchorEls((prev) => ({ ...prev, [id]: null }));
    setSelectedPropertyType(null);
  };

  const handleDialogOpen = (propertyType = { type: "", description: "", icon: "" }) => {
    setPropertyTypeData(propertyType);
    setSelectedPropertyType(propertyType._id ? propertyType : null);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setPropertyTypeData({ type: "", description: "", icon: "" });
    setIconSearch("");
    setIconAnchorEl(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPropertyTypeData({ ...propertyTypeData, [name]: value });
  };

  const handleSavePropertyType = async () => {
    if (!propertyTypeData.type || !propertyTypeData.description) {
      setSnackbar({
        open: true,
        message: "Type and Description are required.",
        severity: "warning",
      });
      return;
    }

    try {
      setActionLoading(true);
      if (propertyTypeData._id) {
        await dispatch(updatePropertyType(propertyTypeData._id, propertyTypeData));
        setSnackbar({
          open: true,
          message: "Property Type updated successfully.",
          severity: "success",
        });
      } else {
        await dispatch(createPropertyType(propertyTypeData));
        setSnackbar({
          open: true,
          message: "Property Type added successfully.",
          severity: "success",
        });
      }
      handleDialogClose();
      dispatch(fetchPropertyTypes());
    } catch (error) {
      console.error("Failed to save property type:", error);
      setSnackbar({
        open: true,
        message: "Failed to save property type.",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePropertyType = async (id) => {
    try {
      setActionLoading(true);
      await dispatch(deletePropertyType(id));
      setSnackbar({
        open: true,
        message: "Property Type deleted successfully.",
        severity: "success",
      });
      dispatch(fetchPropertyTypes());
    } catch (error) {
      console.error("Failed to delete property type:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete property type.",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
      handleMenuClose(id);
    }
  };

  const handleIconClick = (event) => {
    setIconAnchorEl(event.currentTarget);
  };

  const handleIconClose = () => {
    setIconAnchorEl(null);
  };

  const handleIconSelect = (value) => {
    setPropertyTypeData((prev) => ({ ...prev, icon: value }));
    handleIconClose();
  };

  const confirmDeleteAction = () => {
    handleDeletePropertyType(deleteId);
    setConfirmDelete(false);
    setDeleteId(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Search property types..."
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
        </Box>
        <Button variant="contained" color="primary" onClick={() => handleDialogOpen()}>
          Add Property Type
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography fontWeight="bold">Type</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">Description</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">Icon</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPropertyTypes.map((propertyType) => (
              <TableRow key={propertyType._id}>
                <TableCell>{propertyType.type}</TableCell>
                <TableCell>{propertyType.description}</TableCell>
                <TableCell>
                  {propertyType.icon && Icons[propertyType.icon]
                    ? React.createElement(Icons[propertyType.icon], { style: { color: "#1976d2" } })
                    : <Icons.HelpOutline />}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDialogOpen(propertyType)} color="primary" aria-label="edit">
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton onClick={(event) => handleMenuOpen(event, propertyType._id)} color="secondary" aria-label="more">
                    <MoreHoriz fontSize="small" />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchorEls[propertyType._id]}
                    open={Boolean(menuAnchorEls[propertyType._id])}
                    onClose={() => handleMenuClose(propertyType._id)}
                  >
                    <MenuItem
                      onClick={() => {
                        setDeleteId(propertyType._id);
                        setConfirmDelete(true);
                      }}
                    >
                      <Delete fontSize="small" sx={{ mr: 1, color: "error.main" }} />
                      Delete
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <LoadingSpinner />
          </Box>
        )}
      </TableContainer>

      {/* Add/Edit Property Type Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {propertyTypeData._id ? "Edit Property Type" : "Add Property Type"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              name="type"
              label="Type"
              type="text"
              fullWidth
              value={propertyTypeData.type}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              value={propertyTypeData.description}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="dense"
              name="icon"
              label="Icon"
              type="text"
              fullWidth
              value={propertyTypeData.icon}
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
          <Button onClick={handleSavePropertyType} color="primary" disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Deletion</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteAction} color="primary" disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={24} /> : "Confirm"}
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