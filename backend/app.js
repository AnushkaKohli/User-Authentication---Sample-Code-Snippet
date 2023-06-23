const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

//Importing Routes
const userRoute = require("./routes/userRoute");
app.use("/api", userRoute);

//Middleware for Errors
const errorMiddleware = require("./middleware/error");
app.use(errorMiddleware);

module.exports = app;