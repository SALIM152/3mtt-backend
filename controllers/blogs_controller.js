const Blog = require("../model/blog");
const User = require("../model/user");
const logger = require("../logging/logger");

function wordsCount(text) {
  return Number(String(text).split(" ").length);
}

const createBlog = async (req, res) => {
  if (!req?.body?.title || !req?.body?.body)
    return res.status(400).json({ message: "Title and Body are required" });

  if (!req?.body?.author)
    return res.status(400).json({ message: "Author id is required" });

  const duplicateTitle = await Blog.findOne({ title: req.body.title }).exec();

  if (duplicateTitle)
    return res.status(401).json({ message: "Title already exists" });

  const blog = await Blog.create({
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
    body: req.body.body,
    reading_time:
      (wordsCount(req.body.title) +
        wordsCount(req.body.description) +
        wordsCount(req.body.body)) /
      200,
    tags: req.body.tags,
  });

  logger.info(blog);
  res.json({ blog });
};

const getPublishedBlogById = async (req, res) => {
  const id = req.params.id;
  const foundBlog = await Blog.findOne({ _id: id, state: "published" });

  if (!foundBlog) return res.status(404).json({ message: "Blog not found" });

  ++foundBlog.read_count;
  const updatedFoundBlog = await foundBlog.save();

  const blogAuthor = await User.findById(foundBlog.author);

  res.json({ blogAuthor: blogAuthor, updatedFoundBlog });
};

const getAllPublishedBlogs = async (req, res) => {
  const publishedBlogs = await Blog.find({ state: "published" });
  res.json({ publishedBlogs });
};

const updateState = async (req, res) => {
  const id = req.params.id;
  const updatedBlog = await Blog.findByIdAndUpdate(id, { state: "published" });
  res.json({ updatedBlog });
};

const editBlogById = async (req, res) => {
  const id = req.params.id;
  const blog = req.body;

  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true });

  res.json({ updatedBlog });
};

const deleteBlogById = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    res.json({ deletedBlog });
  } catch (err) {
    logger.error(err);
  }
};

const getAllOwnersBlogsById = async (req, res) => {
  const id = req.params.id;
  const ownersBlogs = await Blog.find({ id });

  res.json({ ownersBlogs });
};

module.exports = {
  createBlog,
  getPublishedBlogById,
  getAllPublishedBlogs,
  updateState,
  editBlogById,
  deleteBlogById,
  getAllOwnersBlogsById,
};
