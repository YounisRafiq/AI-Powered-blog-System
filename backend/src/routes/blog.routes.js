const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blog.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/generate" , authMiddleware.authMiddleware , blogController.generateBlog);
router.get("/chats" , authMiddleware.authMiddleware , blogController.getAllChats);
router.post("/new-chat" , authMiddleware.authMiddleware , blogController.getNewChat);
router.get("/chat/:id" , authMiddleware.authMiddleware , blogController.getSingleChat);
router.get("/:id" , authMiddleware.authMiddleware , blogController.blogProfile);
router.get("/" , blogController.getAllBlogs);
router.get("/delete/:id" , authMiddleware.authMiddleware ,  blogController.deleteBlog);
router.put("/update/:id" , authMiddleware.authMiddleware , blogController.updateBlog);


module.exports = router;