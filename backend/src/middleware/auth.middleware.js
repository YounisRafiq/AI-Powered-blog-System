const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log("Token", token);

    if (!token) {
      return res.status(401).json({
        message: "Token NOT Found! Please LogIn First",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded", decoded);

    const user = await userModel.findById(decoded._id).select("-password");
    console.log("userId", user);

    if (!user) {
      return res.status(404).json({
        message: "User NOT Found",
      });
    }

    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or Expired Token",
    });
  }
};

module.exports = { authMiddleware };