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
import { fetchPropertyTypes, createPropertyType, updatePropertyType, deletePropertyType } from "../../redux/propertyType/propertyType.action";
import LoadingSpinner from "../LoadingSpinner";
import { FixedSizeList as List } from "react-window";
import { IconMenuItem } from "../IconMenuItem";

export default function PropertyTypesTab() {
  const dispatch = useDispatch();
  const { propertyTypes, loading } = useSelector((store) => store.propertyType);
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
      alert("Type and Description are required.");
      return;
    }

    try {
      setActionLoading(true);
      if (propertyTypeData._id) {
        await dispatch(updatePropertyType(propertyTypeData._id, propertyTypeData));
      } else {
        await dispatch(createPropertyType(propertyTypeData));
      }
      handleDialogClose();
    } catch (error) {
      console.error("Failed to save property type:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePropertyType = async (id) => {
    try {
      setActionLoading(true);
      await dispatch(deletePropertyType(id));
      dispatch(fetchPropertyTypes());
    } catch (error) {
      console.error("Failed to delete property type:", error);
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
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Icon</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPropertyTypes.map((propertyType) => (
              <TableRow key={propertyType._id}>
                <TableCell>{propertyType.type}</TableCell>
                <TableCell>{propertyType.description}</TableCell>
                <TableCell>{Icons[propertyType.icon] ? React.createElement(Icons[propertyType.icon]) : null}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDialogOpen(propertyType)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton onClick={(event) => handleMenuOpen(event, propertyType._id)}>
                    <MoreHoriz fontSize="small" />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchorEls[propertyType._id]}
                    open={Boolean(menuAnchorEls[propertyType._id])}
                    onClose={() => handleMenuClose(propertyType._id)}
                  >
                    <MenuItem onClick={() => handleDeletePropertyType(propertyType._id)}>
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
        <DialogTitle>{propertyTypeData.type ? "Edit Property Type" : "Add Property Type"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="type"
            label="Type"
            type="text"
            fullWidth
            value={propertyTypeData.type}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={propertyTypeData.description}
            onChange={handleInputChange}
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
          <Button onClick={handleSavePropertyType} color="primary" disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteAction} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
