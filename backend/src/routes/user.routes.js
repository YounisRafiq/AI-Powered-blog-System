const express = require("express");
const router = express.Router();
const { getUserProfile , updateProfile } = require("../controllers/user.controler");
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/multer.middleware");

router.get("/profile", authMiddleware.authMiddleware, getUserProfile);
router.patch("/profile", upload.single("image") , authMiddleware.authMiddleware, updateProfile);

module.exports = router;
