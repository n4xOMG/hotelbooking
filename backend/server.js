require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { verifyToken } = require("./config/jwtConfig");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const amenityRoutes = require("./routes/amenityRoutes");
const propertyTypeRoutes = require("./routes/propertyTypeRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const reportRoutes = require("./routes/reportRoutes");

const initWebSocket = require("./utils/websocket");
const chatRoutes = require("./routes/chatRoutes");
const app = express();
const server = require("http").createServer(app);

// Initialize WebSocket
const io = initWebSocket(server);

app.use(cors());
app.use(express.json());

connectDB();

app.use("/auth", authRoutes);
app.use("/user", verifyToken, userRoutes);
app.use("/hotels", hotelRoutes);
app.use("/chats", verifyToken, chatRoutes);
app.use("/amenities", amenityRoutes);
app.use("/categories", categoryRoutes);
app.use("/payments", paymentRoutes);
app.use("/property-types", propertyTypeRoutes);
app.use("/reports", verifyToken, reportRoutes);
app.use("/ratings", ratingRoutes);
app.use("/bookings", verifyToken, bookingRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
