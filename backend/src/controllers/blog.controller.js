const blogModel = require("../models/BlogPost.model");
const { getResponseFromGroq } = require("../services/aiService");

const generateBlog = async (req , res) => {
    
  try {
    
   const { prompt , category } = req.body;

  if(!prompt || category){
    return res.status(401).json({
        message : "Prompt & Category are required"
    })
  };

  const AIcontent = getResponseFromGroq(prompt);

  const blog = await blogModel.create({
    title : prompt.substring(0 , 50),
    content : AIcontent,
    author : req.user?._id
  });

  res.status(201).json({
    message : "Blog Created Successfully",
    blog
  })

  } catch (error) {
    res.status(500).json({
        message : "Error happen while generating the blog",
        error : error.message
    })
  }

};

module.exports = { generateBlog }