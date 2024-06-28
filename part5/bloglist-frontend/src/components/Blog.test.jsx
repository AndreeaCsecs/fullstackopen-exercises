//src/components/Blog.test.jsx

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Blog from "./Blog";

const blog = {
  title: "Test Blog Title",
  author: "Test Author",
  url: "http://testurl.com",
  likes: 5,
  user: {
    username: "testuser",
    name: "Test User",
  },
};

const user = {
  username: "testuser",
};

test("renders title and author but not URL or likes by default", () => {
  const { container } = render(<Blog blog={blog} user={user} />);

  // Check that the title and author are rendered
  const blogHeader = container.querySelector(".blog-header");
  expect(blogHeader).toHaveTextContent("Test Blog Title");
  expect(blogHeader).toHaveTextContent("Test Author");

  // Check that the URL and likes are not rendered by default
  const blogDetails = container.querySelector(".blog-details");
  expect(blogDetails).toBeNull();
});

test("renders URL and number of likes when the button controlling the shown details is clicked", () => {
  const { container } = render(<Blog blog={blog} user={user} />);

  // Simulate clicking the button to show details
  const button = screen.getByText("view");
  fireEvent.click(button);

  // Check that the URL and likes are now displayed
  const blogDetails = container.querySelector(".blog-details");
  expect(blogDetails).toBeVisible();
  expect(blogDetails).toHaveTextContent("http://testurl.com");
  expect(blogDetails).toHaveTextContent("likes 5");
});

test("calls the event handler twice if the like button is clicked twice", async () => {
  const mockHandler = vi.fn();

  const { container } = render(
    <Blog blog={blog} user={user} updateBlog={mockHandler} />
  );

  // Simulate clicking the button to show details
  const viewButton = screen.getByText("view");
  fireEvent.click(viewButton);

  // Simulate clicking the like button twice
  const likeButton = screen.getByText("like");
  fireEvent.click(likeButton);
  fireEvent.click(likeButton);

  // Check that the mock handler was called twice
  expect(mockHandler.mock.calls).toHaveLength(2);
});
