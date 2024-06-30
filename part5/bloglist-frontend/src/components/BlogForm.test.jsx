// src/components/BlogForm.test.jsx

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import BlogForm from "./BlogForm";
import blogService from "../services/blogs";

// Mock the blogService.create method
vi.mock("../services/blogs");

test("<BlogForm /> calls createBlog with the right details", async () => {
  const createBlog = vi.fn();
  const notify = vi.fn();
  const user = userEvent.setup();

  // Mock the blogService.create method to resolve with a test blog object
  blogService.create.mockResolvedValue({
    title: "Test Blog Title",
    author: "Test Author",
    url: "http://testblog.com",
  });

  render(<BlogForm createBlog={createBlog} notify={notify} />);

  const titleInput = screen.getByPlaceholderText("Title");
  const authorInput = screen.getByPlaceholderText("Author");
  const urlInput = screen.getByPlaceholderText("URL");
  const createButton = screen.getByText("create");

  await user.type(titleInput, "Test Blog Title");
  await user.type(authorInput, "Test Author");
  await user.type(urlInput, "http://testblog.com");
  await user.click(createButton);

  expect(createBlog).toHaveBeenCalledTimes(1);
  expect(createBlog).toHaveBeenCalledWith({
    title: "Test Blog Title",
    author: "Test Author",
    url: "http://testblog.com",
  });
});
