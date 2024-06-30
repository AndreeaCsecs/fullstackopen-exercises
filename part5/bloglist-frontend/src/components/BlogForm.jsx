// src/components/BlogForm.jsx

import { useState } from "react";
import blogService from "../services/blogs";

const BlogForm = ({ createBlog, notify }) => {
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" });

  const handleChange = ({ target }) => {
    setNewBlog({
      ...newBlog,
      [target.name]: target.value,
    });
  };

  const addBlog = async (event) => {
    event.preventDefault();
    try {
      const returnedBlog = await blogService.create(newBlog);
      createBlog(returnedBlog);
      setNewBlog({ title: "", author: "", url: "" });
      notify(
        `A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`
      );
    } catch (exception) {
      notify("Error adding blog");
    }
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            name="title"
            value={newBlog.title}
            onChange={handleChange}
            placeholder="Title"
          />
        </div>
        <div>
          author:
          <input
            name="author"
            value={newBlog.author}
            onChange={handleChange}
            placeholder="Author"
          />
        </div>
        <div>
          url:
          <input
            name="url"
            value={newBlog.url}
            onChange={handleChange}
            placeholder="URL"
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
