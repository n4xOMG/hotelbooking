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
} from "@mui/material";
import { Delete, Edit, MoreHoriz, Search } from "@mui/icons-material";
import * as Icons from "@mui/icons-material";
import { FixedSizeList as List } from "react-window";
import { useDispatch, useSelector } from "react-redux";
import { createAmenity, deleteAmenity, fetchAmenities, updateAmenity } from "../../redux/amenity/amenity.action";

// Item component for rendering icons in the Popover
const IconMenuItem = ({ index, style, data, onSelect }) => {
  const { label, value } = data[index];
  return (
    <MenuItem style={style} onClick={() => onSelect(value)}>
      {React.createElement(Icons[value])} {label}
    </MenuItem>
  );
};

const AmenitiesTab = () => {
  const dispatch = useDispatch();
  const { amenities, loading } = useSelector((state) => state.amenity);

  const [iconAnchorEl, setIconAnchorEl] = useState(null);
  const [anchorEls, setAnchorEls] = useState({});
  const [amenityData, setAmenityData] = useState({ name: "", description: "", icon: "" });
  const [openDialog, setOpenDialog] = useState(false);
  const [iconSearch, setIconSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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
      alert("Please fill out all required fields.");
      return;
    }

    if (amenityData._id) {
      dispatch(updateAmenity(amenityData._id, amenityData));
    } else {
      dispatch(createAmenity(amenityData));
    }
    handleDialogClose();
  };

  const handleDeleteAmenity = (id) => {
    dispatch(deleteAmenity(id));
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

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <TextField
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
        <Button variant="contained" color="primary" onClick={() => handleDialogOpen()}>
          Add Amenity
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
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
            {filteredAmenities.map((amenity) => (
              <TableRow key={amenity._id}>
                <TableCell>{amenity.name}</TableCell>
                <TableCell>{amenity.description}</TableCell>
                <TableCell>
                  {React.createElement(Icons[amenity.icon] || Icons.HelpOutline)}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDialogOpen(amenity)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton onClick={(e) => handleMenuOpen(e, amenity)}>
                    <MoreHoriz fontSize="small" />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEls[amenity._id]}
                    open={Boolean(anchorEls[amenity._id])}
                    onClose={() => handleMenuClose(amenity._id)}
                  >
                    <MenuItem onClick={() => handleDeleteAmenity(amenity._id)}>
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
        <DialogTitle>
          {amenityData._id ? "Edit Amenity" : "Add Amenity"}
        </DialogTitle>
        <DialogContent>
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
            <Box sx={{ p: 1 }}>
              <TextField
                placeholder="Search icon..."
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
          <Button onClick={handleSaveAmenity} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AmenitiesTab;
