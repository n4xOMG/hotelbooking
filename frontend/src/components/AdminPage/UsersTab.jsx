// UsersTab.jsx

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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Paper,
  Tooltip,
  Snackbar,
  Alert,
  Grid,
  TablePagination, // Added for pagination
} from "@mui/material";
import { Edit, Search } from "@mui/icons-material";
import {
  fetchUsers,
  updateUser,
} from "../../redux/user/user.action";
import LoadingSpinner from "../LoadingSpinner";

export default function UsersTab() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState({
    username: "",
    phoneNumber: "",
    email: "",
    role: "",
    gender: "",
  });

  const roleColors = {
    user: '#4caf50', // Green
    admin: '#f44336', // Red
    hotelOwner: '#2196f3', // Blue
  };

  // Pagination States
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Snackbar State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    return (users || []).filter((user) => {
      const matchesSearch =
        (user.username?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (user.phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (user.email?.toLowerCase().includes(searchQuery.toLowerCase()) || false);

      const matchesRole = roleFilter ? user.role === roleFilter : true;
      const matchesGender = genderFilter ? user.gender === genderFilter : true;

      return matchesSearch && matchesRole && matchesGender && !user.hidden;
    });
  }, [users, searchQuery, roleFilter, genderFilter]);

  // Calculate paginated users
  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredUsers, page, rowsPerPage]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setUserData({
      username: user.username,
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: user.role,
      gender: user.gender,
    });
    setOpenEditDialog(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = () => {
    if (
      userData.username.trim() &&
      userData.phoneNumber.trim() &&
      userData.email.trim() &&
      userData.role.trim() &&
      userData.gender.trim()
    ) {
      const updatedUser = {
        ...selectedUser,
        username: userData.username,
        phoneNumber: userData.phoneNumber,
        email: userData.email,
        role: userData.role,
        gender: userData.gender,
      };

      dispatch(updateUser(selectedUser._id, updatedUser))
        .then(() => {
          setSnackbar({
            open: true,
            message: "User updated successfully.",
            severity: "success",
          });
          setOpenEditDialog(false);
          dispatch(fetchUsers());
        })
        .catch(() => {
          setSnackbar({
            open: true,
            message: "Failed to update user.",
            severity: "error",
          });
        });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setRoleFilter("");
    setGenderFilter("");
    dispatch(fetchUsers());
    setPage(0); // Reset to first page on filter clear
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Pagination Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by username, phone, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
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
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Gender</InputLabel>
              <Select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                label="Gender"
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={handleClearFilters}
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography fontWeight="bold">Username</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Phone Number</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Email</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Role</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Gender</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography fontWeight="bold">Actions</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography>No users found.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow
                      key={user._id}
                      sx={{
                        opacity: user.hidden ? 0.5 : 1,
                        backgroundColor: user.hidden ? "grey.100" : "inherit",
                      }}
                    >
                      <TableCell>{user.username || "N/A"}</TableCell>
                      <TableCell>{user.phoneNumber || "N/A"}</TableCell>
                      <TableCell>{user.email || "N/A"}</TableCell>
                      <TableCell style={{
                        color: roleColors[user.role] || '#000', // Use color based on role
                        fontWeight: 'bold',
                      }}>{user.role || "N/A"}</TableCell>
                      <TableCell>{user.gender || "N/A"}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit User">
                          <IconButton onClick={() => handleEdit(user)}>
                            <Edit color="info" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination and Total Count */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Typography variant="body2" sx={{ mr: 2 }}>
              Total: {filteredUsers.length}
            </Typography>
            <TablePagination
              component="div"
              count={filteredUsers.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Box>
        </>
      )}

      {/* Edit User Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
            }}
            noValidate
            autoComplete="off"
          >
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
            <FormControl fullWidth margin="dense" required>
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
            <FormControl fullWidth margin="dense" required>
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={userData.gender}
                onChange={handleInputChange}
                label="Gender"
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            color="primary"
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}