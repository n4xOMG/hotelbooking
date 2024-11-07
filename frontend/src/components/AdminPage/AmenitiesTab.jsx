import { Delete, Edit, MoreHoriz } from "@mui/icons-material";
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
import { createAmenity, deleteAmenity, fetchAmenities, updateAmenity } from "../../redux/amenity/amenity.action";
import LoadingSpinner from "../LoadingSpinner";

export default function AmenitiesTab() {
  const dispatch = useDispatch();
  const { amenities, loading, error } = useSelector((state) => state.amenity);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [amenityData, setAmenityData] = useState({ name: "" });

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

  const handleDialogOpen = (amenity = { name: "" }) => {
    setAmenityData(amenity);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setAmenityData({ name: "" });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAmenityData({ ...amenityData, [name]: value });
  };

  const handleSaveAmenity = () => {
    if (selectedAmenity) {
      dispatch(updateAmenity(selectedAmenity._id, amenityData));
    } else {
      dispatch(createAmenity(amenityData));
    }
    handleDialogClose();
  };

  const handleDeleteAmenity = (id) => {
    dispatch(deleteAmenity(id));
    handleMenuClose();
  };

  return (
    <>
      {" "}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p>Error loading amenities</p>
      ) : (
        <Box sx={{ p: 2 }}>
          <Button variant="contained" color="primary" onClick={() => handleDialogOpen()}>
            Add Amenity
          </Button>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {amenities.map((amenity) => (
                  <TableRow key={amenity._id}>
                    <TableCell>{amenity.name}</TableCell>
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
                value={amenityData.name}
                onChange={handleInputChange}
              />
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
      )}
    </>
  );
}
