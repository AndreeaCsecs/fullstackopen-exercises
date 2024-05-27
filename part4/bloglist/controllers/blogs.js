//controllers/blogs.js

const express = require("express");
const Blog = require("../models/blog");
const User = require("../models/user");

const blogsRouter = express.Router();

blogsRouter.get("/", async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate("user", {
      username: 1,
      name: 1,
    });
    response.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    response.status(500).json({ error: "Server error" });
  }
});

blogsRouter.post("/", async (request, response) => {
  try {
    const { title, author, url, likes } = request.body;

    if (!title || !url) {
      return response.status(400).json({ error: "Title and URL are required" });
    }

    const users = await User.find({});
    const user = users[0];

    const blog = new Blog({
      title,
      author,
      url,
      likes: likes === undefined ? 0 : likes,
      user: user._id,
    });

    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    console.error("Error saving blog:", error);
    response.status(500).json({ error: "Server error" });
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(request.params.id);
    if (!deletedBlog) {
      return response.status(404).json({ error: "Blog not found" });
    }
    response.status(204).end();
  } catch (error) {
    console.error("Error deleting blog:", error);
    response.status(500).json({ error: "Server error" });
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const { title, author, url, likes } = request.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { title, author, url, likes },
      { new: true }
    );

    if (!updatedBlog) {
      return response.status(404).json({ error: "Blog not found" });
    }

    response.json(updatedBlog);
  } catch (error) {
    console.error("Error updating blog:", error);
    response.status(500).json({ error: "Server error" });
  }
});

module.exports = blogsRouter;
