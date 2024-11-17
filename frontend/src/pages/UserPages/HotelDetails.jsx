import { Box, Grid, Typography } from "@mui/material";
import { differenceInDays } from "date-fns";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Header from "../../components/HomePage/Header";
import AmenitiesList from "../../components/HotelDetails/AmenitiesList";
import BookingSummary from "../../components/HotelDetails/BookingSummary";
import DateRangePickerComponent from "../../components/HotelDetails/DateRangePickerComponent";
import HotelDetailHeader from "../../components/HotelDetails/HotelDetailHeader";
import HotelImages from "../../components/HotelDetails/HotelImages";
import HotelInfo from "../../components/HotelDetails/HotelInfo";
import LoadingSpinner from "../../components/LoadingSpinner";
import RatingSection from "../../components/HotelDetails/RatingSection";
import OwnerCard from "../../components/HotelDetails/OwnerCard";
import { fetchHotelById } from "../../redux/hotel/hotel.action";

export default function HotelDetails() {
  const { id } = useParams();
  const { hotel } = useSelector((state) => state.hotel);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const today = new Date();
  const [dateRange, setDateRange] = useState([today, today]);
  const numberOfNights = dateRange[0] && dateRange[1] ? differenceInDays(dateRange[1], dateRange[0]) : 1;

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
      {loading ? (
        <LoadingSpinner />
      ) : (
        hotel && (
          <Box sx={{ mx: "auto", px: 2 }}>
            <Header />
            <HotelDetailHeader title={hotel?.name} />
            {hotel?.images ? (
              <HotelImages hotelId={hotel?._id} images={hotel?.images} />
            ) : (
              <Typography variant="body1">No images available.</Typography>
            )}
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <HotelInfo hotel={hotel} />
                <AmenitiesList amenities={hotel.amenities} />
                <DateRangePickerComponent dateRange={dateRange} setDateRange={setDateRange} hotelId={hotel._id} />
                <RatingSection hotelId={hotel._id} />
              </Grid>
              <Grid item xs={12} md={4}>
                <BookingSummary
                  pricePerNight={hotel?.pricePerNight}
                  numberOfNights={numberOfNights}
                  dateRange={dateRange}
                  hotelId={hotel._id}
                />
                {hotel.owner && <OwnerCard owner={hotel.owner} currentUser={user} />}
              </Grid>
            </Grid>
          </Box>
        )
      )}
    </>
  );
}
