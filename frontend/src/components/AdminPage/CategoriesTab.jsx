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
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "../../redux/category/category.action";
import LoadingSpinner from "../LoadingSpinner";
import { FixedSizeList as List } from "react-window";
import { IconMenuItem } from "../IconMenuItem";

export default function CategoriesTab() {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.category);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [categoryData, setCategoryData] = useState({ name: "", description: "", icon: "" });
  const [iconAnchorEl, setIconAnchorEl] = useState(null);
  const iconOptions = Object.keys(Icons).map((icon) => ({
    label: icon,
    value: icon,
  }));
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleMenuOpen = (event, category) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCategory(null);
  };

  const handleDialogOpen = (category = { name: "" }) => {
    setCategoryData(category);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setCategoryData({ name: "" });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCategoryData({ ...categoryData, [name]: value });
  };

  const handleSaveCategory = () => {
    if (categoryData._id) {
      dispatch(updateCategory(categoryData._id, categoryData));
    } else {
      dispatch(createCategory(categoryData));
    }
    handleDialogClose();
  };

  const handleDeleteCategory = (id) => {
    dispatch(deleteCategory(id));
    dispatch(fetchCategories());
    handleMenuClose();
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
  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box sx={{ p: 2 }}>
          <Button variant="contained" color="primary" onClick={() => handleDialogOpen()}>
            Add Category
          </Button>
          <TableContainer>
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
                {categories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>{React.createElement(Icons[category.icon])}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDialogOpen(category)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton onClick={(event) => handleMenuOpen(event, category)}>
                        <Delete fontSize="small" />
                      </IconButton>
                      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem onClick={() => handleDeleteCategory(selectedCategory._id)}>
                          <Delete fontSize="small" sx={{ mr: 1 }} />
                          Delete
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={openDialog} onClose={handleDialogClose}>
            <DialogTitle>{selectedCategory ? "Edit Category" : "Add Category"}</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Category Name"
                type="text"
                fullWidth
                required
                value={categoryData.name}
                onChange={handleInputChange}
              />
              <TextField
                autoFocus
                margin="dense"
                name="description"
                label="Category Description"
                type="text"
                fullWidth
                required
                value={categoryData.description}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="icon"
                label="Icon"
                type="text"
                fullWidth
                required
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
                <List height={300} itemCount={iconOptions.length} itemSize={50} width={300} itemData={iconOptions}>
                  {({ index, style }) => <IconMenuItem index={index} style={style} data={iconOptions} onSelect={handleIconSelect} />}
                </List>
              </Popover>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleSaveCategory} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </>
  );
}
