const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const parkingSpaceRoutes = require("./routes/parkingSpace")
const cors = require("cors");

dotenv.config();
connectDB();
const app = express();

app.use(express.json()); 
app.use(cors());
app.use("/api/user", userRoutes);
app.use("/api/parkingspaces", parkingSpaceRoutes);

const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server running on PORT ${PORT}...`));