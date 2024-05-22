// controllers/users.js
const bcrypt = require("bcryptjs"); // Using bcryptjs instead of bcrypt
const express = require("express");
const User = require("../models/user");

const usersRouter = express.Router();

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (!username || username.length < 3) {
    return response
      .status(400)
      .json({ error: "Username must be at least 3 characters long" });
  }

  if (!password || password.length < 3) {
    return response
      .status(400)
      .json({ error: "Password must be at least 3 characters long" });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(400).json({ error: "Username must be unique" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  try {
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (error) {
    console.error("Error creating user:", error);
    response.status(500).json({ error: "Server error" });
  }
});

usersRouter.get("/", async (request, response) => {
  try {
    const users = await User.find({});
    response.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    response.status(500).json({ error: "Server error" });
  }
});

module.exports = usersRouter;
