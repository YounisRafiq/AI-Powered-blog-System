const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const upload = require("../middleware/multer.middleware");

router.post("/user/register", upload.single("image"), authController.userRegister);
router.post("/user/login" , authController.userLogin);
router.get("/user/logout" , authController.userLogout);
router.post("/clerk-login", authController.clerkLogin);


module.exports = router;