const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");

const api = supertest(app);

let token;
let user;
let initialBlogs;

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  const passwordHash = await bcrypt.hash("password", 10);
  user = new User({ username: "testuser", passwordHash });

  const savedUser = await user.save();

  const userForToken = {
    username: savedUser.username,
    id: savedUser._id,
  };

  token = jwt.sign(userForToken, process.env.SECRET);

  const blog = new Blog({
    title: "Initial ",
    author: "Initial ",
    url: "http://initialurl1.com",
    user: savedUser._id,
  });

  await blog.save();

  initialBlogs = await Blog.find({});
});

test("blogs are returned as JSON", async () => {
  await api
    .get("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("blogs contain id property", async () => {
  const response = await api
    .get("/api/blogs")
    .set("Authorization", `Bearer ${token}`);

  if (Array.isArray(response.body)) {
    response.body.forEach((blog) => {
      assert.ok(blog.id);
    });
  } else {
    assert.fail("Response body is not an array");
  }
});

test("creating a new blog post", async () => {
  const initialBlogs = await Blog.find({});

  const newBlog = {
    title: "New Blog Post",
    author: "John Doe",
    url: "https://example.com/new-blog",
    likes: 10,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAfterPost = await Blog.find({});
  assert.strictEqual(
    blogsAfterPost.length,
    initialBlogs.length + 1,
    "Number of blogs did not increase by one after creating a new blog post"
  );

  const createdBlog = blogsAfterPost.find(
    (blog) => blog.title === newBlog.title
  );
  assert.strictEqual(createdBlog.title, newBlog.title);
  assert.strictEqual(createdBlog.author, newBlog.author);
  assert.strictEqual(createdBlog.url, newBlog.url);
  assert.strictEqual(createdBlog.likes, newBlog.likes);
});

test("if likes property is missing, it defaults to 0", async () => {
  const newBlog = {
    title: "Test Blog",
    author: "Test Author",
    url: "http://testblog.com",
  };

  const response = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201);

  assert.strictEqual(response.body.likes, 0);
});

test("responds with status code 400 if title is missing", async () => {
  const newBlog = {
    author: "Test Author",
    url: "http://testblog.com",
    likes: 10,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(400);
});

test("responds with status code 400 if url is missing", async () => {
  const newBlog = {
    title: "Test Blog",
    author: "Test Author",
    likes: 10,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(400);
});

test("deleting a single blog post", async () => {
  const newBlog = {
    title: "Test 75492",
    author: "Test Au8362857thor",
    url: "http://testblog3782.com",
    likes: 10,
  };

  const response = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201);

  const blogToDeleteId = response.body.id;

  await api
    .delete(`/api/blogs/${blogToDeleteId}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(204);

  const blogsAfterDeletion = await Blog.find({});
  assert.strictEqual(
    blogsAfterDeletion.length,
    initialBlogs.length - 1,
    "Number of blogs did not decrease by one after deleting a blog post"
  );
});

test("deleting a non-existent blog post returns 404", async () => {
  const nonExistentId = "61234567890abcdef1234567";
  const response = await api
    .delete(`/api/blogs/${nonExistentId}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(404);

  assert.strictEqual(response.status, 404, "Expected status code 404");
});

test("updating the information of an individual blog post", async () => {
  const initialBlogs = await Blog.find({});
  const blogToUpdate = initialBlogs[0];

  const updatedBlogData = {
    title: "Updated Blog Title",
    author: "Updated Author",
    url: "https://updatedurl.com",
    likes: 20,
  };

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .set("Authorization", `Bearer ${token}`)
    .send(updatedBlogData)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const updatedBlog = response.body;
  assert.strictEqual(updatedBlog.title, updatedBlogData.title);
  assert.strictEqual(updatedBlog.author, updatedBlogData.author);
  assert.strictEqual(updatedBlog.url, updatedBlogData.url);
  assert.strictEqual(updatedBlog.likes, updatedBlogData.likes);

  assert.strictEqual(response.status, 200, "Expected status code 200");
});

test("updating a non-existent blog post returns 404", async () => {
  const nonExistentId = "61234567890abcdef1234567";
  const response = await api
    .put(`/api/blogs/${nonExistentId}`)
    .set("Authorization", `Bearer ${token}`)
    .send({ title: "Updated Title" });

  assert.strictEqual(response.status, 404, "Expected status code 404");
});

after(async () => {
  await mongoose.connection.close();
});
