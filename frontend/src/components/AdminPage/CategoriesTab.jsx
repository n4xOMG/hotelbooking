// CategoriesTab.jsx

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
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "../../redux/category/category.action";
import LoadingSpinner from "../LoadingSpinner";
import { FixedSizeList as List } from "react-window";
import { IconMenuItem } from "../IconMenuItem";

export default function CategoriesTab() {
  const dispatch = useDispatch();
  const { categories = [], loading, error } = useSelector((state) => state.category);

  const [menuAnchorEls, setMenuAnchorEls] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [categoryData, setCategoryData] = useState({ name: "", description: "", icon: "" });
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

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    dispatch(fetchCategories());
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
    setSelectedCategory(categories.find((category) => category._id === id));
  };

  const handleMenuClose = (id) => {
    setMenuAnchorEls((prev) => ({ ...prev, [id]: null }));
    setSelectedCategory(null);
  };

  const handleDialogOpen = (category = { name: "", description: "", icon: "" }) => {
    setCategoryData(category);
    setSelectedCategory(category._id ? category : null);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setCategoryData({ name: "", description: "", icon: "" });
    setIconSearch("");
    setIconAnchorEl(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCategoryData({ ...categoryData, [name]: value });
  };

  const handleSaveCategory = async () => {
    if (!categoryData.name || !categoryData.description) {
      setSnackbar({
        open: true,
        message: "Name and Description are required.",
        severity: "warning",
      });
      return;
    }

    try {
      setActionLoading(true);
      if (categoryData._id) {
        await dispatch(updateCategory(categoryData._id, categoryData));
        setSnackbar({
          open: true,
          message: "Category updated successfully.",
          severity: "success",
        });
      } else {
        await dispatch(createCategory(categoryData));
        setSnackbar({
          open: true,
          message: "Category added successfully.",
          severity: "success",
        });
      }
      handleDialogClose();
      dispatch(fetchCategories());
    } catch (error) {
      console.error("Failed to save category:", error);
      setSnackbar({
        open: true,
        message: "Failed to save category.",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      setActionLoading(true);
      await dispatch(deleteCategory(id));
      setSnackbar({
        open: true,
        message: "Category deleted successfully.",
        severity: "success",
      });
      dispatch(fetchCategories());
    } catch (error) {
      console.error("Failed to delete category:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete category.",
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
    setCategoryData((prev) => ({ ...prev, icon: value }));
    handleIconClose();
  };

  const confirmDeleteAction = () => {
    handleDeleteCategory(deleteId);
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
            placeholder="Search categories..."
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
          Add Category
        </Button>
      </Box>
      <TableContainer component={Paper}>
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
              <TableCell>
                <Typography fontWeight="bold">Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  {category.icon && Icons[category.icon]
                    ? React.createElement(Icons[category.icon], { style: { color: "#1976d2" } })
                    : <Icons.HelpOutline />}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDialogOpen(category)} color="primary" aria-label="edit">
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton onClick={(event) => handleMenuOpen(event, category._id)} color="secondary" aria-label="more">
                    <MoreHoriz fontSize="small" />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchorEls[category._id]}
                    open={Boolean(menuAnchorEls[category._id])}
                    onClose={() => handleMenuClose(category._id)}
                  >
                    <MenuItem onClick={() => {
                      setDeleteId(category._id);
                      setConfirmDelete(true);
                    }}>
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

      {/* Add/Edit Category Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {categoryData._id ? "Edit Category" : "Add Category"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Category Name"
              type="text"
              fullWidth
              value={categoryData.name}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="dense"
              name="description"
              label="Category Description"
              type="text"
              fullWidth
              value={categoryData.description}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="dense"
              name="icon"
              label="Icon"
              type="text"
              fullWidth
              value={categoryData.icon}
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
          <Button onClick={handleSaveCategory} color="primary" disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
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