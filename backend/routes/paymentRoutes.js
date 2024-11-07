const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const { verifyToken } = require("../config/jwtConfig");

const router = express.Router();

// Create a new payment
router.post("/create-payment-intent", verifyToken, async (req, res) => {
  const { amount, currency = "usd", paymentMethodType = "card" } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: [paymentMethodType],
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Confirm the payment
router.post("/confirm-payment", verifyToken, async (req, res) => {
  const { paymentIntentId, bookingId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      const payment = new Payment({
        booking: bookingId,
        amount: paymentIntent.amount,
        paymentStatus: "completed",
        paymentMethod: paymentIntent.payment_method_types[0],
        transactionId: paymentIntent.id,
      });

      await payment.save();

      // Update booking status to confirmed
      await Booking.findByIdAndUpdate(bookingId, { status: "confirmed" });

      res.status(200).send({ message: "Payment successful", payment });
    } else {
      res.status(400).send({ message: "Payment not successful" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get payment history for a user
router.get("/history", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const payments = await Payment.find({ user: userId }).populate("booking");
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
