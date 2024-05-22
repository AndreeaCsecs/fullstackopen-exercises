// tests/blog_api.test.js

const { test, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");

const api = supertest(app);

test("blogs are returned as JSON", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("blogs contain id property", async () => {
  const response = await api.get("/api/blogs");

  response.body.forEach((blog) => {
    assert.ok(blog.id);
  });
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
  assert.deepStrictEqual(createdBlog.toJSON(), {
    ...newBlog,
    id: createdBlog.id,
  });
});

test("if likes property is missing, it defaults to 0", async () => {
  const newBlog = {
    title: "Test Blog",
    author: "Test Author",
    url: "http://testblog.com",
  };

  const response = await api.post("/api/blogs").send(newBlog).expect(201);

  assert.strictEqual(response.body.likes, 0);
});

test("responds with status code 400 if title is missing", async () => {
  const newBlog = {
    author: "Test Author",
    url: "http://testblog.com",
    likes: 10,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
});

test("responds with status code 400 if url is missing", async () => {
  const newBlog = {
    title: "Test Blog",
    author: "Test Author",
    likes: 10,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
});

test("deleting a single blog post", async () => {
  const initialBlogs = await Blog.find({});
  const blogToDelete = initialBlogs[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsAfterDeletion = await Blog.find({});
  assert.strictEqual(blogsAfterDeletion.length, initialBlogs.length - 1);

  const blogIds = blogsAfterDeletion.map((blog) => blog.id);
  assert.ok(!blogIds.includes(blogToDelete.id));
});

test("deleting a non-existent blog post returns 404", async () => {
  const nonExistentId = "61234567890abcdef1234567";
  await api.delete(`/api/blogs/${nonExistentId}`).expect(404);
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
    .send(updatedBlogData)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const updatedBlog = response.body;
  assert.strictEqual(updatedBlog.title, updatedBlogData.title);
  assert.strictEqual(updatedBlog.author, updatedBlogData.author);
  assert.strictEqual(updatedBlog.url, updatedBlogData.url);
  assert.strictEqual(updatedBlog.likes, updatedBlogData.likes);
});

test("updating a non-existent blog post returns 404", async () => {
  const nonExistentId = "61234567890abcdef1234567";
  const response = await api
    .put(`/api/blogs/${nonExistentId}`)
    .send({ title: "Updated Title" });
  assert.strictEqual(response.status, 404);
});

after(async () => {
  await mongoose.connection.close();
});
