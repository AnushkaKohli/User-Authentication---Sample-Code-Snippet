const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

// setting up cors
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173", // when u r sharing credentials, u need to specify the origin. Origin cannot be *.
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

//Importing Routes
const userRoute = require("./routes/userRoute");
app.use("/api", userRoute);

//Middleware for Errors
const errorMiddleware = require("./middleware/error");
app.use(errorMiddleware);

module.exports = app;
