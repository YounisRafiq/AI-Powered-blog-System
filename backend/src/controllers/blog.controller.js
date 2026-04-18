const blogModel = require("../models/BlogPost.model");
const promptModel = require("../models/prompt.model");
const keywordModel = require("../models/keyword.model");
const { getResponseFromGroq } = require("../services/aiService");

const generateBlog = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ message: "Prompt is required!" });
    }

    const promptDoc = await promptModel.create({
      prompt: prompt,
      user: req.user._id,
    });

    const content = await getResponseFromGroq(prompt);

    const blog = await blogModel.create({
      prompt: promptDoc._id,
      title: prompt,
      content: content,
      author: req.user._id,
    });

    const extractKeywords = (content) => {
      const words = content.toLowerCase().match(/\b\w+\b/g);
      const stopWords = [
        "i",
        "me",
        "my",
        "myself",
        "we",
        "our",
        "ours",
        "ourselves",
        "you",
        "your",
        "yours",
        "yourself",
        "yourselves",
        "he",
        "him",
        "his",
        "himself",
        "she",
        "her",
        "hers",
        "herself",
        "it",
        "its",
        "itself",
        "they",
        "them",
        "their",
        "theirs",
        "themselves",
        "what",
        "which",
        "who",
        "whom",
        "this",
        "that",
        "these",
        "those",
        "am",
        "is",
        "are",
        "was",
        "were",
        "be",
        "been",
        "being",
        "have",
        "has",
        "had",
        "having",
        "do",
        "does",
        "did",
        "doing",
        "a",
        "an",
        "the",
        "and",
        "but",
        "if",
        "or",
        "because",
        "as",
        "until",
        "while",
        "of",
        "at",
        "by",
        "for",
        "with",
        "about",
        "against",
        "between",
        "into",
        "through",
        "during",
        "before",
        "after",
        "above",
        "below",
        "to",
        "from",
        "up",
        "down",
        "in",
        "out",
        "on",
        "off",
        "over",
        "under",
        "again",
        "further",
        "then",
        "once",
        "here",
        "there",
        "when",
        "where",
        "why",
        "how",
        "all",
        "any",
        "both",
        "each",
        "few",
        "more",
        "most",
        "other",
        "some",
        "such",
        "no",
        "nor",
        "not",
        "only",
        "own",
        "same",
        "so",
        "than",
        "too",
        "very",
        "s",
        "t",
        "can",
        "will",
        "just",
        "don",
        "should",
        "now",
        "including",
      ];
      const filtered = words.filter(
        (word) => !stopWords.includes(word) && word.length > 2,
      );
      const freq = {};
      filtered.forEach((word) => (freq[word] = (freq[word] || 0) + 1));
      const sorted = Object.keys(freq).sort((a, b) => freq[b] - freq[a]);
      return sorted.slice(0, 5);
    };

    const keywordsArray = extractKeywords(content);
    const keywordsIDs = [];

    for (let keyword of keywordsArray) {
      const createdKeyword = await keywordModel.findOne({ name: keyword });

      if (createdKeyword) {
        createdKeyword.posts.push(blog._id);
        createdKeyword.usageCount++;
        await createdKeyword.save();
        keywordsIDs.push(createdKeyword._id);
      }

      if (!createdKeyword) {
        const newKeyword = await keywordModel.create({
          name: keyword,
          slug: keyword.toLowerCase().replace(/\s+/g, "-"),
          posts: [blog._id],
          usageCount: 1,
        });
        keywordsIDs.push(newKeyword._id);
      }
    }

    blog.keywords = keywordsIDs;
    await blog.save();

    const populatedBlog = await blogModel
      .findById(blog._id)
      .populate("keywords", "name");

    promptDoc.post = blog._id;
    await promptDoc.save();

    res.status(201).json({ message: "Blog created", blog: populatedBlog });
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

const blogProfile = async (req, res) => {
  try {
    const blog = await blogModel
      .findById(req.params.id)
      .populate("author", "fullName email");

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.status(200).json({
      message: "Blog Profile Fetched SuccessFully",
      blog,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching blog profile",
      error: error.message,
    });
  }
};

const getAllChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await promptModel
      .find({ user: userId , isSystem : false })
      .populate("post", "title")
      .sort({ createdAt: -1 });

    const formattedChats = chats.map((item) => ({
      id: item._id,
      title: item.post?.title || item.prompt,
      createdAt: item.createdAt,
    }));

    res.status(200).json({
      success: true,
      chats: formattedChats,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chats",
    });
  }
};

const getNewChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const newChat = promptModel.create({
      prompt: "New-Chat",
      user: userId,
      isSystem: true,
    });

    res.status(201).json({
      success: true,
      chat: {
        _id: newChat._id,
        title: "New Chat",
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to create new chat",
    });
  }
};

module.exports = {
  generateBlog,
  getAllBlogs,
  getSingleBlog,
  deleteBlog,
  updateBlog,
  getNewChat,
  blogProfile,
  getAllChats,
};
