import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { Avatar, Box, Button, Card, CardContent, CardHeader, IconButton, TextField } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { sendEmailVerificationLink, updateUserProfile } from "../../redux/user/user.action";
import UploadToCloudinary from "../../utils/uploadToCloudinary";
import { getOptimizedImageUrl } from "../../utils/optimizeImages";

export default function PersonalInfo({ user }) {
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState({
    file: "",
    url: user.avatarUrl || "",
    error: "",
  });
  const [formData, setFormData] = useState({
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phoneNumber: user.phoneNumber,
    avatarUrl: user.avatarUrl,
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar({
          file,
          url: reader.result,
          error: "",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (formData.email !== user.email) {
      // Send email verification link
      await dispatch(sendEmailVerificationLink(formData.email));
    } else {
      let avatarUrl = "";
      if (avatar.file) {
        avatarUrl = await UploadToCloudinary(avatar.file, "user_avatar");
      }
      const editData = {
        ...formData,
        avatarUrl,
      };
      // Update other profile information
      await dispatch(updateUserProfile(editData));
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
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
          <TextField label="First Name" variant="outlined" fullWidth name="firstname" value={formData.firstname} onChange={handleChange} />
          <TextField label="Last Name" variant="outlined" fullWidth name="lastname" value={formData.lastname} onChange={handleChange} />
        </Box>
        <TextField label="Email" variant="outlined" fullWidth name="email" value={formData.email} onChange={handleChange} />
        <TextField
          label="Phone Number"
          variant="outlined"
          fullWidth
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}
