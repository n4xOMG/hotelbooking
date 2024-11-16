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
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedPropertyType, setSelectedPropertyType] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [propertyTypeData, setPropertyTypeData] = useState({ type: "", description: "", icon: "" });
  const [iconAnchorEl, setIconAnchorEl] = useState(null);
  const [iconSearch, setIconSearch] = useState(""); // state for icon search
  const [searchQuery, setSearchQuery] = useState(""); // state for property type search
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

  const handleMenuOpen = (event, propertyType) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedPropertyType(propertyType);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
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
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPropertyTypeData({ ...propertyTypeData, [name]: value });
  };

  const handleSavePropertyType = () => {
    if (propertyTypeData._id) {
      dispatch(updatePropertyType(propertyTypeData._id, propertyTypeData));
    } else {
      dispatch(createPropertyType(propertyTypeData));
    }
    handleDialogClose();
  };

  const handleDeletePropertyType = (id) => {
    dispatch(deletePropertyType(id));
    dispatch(fetchPropertyTypes());
    handleMenuClose();
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
                  <IconButton onClick={(event) => handleMenuOpen(event, propertyType)}>
                    <MoreHoriz fontSize="small" />
                  </IconButton>
                  <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
                    <MenuItem onClick={() => handleDeletePropertyType(selectedPropertyType._id)}>
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
          <Button color="primary" onClick={handleSavePropertyType}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}