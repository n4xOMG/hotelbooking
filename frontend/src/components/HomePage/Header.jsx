import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MountainIcon from "@mui/icons-material/Terrain";
import { Box, IconButton, Link, Menu, MenuItem, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAction } from "../../redux/auth/auth.action";

export default function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    dispatch(logoutAction());
    navigate("/sign-in");
  };
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Destinations", href: "#" },
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
  ];

  // Reusable sx styles for links
  const linkStyles = {
    typography: "body2",
    fontWeight: "medium",
    textDecoration: "none",
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      width: "0",
      height: "2px",
      bottom: "-4px",
      left: "0",
      backgroundColor: "primary.main",
      transition: "width 0.3s ease-in-out",
    },
    "&:hover::after": {
      width: "100%",
    },
  };

  return (
    <Box
      component="header"
      sx={{
        px: { xs: 4, lg: 6 },
        height: 56,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Link href="#" sx={linkStyles}>
        <MountainIcon sx={{ height: 24, width: 24 }} />
        <Typography>Acme Hotels</Typography>
      </Link>

      <Box component="nav" sx={{ ml: "auto", display: "flex", alignItems: "center", gap: { xs: 2, sm: 3 } }}>
        {navLinks.map((link) => (
          <Link key={link.label} href={link.href} sx={linkStyles}>
            {link.label}
          </Link>
        ))}

        <IconButton onClick={handleMenuOpen} sx={{ color: "inherit" }}>
          <AccountCircleIcon sx={{ width: 20, height: 20 }} />
        </IconButton>

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          {user
            ? [
                <MenuItem key="profile" divider onClick={() => navigate("/profile")}>
                  Profile
                </MenuItem>,
                <MenuItem key="messages" onClick={() => navigate("/message")}>
                  Your Messages
                </MenuItem>,
                <MenuItem key="bookings" onClick={handleMenuClose}>
                  Bookings
                </MenuItem>,
                <MenuItem key="list-properties" onClick={() => navigate("/list-properties")}>
                  List your properties
                </MenuItem>,
                <MenuItem key="manage-hotels" onClick={() => navigate("/hotels/manage-hotels")}>
                  Manage your hotels
                </MenuItem>,
                user.role === "admin" && (
                  <MenuItem key="admin" onClick={() => navigate("/admin")}>
                    Admin
                  </MenuItem>
                ),
                <MenuItem key="logout" divider onClick={handleLogout}>
                  Log out
                </MenuItem>,
              ]
            : [
                <MenuItem key="login" onClick={() => navigate("/sign-in")}>
                  Sign in
                </MenuItem>,
              ]}
        </Menu>
      </Box>
    </Box>
  );
}
