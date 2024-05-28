//controllers/blogs.js

const express = require("express");
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

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

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

blogsRouter.post("/", async (request, response) => {
  const token = getTokenFrom(request);
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SECRET);
  } catch (error) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  const { title, author, url, likes } = request.body;

  if (!title || !url) {
    return response.status(400).json({ error: "Title and URL are required" });
  }

  try {
    const user = await User.findById(decodedToken.id);

    const blog = new Blog({
      title,
      author,
      url,
      likes: likes === undefined ? 0 : likes,
      user: user._id,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  } catch (error) {
    console.error("Error saving blog:", error);
    response.status(500).json({ error: "Server error" });
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  const token = getTokenFrom(request);
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SECRET);
  } catch (error) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  try {
    const blog = await Blog.findById(request.params.id).populate("user");
    if (!blog) {
      return response.status(404).json({ error: "Blog not found" });
    }

    // Check if the user making the request is the creator of the blog
    if (blog.user && blog.user.toString() !== decodedToken.id) {
      return response
        .status(403)
        .json({ error: "Unauthorized to delete this blog" });
    }

    await Blog.deleteOne({ _id: request.params.id });
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
