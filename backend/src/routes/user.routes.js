const express = require("express");
const router = express.Router();
const userProfile = require("../controllers/user.controler");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/me" , authMiddleware.authMiddleware , userProfile);

module.exports = router;