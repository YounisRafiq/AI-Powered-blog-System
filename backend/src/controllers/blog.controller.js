const blogModel = require("../models/BlogPost.model");
const { getResponseFromGroq } = require("../services/aiService");

const generateBlog = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ message: "Prompt is required!" });
    }

    const content = await getResponseFromGroq(prompt);

    const blog = await blogModel.create({
      title: prompt,
      content: content,
      author: req.user._id
    });

    res.status(201).json({ message: "Blog created", blog });
  } catch (error) {
    res.status(500).json({ message: "Error generating blog", error: error.message });
  }
};

module.exports = { generateBlog }