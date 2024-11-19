// UsersTab.jsx

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
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Edit, Search } from "@mui/icons-material";
import { fetchUsers, updateUser } from "../../redux/user/user.action";
import LoadingSpinner from "../LoadingSpinner";

export default function UsersTab() {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.user);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    phoneNumber: "",
    email: "",
    role: "",
    gender: "", // Added gender field
    birthdate: "", // Added birthday field
    avatarUrl: "",
  });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    const query = {};
    if (searchQuery) {
      query.search = searchQuery;
    }
    if (roleFilter) {
      query.role = roleFilter;
    }

    const queryString = new URLSearchParams(query).toString();
    dispatch(fetchUsers(queryString));
  }, [dispatch, searchQuery, roleFilter]);

  const handleDialogOpen = (user = {
    firstname: "", lastname: "", username: "", phoneNumber: "", email: "", role: "", gender: "", birthdate: "", avatarUrl: ""
  }) => {
    setUserData(user);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setUserData({
      firstname: "",
      lastname: "",
      username: "",
      phoneNumber: "",
      email: "",
      role: "",
      gender: "",
      birthdate: "",
      avatarUrl: "",
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSaveUser = () => {
    const { firstname, lastname, username, phoneNumber, email, role, gender, birthdate } = userData;
    if (!firstname || !lastname || !username || !phoneNumber || !email || !role || !gender || !birthdate) {
      alert("Please fill in all required fields.");
      return;
    }

    if (userData._id) {
      dispatch(updateUser(userData._id, userData));
    }

    handleDialogClose();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setRoleFilter("");
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
              sx={{ flex: 1, mr: 2 }}
            />
            <FormControl variant="outlined" sx={{ minWidth: 200, mr: 2 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                label="Role"
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="hotelOwner">Hotel Owner</MenuItem>
              </Select>
            </FormControl>
            <Button variant="outlined" onClick={handleClearFilters}>
              Clear Filters
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
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No users found matching your search/filter criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.phoneNumber}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleDialogOpen(user)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Edit/Add User Dialog */}
          <Dialog open={openDialog} onClose={handleDialogClose}>
            <DialogTitle>{userData._id ? "Edit User" : "Add User"}</DialogTitle>
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
              <FormControl margin="dense" fullWidth required>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={userData.role}
                  onChange={handleInputChange}
                  label="Role"
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="hotelOwner">Hotel Owner</MenuItem>
                </Select>
              </FormControl>
              <FormControl margin="dense" fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={userData.gender}
                  onChange={handleInputChange}
                  label="Gender"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField
                margin="dense"
                name="birthday"
                label="Birthday"
                type="date"
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
                value={userData.birthdate ? userData.birthdate.split('T')[0] : ""}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="avatarUrl"
                label="Avatar URL"
                type="url"
                fullWidth
                value={userData.avatarUrl || ""}
                onChange={handleInputChange}
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