import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { differenceInDays } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchHotelById } from "../../redux/hotel/hotel.action";
import LoadingSpinner from "../../components/LoadingSpinner";
import HotelDetailHeader from "../../components/HotelDetails/HotelDetailHeader";
import HotelImages from "../../components/HotelDetails/HotelImages";
import HotelInfo from "../../components/HotelDetails/HotelInfo";
import AmenitiesList from "../../components/HotelDetails/AmenitiesList";
import DateRangePickerComponent from "../../components/HotelDetails/DateRangePickerComponent";
import BookingSummary from "../../components/HotelDetails/BookingSummary";

export default function HotelDetails() {
  const { id } = useParams();
  const { hotel } = useSelector((state) => state.hotel);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const today = new Date();
  const [dateRange, setDateRange] = useState([today, today]);
  const numberOfNights = dateRange[0] && dateRange[1] ? differenceInDays(dateRange[1], dateRange[0]) : 1;
  const pricePerNight = 94457;
  const cleaningFee = 1729677;
  const serviceFee = 59408282;
  useEffect(() => {
    setLoading(true);
    try {
      dispatch(fetchHotelById(id));
    } catch (e) {
      console.log("Error loading hotels: ", e);
    } finally {
      setLoading(false);
    }
  }, [dispatch, id]);
  return (
    <>
      {hotel && loading ? (
        <LoadingSpinner />
      ) : (
        <Box sx={{ maxWidth: "1200px", mx: "auto", px: 2, py: 4 }}>
          <HotelDetailHeader title={hotel?.name} />
          {hotel && hotel.images ? <HotelImages images={hotel.images} /> : <Typography variant="body1">No images available.</Typography>}
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <HotelInfo />
              <AmenitiesList />
              <DateRangePickerComponent dateRange={dateRange} setDateRange={setDateRange} />
            </Grid>
            <Grid item xs={12} md={4}>
              <BookingSummary
                pricePerNight={pricePerNight}
                numberOfNights={numberOfNights}
                cleaningFee={cleaningFee}
                serviceFee={serviceFee}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
}
