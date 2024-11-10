import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import { Box, Button, Card, CardContent, CardHeader, IconButton } from "@mui/material";

export default function PropertyImages({ images, setImages }) {
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardHeader title="Property Images" />
      <CardContent>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Button variant="outlined" component="label" sx={{ mb: 2 }}>
            <UploadIcon sx={{ mr: 1 }} />
            Upload Images
            <input type="file" hidden multiple onChange={handleImageUpload} />
          </Button>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
            {images.map((image, index) => (
              <Box
                key={index}
                sx={{
                  position: "relative",
                  width: 150,
                  height: 100,
                  overflow: "hidden",
                  borderRadius: 1,
                  boxShadow: 1,
                }}
              >
                <img src={image.preview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleRemoveImage(index)}
                  sx={{ position: "absolute", top: 5, right: 5, backgroundColor: "rgba(255, 255, 255, 0.7)" }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
