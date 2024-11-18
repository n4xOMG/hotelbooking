import React, { useEffect, useState, useMemo } from "react";
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
    gender: "",
    birthdate: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    return Array.isArray(users)
      ? users.filter(
          (user) =>
            (user.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
              user.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
              user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
              user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (roleFilter === "" || user.role === roleFilter)
        )
      : [];
  }, [users, searchQuery, roleFilter]);

  const handleDialogOpen = (user = { firstname: "", lastname: "", username: "", phoneNumber: "", email: "", role: "", gender: "", birthdate: "" }) => {
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
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSaveUser = () => {
    if (!userData.firstname || !userData.lastname || !userData.username || !userData.email || !userData.role) {
      alert("Please fill in all required fields.");
      return;
    }
    if (userData._id) {
      dispatch(updateUser(userData._id, userData));
    }
    handleDialogClose();
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
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
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
            <Button variant="outlined" onClick={() => { setSearchQuery(""); setRoleFilter(""); }}>
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
              {filteredUsers.length === 0 ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No users found matching your search/filter criteria.
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {filteredUsers.map((user) => (
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
                  ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>

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
              <FormControl margin="dense" fullWidth>
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
                value={Date(userData.birthdate)}
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