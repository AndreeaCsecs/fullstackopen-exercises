require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const blogsRouter = require("./controllers/blogs");
const middleware = require("./utils/middleware");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

const app = express();

const mongoUrl = process.env.MONGODB_URI;

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.json());

app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use("/api/blogs", middleware.userExtractor, blogsRouter);

app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
