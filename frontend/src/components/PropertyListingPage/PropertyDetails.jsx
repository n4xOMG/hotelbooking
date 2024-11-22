import { Autocomplete, Box, Button, Checkbox, FormControlLabel, MenuItem, Pagination, Switch, TextField, Typography } from "@mui/material";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAmenities } from "../../redux/amenity/amenity.action";
import { fetchCategories } from "../../redux/category/category.action";
import { fetchPropertyTypes } from "../../redux/propertyType/propertyType.action";
import { fetchLocationSuggestions } from "../../utils/fetchLocationSuggestions";

const ITEMS_PER_PAGE = 6; // Number of amenities per page

export default function PropertyDetails({ propertyDetails, setPropertyDetails }) {
  const dispatch = useDispatch();
  const { propertyTypes } = useSelector((state) => state.propertyType);
  const { categories } = useSelector((state) => state.category);
  const { amenities } = useSelector((state) => state.amenity);

  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    location: "",
    description: "",
    maxGuests: "",
    propertyType: "",
    category: "",
  });

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

  const validateField = (fieldName, value) => {
    let errorMessage = "";

    switch (fieldName) {
      case "name":
        if (!value.trim()) {
          errorMessage = "Property name is required.";
        }
        break;
      case "location":
        if (!value.trim()) {
          errorMessage = "Location is required.";
        }
        break;
      case "description":
        if (!value.trim()) {
          errorMessage = "Description is required.";
        } else if (value.length < 20) {
          errorMessage = "Description must be at least 20 characters long.";
        }
        break;
      case "maxGuests":
        if (value === "" || value === null) {
          errorMessage = "Maximum number of guests is required.";
        } else if (isNaN(value)) {
          errorMessage = "Maximum guests must be a number.";
        } else if (Number(value) <= 0) {
          errorMessage = "Maximum guests must be a positive number.";
        }
        break;
      case "propertyType":
        if (!value) {
          errorMessage = "Property type is required.";
        }
        break;
      case "category":
        if (!value) {
          errorMessage = "Category is required.";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: errorMessage,
    }));
  };

  const validateAllFields = () => {
    const fields = ["name", "location", "description", "maxGuests", "propertyType", "category"];
    let isValid = true;

    fields.forEach((field) => {
      validateField(field, propertyDetails[field]);
      if (
        propertyDetails[field] === "" ||
        propertyDetails[field] === null ||
        (field === "description" && propertyDetails[field].length < 20)
      ) {
        isValid = false;
      }
    });

    return isValid;
  };

  const handleLocationChange = (event, value) => {
    setPropertyDetails((prev) => ({ ...prev, location: value }));
    if (value.length > 2) {
      debouncedFetch(value);
    } else {
      setLocationSuggestions([]);
    }
    validateField("location", value);
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setPropertyDetails((prev) => ({ ...prev, [name]: newValue }));

    // Validate the specific field on change
    validateField(name, newValue);
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

      <TextField
        fullWidth
        label="Property Name"
        name="name"
        value={propertyDetails.name}
        onChange={handleChange}
        sx={{ mb: 2 }}
        error={Boolean(errors.name)}
        helperText={errors.name}
        required
      />
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
        renderInput={(params) => (
          <TextField
            {...params}
            label="Location"
            name="location"
            sx={{ mb: 2 }}
            error={Boolean(errors.location)}
            helperText={errors.location}
            required
          />
        )}
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
        error={Boolean(errors.description)}
        helperText={errors.description}
        required
      />
      <TextField
        fullWidth
        type="number"
        label="Max Guests Number"
        name="maxGuests"
        value={propertyDetails.maxGuests}
        onChange={handleChange}
        sx={{ mb: 2 }}
        error={Boolean(errors.maxGuests)}
        helperText={errors.maxGuests}
        InputProps={{
          inputProps: {
            min: 1,
            max: 1000,
          },
        }}
        required
      />

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          select
          label="Property Type"
          name="propertyType"
          value={propertyDetails.propertyType}
          onChange={handleChange}
          fullWidth
          error={Boolean(errors.propertyType)}
          helperText={errors.propertyType}
          required
        >
          {propertyTypes.map((type) => (
            <MenuItem key={type._id} value={type._id}>
              {type.type}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Category"
          name="category"
          value={propertyDetails.category}
          onChange={handleChange}
          fullWidth
          error={Boolean(errors.category)}
          helperText={errors.category}
          required
        >
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

        {!showAll && amenities.length > ITEMS_PER_PAGE && (
          <Pagination
            count={Math.ceil(amenities.length / ITEMS_PER_PAGE)}
            page={currentPage}
            onChange={handlePaginationChange}
            sx={{ mt: 2, display: "flex", justifyContent: "center" }}
          />
        )}

        {showAll ? (
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => setShowAll(false)}>
            Show by Page
          </Button>
        ) : (
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => setShowAll(true)}>
            View All
          </Button>
        )}
      </Box>
      <FormControlLabel
        control={<Switch name="petFriendly" checked={propertyDetails.petFriendly} onChange={handleChange} />}
        label="Allow Pets"
        sx={{ mb: 2 }}
      />
    </Box>
  );
}
