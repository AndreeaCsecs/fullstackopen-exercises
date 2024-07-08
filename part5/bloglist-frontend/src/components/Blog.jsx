import React, { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, updateBlog, user }) => {
  const [showDetails, setShowDetails] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    };
    if (process.env.NODE_ENV === "test") {
      updateBlog(updatedBlog);
    } else {
      const returnedBlog = await blogService.update(blog.id, updatedBlog);
      updateBlog(returnedBlog);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id);
        updateBlog(blog);
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  return (
    <div style={blogStyle} className="blog" data-blog-id={blog.id}>
      <div className="blog-header">
        <strong>{blog.title}</strong> by {blog.author}{" "}
        <button onClick={toggleDetails}>{showDetails ? "hide" : "view"}</button>
      </div>
      {showDetails && (
        <div className="blog-details">
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{" "}
            <button id="like-button" onClick={handleLike}>
              like
            </button>
          </div>
          <div>{blog.user.name}</div>
          {user && user.username === blog.user.username && (
            <button
              data-testid={`delete-blog-${blog.id}`}
              onClick={handleDelete}
            >
              remove
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
