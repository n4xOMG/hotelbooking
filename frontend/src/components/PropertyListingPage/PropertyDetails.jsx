import { Autocomplete, Box, Button, Checkbox, FormControlLabel, MenuItem, Pagination, TextField, Typography } from "@mui/material";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAmenities } from "../../redux/amenity/amenity.action";
import { fetchCategories } from "../../redux/category/category.action";
import { fetchPropertyTypes } from "../../redux/propertyType/propertyType.action";
import { fetchLocationSuggestions } from "../../utils/fetchLocationSuggestions";

const ITEMS_PER_PAGE = 6; // Số lượng amenities mỗi trang

export default function PropertyDetails({ propertyDetails, setPropertyDetails }) {
  const dispatch = useDispatch();
  const { propertyTypes } = useSelector((state) => state.propertyType);
  const { categories } = useSelector((state) => state.category);
  const { amenities } = useSelector((state) => state.amenity);

  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchPropertyTypes());
    dispatch(fetchAmenities());
  }, [dispatch]);

  const debouncedFetch = useCallback(
    debounce(async (input) => {
      const suggestions = await fetchLocationSuggestions(input);
      setLocationSuggestions(suggestions);
    }, 300),
    []
  );

  const handleLocationChange = (event, value) => {
    setPropertyDetails((prev) => ({ ...prev, location: value }));
    if (value.length > 2) {
      debouncedFetch(value);
    } else {
      setLocationSuggestions([]);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setPropertyDetails((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleAmenityChange = (amenity) => {
    setPropertyDetails((prev) => {
      const newAmenities = prev.amenities.includes(amenity) ? prev.amenities.filter((a) => a !== amenity) : [...prev.amenities, amenity];
      return { ...prev, amenities: newAmenities };
    });
  };

  const handlePaginationChange = (event, value) => {
    setCurrentPage(value);
  };

  const visibleAmenities = showAll ? amenities : amenities.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <Box sx={{ p: 2, boxShadow: 1, bgcolor: "white", borderRadius: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Property Details
      </Typography>

      <TextField fullWidth label="Property Name" name="name" value={propertyDetails.name} onChange={handleChange} sx={{ mb: 2 }} />
      <Autocomplete
        freeSolo
        options={locationSuggestions || []}
        getOptionLabel={(option) => option.description}
        inputValue={propertyDetails.location}
        onInputChange={handleLocationChange}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.description}
          </li>
        )}
        renderInput={(params) => <TextField {...params} label="Location" name="location" sx={{ mb: 2 }} />}
      />
      <TextField
        fullWidth
        label="Description"
        name="description"
        value={propertyDetails.description}
        onChange={handleChange}
        multiline
        rows={4}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        type="number"
        min="1"
        max="1000"
        label="Max guests number"
        name="maxGuests"
        value={propertyDetails.maxGuests}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField select label="Property Type" name="propertyType" value={propertyDetails.propertyType} onChange={handleChange} fullWidth>
          {propertyTypes.map((type) => (
            <MenuItem key={type._id} value={type._id}>
              {type.type}
            </MenuItem>
          ))}
        </TextField>
        <TextField select label="Category" name="category" value={propertyDetails.category} onChange={handleChange} fullWidth>
          {categories.map((category) => (
            <MenuItem key={category._id} value={category._id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "medium", mb: 1 }}>
          Amenities
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, maxHeight: "300px", overflowY: "auto" }}>
          {visibleAmenities.map((amenity) => (
            <FormControlLabel
              key={amenity._id}
              control={
                <Checkbox checked={propertyDetails.amenities.includes(amenity._id)} onChange={() => handleAmenityChange(amenity._id)} />
              }
              label={amenity.name}
              sx={{
                flex: "1 1 30%", // Điều chỉnh để vừa với giao diện
                minWidth: "150px",
              }}
            />
          ))}
        </Box>

        {!showAll && (
          <Pagination
            count={Math.ceil(amenities.length / ITEMS_PER_PAGE)}
            page={currentPage}
            onChange={handlePaginationChange}
            sx={{ mt: 2, display: "flex", justifyContent: "center" }}
          />
        )}

        {showAll ? (
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => setShowAll(false)}>
            Hiển thị theo trang
          </Button>
        ) : (
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => setShowAll(true)}>
            Xem tất cả
          </Button>
        )}
      </Box>
    </Box>
  );
}
