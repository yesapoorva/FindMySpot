const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const parkingSpaceRoutes = require("./routes/parkingSpace");
const parkingSpaceAvailabilityRoutes = require("./routes/parkingSpaceAvailability");
const reservationRoutes = require("./routes/reservation");
const cors = require("cors");
const path = require("path");
const stripe = require("./routes/stripe")

dotenv.config();
connectDB();
const app = express();

app.use(express.json()); 
app.use(cors());
app.use("/api/user", userRoutes);
app.use("/api/parkingspaces", parkingSpaceRoutes);
app.use("/api/parkingspaces", parkingSpaceAvailabilityRoutes);
app.use("/api/parkingspaces", reservationRoutes);
app.use("/api/stripe", stripe);

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running");
  });
}

// --------------------------deployment------------------------------

const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server running on PORT ${PORT}...`));