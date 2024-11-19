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
} from "@mui/material";
import { Delete, Edit, MoreHoriz, Search } from "@mui/icons-material";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "../../redux/category/category.action";
import LoadingSpinner from "../LoadingSpinner";
import { FixedSizeList as List } from "react-window";
import { IconMenuItem } from "../IconMenuItem";

export default function CategoriesTab() {
  const dispatch = useDispatch();
  const { categories = [], loading } = useSelector((state) => state.category);

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
      alert("Name and Description are required.");
      return;
    }

    try {
      setActionLoading(true);
      if (categoryData._id) {
        await dispatch(updateCategory(categoryData._id, categoryData));
      } else {
        await dispatch(createCategory(categoryData));
      }
      handleDialogClose();
    } catch (error) {
      console.error("Failed to save category:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      setActionLoading(true);
      await dispatch(deleteCategory(id));
      dispatch(fetchCategories());
    } catch (error) {
      console.error("Failed to delete category:", error);
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
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Icon</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>{category.icon && Icons[category.icon] ? React.createElement(Icons[category.icon]) : <Icons.HelpOutline />}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDialogOpen(category)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton onClick={(event) => handleMenuOpen(event, category._id)}>
                    <MoreHoriz fontSize="small" />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchorEls[category._id]}
                    open={Boolean(menuAnchorEls[category._id])}
                    onClose={() => handleMenuClose(category._id)}
                  >
                    <MenuItem onClick={() => handleDeleteCategory(category._id)}>
                      <Delete fontSize="small" sx={{ mr: 1 }} />
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

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{categoryData.name ? "Edit Category" : "Add Category"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Category Name"
            type="text"
            fullWidth
            value={categoryData.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Category Description"
            type="text"
            fullWidth
            value={categoryData.description}
            onChange={handleInputChange}
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
            <Box sx={{ p: 1 }}>
              <TextField
                placeholder="Search icon"
                fullWidth
                variant="outlined"
                size="small"
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
              />
            </Box>
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
          </Popover>
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

      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteAction} color="primary" disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={24} /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
