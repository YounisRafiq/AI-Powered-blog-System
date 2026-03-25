const blogModel = require("../models/BlogPost.model");
const promptModel = require("../models/prompt.model");
const { getResponseFromGroq } = require("../services/aiService");

const generateBlog = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ message: "Prompt is required!" });
    }

   const promptDoc = await promptModel.create({
     prompt : prompt,
     user : req.user._id
   });

    const content = await getResponseFromGroq(prompt);

    const blog = await blogModel.create({
      prompt : promptDoc._id,
      title: prompt,
      content: content,
      author: req.user._id,
    });

    promptDoc.post = blog._id;
    await promptDoc.save();

    res.status(201).json({ message: "Blog created", blog });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating blog", error: error.message });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await blogModel.find().populate("author", "fullName email");
    res.status(200).json({
      success: true,
      totalBlogs: blogs.length,
      blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSingleBlog = async (req, res) => {
  const singleBlog = await blogModel.findById(req.params.id);

  try {
    if (!singleBlog) {
      return res.status(404).json({
        message: "Error while fetching single blog",
      });
    }

    res.status(200).json({
      message: "Blog Fetched SuccessFully",
      singleBlog,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const deleteBlog = async (req, res) => {
  const blog = await blogModel.findById(req.params.id);

  try {
    if (!blog) {
      return res.status(401).json({
        success: false,
        message: "Blog NOT found",
      });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "NOT Authorized" });
    }

    const deletedBlog = await blogModel.deleteOne();

    res.status(201).json({
      message: "Blog Deleted SuccessFully",
      deletedBlog,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error happen while deleting the blog",
      error: error.message,
    });
  }
};

const updateBlog = async (req, res) => {
  const { title, content } = req.body;

  const blog = await blogModel.findById(req.params.id);

  try {
    if (!blog) {
      return res.status(401).json({
        message: "Blog NOT found",
      });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "NOT Authorized" });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;

    await blog.save();

    res.status(201).json({
      message: "Blog Updated SuccessFully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happen while updating the blog",
      error: error.message,
    });
  }
};
module.exports = {
  generateBlog,
  getAllBlogs,
  getSingleBlog,
  deleteBlog,
  updateBlog,
};
