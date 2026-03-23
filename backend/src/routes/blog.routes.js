const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blog.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/generate" , authMiddleware.authMiddleware , blogController.generateBlog);
router.get("/blogs", blogController.getAllBlogs)
module.exports = router;