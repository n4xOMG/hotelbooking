import { Box, Button, Container } from "@mui/material";
import PricingAvailability from "../../components/PropertyListingPage/PricingAvailability";
import PropertyDetails from "../../components/PropertyListingPage/PropertyDetails";
import PropertyImages from "../../components/PropertyListingPage/PropertyImages";
import RoomDetails from "../../components/PropertyListingPage/RoomDetails";
import Header from "../../components/HomePage/Header";

export default function PropertyListingPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="outlined">Save Draft</Button>
          <Button variant="contained">Publish</Button>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <PropertyDetails />
          <RoomDetails />
          <PricingAvailability />
          <PropertyImages />

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button variant="contained" size="large">
              Preview Listing
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
