//list_helper.js from the utils folder

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const likesArray = blogs.map((blog) => blog.likes);
  const total = likesArray.reduce((sum, likes) => sum + likes, 0);
  return total;
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;

  const maxLikesBlog = blogs.reduce((prev, current) =>
    prev.likes > current.likes ? prev : current
  );

  return {
    title: maxLikesBlog.title,
    author: maxLikesBlog.author,
    likes: maxLikesBlog.likes,
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const authorCounts = blogs.reduce((counts, blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + 1;
    return counts;
  }, {});

  const topAuthor = Object.entries(authorCounts).reduce(
    (prev, [author, count]) => (count > prev.count ? { author, count } : prev),
    { author: null, count: -Infinity }
  );

  return {
    author: topAuthor.author,
    blogs: topAuthor.count,
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  const likesByAuthor = blogs.reduce((likes, blog) => {
    likes[blog.author] = (likes[blog.author] || 0) + blog.likes;
    return likes;
  }, {});

  const topAuthor = Object.entries(likesByAuthor).reduce(
    (prev, [author, totalLikes]) =>
      totalLikes > prev.totalLikes ? { author, totalLikes } : prev,
    { author: null, totalLikes: -Infinity }
  );

  return {
    author: topAuthor.author,
    likes: topAuthor.totalLikes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
