import { Button, Typography } from "@mui/material";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { confirmPayment, createPaymentIntent } from "../../redux/payment/payment.action";
import { bookHotel } from "../../redux/booking/booking.action";

export const CheckoutForm = ({ bookingDetails, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // Create payment intent
      const response = await dispatch(
        createPaymentIntent({
          amount: bookingDetails.totalPrice * 100,
          currency: "usd",
        })
      );

      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(response.payload.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: `${bookingDetails.firstName} ${bookingDetails.lastName}`,
            email: bookingDetails.email,
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message);
      } else if (paymentIntent.status === "succeeded") {
        // Create booking
        const bookingResponse = await dispatch(
          bookHotel({
            ...bookingDetails,
            paymentIntentId: paymentIntent.id,
          })
        );
        await dispatch(
          confirmPayment({
            paymentIntentId: paymentIntent.id,
            bookingId: bookingResponse.payload._id,
          })
        );
        onSuccess();
      }
    } catch (err) {
      setError("Payment failed. Please try again. " + err.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      <Button type="submit" variant="contained" fullWidth disabled={!stripe || loading} sx={{ mt: 3 }}>
        {loading ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
};
