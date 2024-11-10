import axios from "axios";

export const fetchLocationSuggestions = async (input) => {
  const response = await axios.get(
    `https://api.locationiq.com/v1/autocomplete?key=${process.env.REACT_APP_LOCATIONIQ_APIKEY}&q=${input}&countrycodes=VN&limit=5`
  );
  return response.data.map((location, index) => ({
    description: location.display_name,
    id: `${location.place_id}-${index}`,
  }));
};
