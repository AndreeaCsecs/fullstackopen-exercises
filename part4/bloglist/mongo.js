//mongo.js

const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const mongoUrl = `mongodb+srv://andreeacsecs:${password}@cluster0.nckmic0.mongodb.net/bloglistDB`;

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

if (process.argv.length === 3) {
  Blog.find({}).then((result) => {
    result.forEach((blog) => {
      console.log(blog);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 6) {
  const blog = new Blog({
    title: process.argv[3],
    author: process.argv[4],
    url: process.argv[5],
    likes: 0,
  });

  blog.save().then(() => {
    console.log("Blog saved!");
    mongoose.connection.close();
  });
}
