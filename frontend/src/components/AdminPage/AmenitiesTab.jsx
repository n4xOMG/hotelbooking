import { Delete, Edit, MoreHoriz } from "@mui/icons-material";
import * as Icons from "@mui/icons-material";
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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FixedSizeList as List } from "react-window";
import { createAmenity, deleteAmenity, fetchAmenities, updateAmenity } from "../../redux/amenity/amenity.action";
import { IconMenuItem } from "../IconMenuItem";

export default function AmenitiesTab() {
  const dispatch = useDispatch();
  const { amenities, loading, error } = useSelector((state) => state.amenity);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [amenityData, setAmenityData] = useState({ name: "", description: "", icon: "" });
  const [iconAnchorEl, setIconAnchorEl] = useState(null);
  const iconOptions = Object.keys(Icons).map((icon) => ({
    label: icon,
    value: icon,
  }));
  useEffect(() => {
    dispatch(fetchAmenities());
  }, [dispatch]);

  const handleMenuOpen = (event, amenity) => {
    setAnchorEl(event.currentTarget);
    setSelectedAmenity(amenity);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAmenity(null);
  };
  
  const handleDialogOpen = (amenity = { name: "", description: "", icon: "", _id: null }) => {
    setAmenityData(amenity);
    setSelectedAmenity(amenity._id ? amenity : null);
    setOpenDialog(true);
  };
  
  const handleDialogClose = () => {
    setOpenDialog(false);
    setAmenityData({ name: "", description: "", icon: "", _id: null });
    setSelectedAmenity(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAmenityData({ ...amenityData, [name]: value });
  };

  const handleSaveAmenity = () => {
    if (amenityData._id) {
      dispatch(updateAmenity(amenityData._id, amenityData));
    } else {
      dispatch(createAmenity(amenityData));
    }
    handleDialogClose();
  };
  const handleDeleteAmenity = (id) => {
    dispatch(deleteAmenity(id));
    handleMenuClose();
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
      <Button variant="contained" color="primary" onClick={() => handleDialogOpen()}>
        Add Amenity
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Icon</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {amenities.map((amenity) => (
              <TableRow key={amenity._id}>
                <TableCell>{amenity.name}</TableCell>
                <TableCell>{amenity.description}</TableCell>
                <TableCell>{React.createElement(Icons[amenity.icon])}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDialogOpen(amenity)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton onClick={(event) => handleMenuOpen(event, amenity)}>
                    <MoreHoriz fontSize="small" />
                  </IconButton>
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    <MenuItem onClick={() => handleDeleteAmenity(selectedAmenity._id)}>
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
        <DialogTitle>{selectedAmenity ? "Edit Amenity" : "Add Amenity"}</DialogTitle>
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
            required
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
            <List height={300} itemCount={iconOptions.length} itemSize={50} width={300} itemData={iconOptions}>
              {({ index, style }) => <IconMenuItem index={index} style={style} data={iconOptions} onSelect={handleIconSelect} />}
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
}
