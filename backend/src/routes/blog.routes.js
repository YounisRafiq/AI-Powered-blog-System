const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blog.controller");

router.post("/generate" , blogController.generateResponse);
module.exports = router;