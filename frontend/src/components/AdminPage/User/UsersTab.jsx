import React, { useEffect, useState } from "react";
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
  InputAdornment,
  Paper,
} from "@mui/material";
import { Delete, Edit, Search } from "@mui/icons-material";
import { fetchUsers,  updateUser } from "../../../redux/user/user.action";
import LoadingSpinner from "../../LoadingSpinner";
import './UsersTab.css';

export default function UsersTab() {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [userData, setUserData] = useState({ firstname: "", lastname: "", username: "", phoneNumber: "", email: "", role: "", gender: "", birthdate: "" });
  const [searchQuery, setSearchQuery] = useState(""); // state for user search

  const filteredUsers = users.filter((user) =>
    user.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleDialogOpen = (user = { firstname: "", lastname: "", username: "", phoneNumber: "", email: "", role: "", gender: "", birthdate: "" }) => {
    setUserData(user);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setUserData({ firstname: "", lastname: "", username: "", phoneNumber: "", email: "", role: "", gender: "", birthdate: "" });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSaveUser = () => {
    if (userData._id) {
      dispatch(updateUser(userData._id, userData));
    } else {
      dispatch(createUser(userData));
    }
    handleDialogClose();
  };

  const handleDeleteUser = (id) => {
    dispatch(deleteUser(id));
    dispatch(fetchUsers());
    handleMenuClose();
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <TextField
              variant="outlined"
              placeholder="Search users..."
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
              Add User
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Booked Hotels</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.phoneNumber}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.bookedHotels.length}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDialogOpen(user)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton onClick={(event) => handleMenuOpen(event, user)}>
                        <Delete fontSize="small" />
                      </IconButton>
                      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem onClick={() => handleDeleteUser(selectedUser._id)}>
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
            <DialogTitle>{selectedUser ? "Edit User" : "Add User"}</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                name="firstname"
                label="First Name"
                type="text"
                fullWidth
                required
                value={userData.firstname}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="lastname"
                label="Last Name"
                type="text"
                fullWidth
                required
                value={userData.lastname}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="username"
                label="Username"
                type="text"
                fullWidth
                required
                value={userData.username}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="phoneNumber"
                label="Phone Number"
                type="text"
                fullWidth
                required
                value={userData.phoneNumber}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="email"
                label="Email"
                type="email"
                fullWidth
                required
                value={userData.email}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="role"
                label="Role"
                type="text"
                fullWidth
                required
                value={userData.role}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="gender"
                label="Gender"
                type="text"
                fullWidth
                required
                value={userData.gender}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="birthdate"
                label="Birthdate"
                type="date"
                fullWidth
                required
                value={userData.birthdate}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="primary">
                Cancel
              </Button>
              <Button color="primary" onClick={handleSaveUser}>
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </>
  );
}