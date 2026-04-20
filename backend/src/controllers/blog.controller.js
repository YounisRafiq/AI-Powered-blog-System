const blogModel = require("../models/BlogPost.model");
const promptModel = require("../models/prompt.model");
const keywordModel = require("../models/keyword.model");
const mongoose = require("mongoose");
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

    console.log(content);

    const blog = await blogModel.create({
      prompt: promptDoc._id,
      title: prompt,
      content: content,
      author: req.user._id,
    });


    const extractKeywords = (content) => {
      const words = content.toLowerCase().match(/\b\w+\b/g);

      const stopWords = ["i","me","my","myself","we","our","ours","ourselves","you","your","yours","yourself","yourselves","he","him","his","she","her","it","its","they","them","their","what","which","who","this","that","and","the","for","with","about","to","from","in","on","is","are","was","were","be","been","being","have","has","had","do","does","did","a","an","as","at","by","or","not","so","too","very"];

      const filtered = words.filter(
        (word) => !stopWords.includes(word) && word.length > 2
      );

      const freq = {};
      filtered.forEach((word) => {
        freq[word] = (freq[word] || 0) + 1;
      });

      const sorted = Object.keys(freq).sort((a, b) => freq[b] - freq[a]);

      return sorted.slice(0, 5);
    };

    const keywordsArray = extractKeywords(content);
    const keywordsIDs = [];

    for (let keyword of keywordsArray) {
      const existing = await keywordModel.findOne({ name: keyword });

      if (existing) {
        existing.posts.push(blog._id);
        existing.usageCount++;
        await existing.save();
        keywordsIDs.push(existing._id);
      } else {
        const newKeyword = await keywordModel.create({
          name: keyword,
          slug: keyword.toLowerCase().replace(/\s+/g, "-"),
          posts: [blog._id],
          usageCount: 1,
        });
        keywordsIDs.push(newKeyword._id);
      }
    }

    // 7. Save Keywords in Blog
    blog.keywords = keywordsIDs;
    await blog.save();

    // 8. Populate Blog
    const populatedBlog = await blogModel
      .findById(blog._id)
      .populate("keywords", "name");

    // 9. Link blog to prompt
    promptDoc.post = blog._id;
    await promptDoc.save();

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog: populatedBlog,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error generating blog",
      error: error.message,
    });
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

    const deletedBlog = await blogModel.deleteOne({_id : req.params.id});

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
      .find({ user: userId})
      .populate("post", "title")
      .sort({ createdAt: -1 });

    const formattedChats = chats.map((item) => ({
      _id: item._id,
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
    const chatId = new mongoose.Types.ObjectId();

    if(!chatId){
      return res.status(500).json({
        success : false,
        message : "Invalid Chat Id"
      })
    };

     res.status(201).json({
      success: true,
      chat: {
        _id: chatId,
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

const getSingleChat = async (req ,res) => {
  try {
    
   const userId = req.user.id;
   const chatId = req.params.id;

if(!mongoose.Types.ObjectId.isValid(chatId)){
  return res.status(400).json({
    success : false,
    message : "Invalid Chat Id"
  })
};



const chat = await promptModel.findOne({_id : chatId , user : userId}).populate("post" , "title content");

if(chat.user.toString() !== userId.toString()){
  return res.status(403).json({
    success : false,
    message : "Unauthorized Access to this chat"
  })
};

if(!chat){
  return res.status(404).json({
    success : false,
    message : "Chat Not Found"
  })
};

res.status(200).json({
  success : true,
  chat : {
    _id : chat._id,
    title : chat.post?.title || chat.prompt,
    content : chat.post?.content || "No Content Available in this chat yet.",
  }
})

  } catch (error) {
    res.status(500).json({
      success : false,
      message : "Failed to fetch chat details"
    });
  }
}





module.exports = {
  generateBlog,
  getAllBlogs,
  deleteBlog,
  updateBlog,
  getNewChat,
  getSingleChat,
  blogProfile,
  getAllChats,
};
