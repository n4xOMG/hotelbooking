import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { Avatar, Box, Button, Card, CardContent, CardHeader, IconButton, TextField } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { sendEmailVerificationLink, updateUserProfile } from "../../redux/user/user.action";
import UploadToCloudinary from "../../utils/uploadToCloudinary";
import { getOptimizedImageUrl } from "../../utils/optimizeImages";
import LoadingSpinner from "../LoadingSpinner";

export default function PersonalInfo({ user }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState({
    file: "",
    url: user.avatarUrl || "",
    error: "",
  });
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    username: user.username || "",
    firstname: user.firstname || "",
    lastname: user.lastname || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    avatarUrl: user.avatarUrl || "",
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Optional: Validate file type and size here
      setAvatar({
        file,
        url: URL.createObjectURL(file),
        error: "",
      });
    }
  };

  // Validation function
  const validate = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required.";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long.";
    }

    // First name validation
    if (!formData.firstname.trim()) {
      newErrors.firstname = "First name is required.";
    }

    // Last name validation
    if (!formData.lastname.trim()) {
      newErrors.lastname = "Last name is required.";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Invalid email address.";
    }

    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits.";
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    if (formData.email !== user.email) {
      try {
        setLoading(true);
        await dispatch(sendEmailVerificationLink(formData.email));
      } catch (error) {
        console.error("Error sending email verification link:", error);
        // Optionally, set a global error message here
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        let editData = { ...formData };
        if (avatar.file) {
          const uploadedAvatarUrl = await UploadToCloudinary(avatar.file, "user_avatar");
          editData.avatarUrl = uploadedAvatarUrl;
        }
        await dispatch(updateUserProfile(editData));
        // Optionally, show a success message or perform additional actions
      } catch (error) {
        console.error("Error updating user profile:", error);
        // Optionally, set a global error message here
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Card>
          <CardHeader title="Personal Information" subheader="Manage your personal details" />
          <CardContent sx={{ display: "grid", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar src={getOptimizedImageUrl(avatar.url)} sx={{ width: 56, height: 56, mr: 2 }} />
              <IconButton color="primary" component="label">
                <input hidden accept="image/*" type="file" onChange={handleAvatarChange} />
                <PhotoCamera />
              </IconButton>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                required
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                error={Boolean(errors.firstname)}
                helperText={errors.firstname}
              />
              <TextField
                label="Last Name"
                variant="outlined"
                fullWidth
                required
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                error={Boolean(errors.lastname)}
                helperText={errors.lastname}
              />
            </Box>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              required
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={Boolean(errors.phoneNumber)}
              helperText={errors.phoneNumber}
            />
            <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit} disabled={loading}>
              Save Changes
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
}
