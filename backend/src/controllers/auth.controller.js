const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const storageService = require("../services/storageService");
const { verifyToken } = require("@clerk/backend");

const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const nameRegex = /^[A-Za-z\s]{3,}$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({
        message: "Invalid Full Name",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid Email",
      });
    }

    if (password.length < 5) {
      return res.status(400).json({
        message: "Password must be at least 5 characters long",
      });
    }

    const image = await storageService.uploadImageToCloudinary(req.file?.path);

    console.log("Cloudinary Response", image);

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      image: image?.secure_url || null,
    });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User Registered Successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email, password);

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Something Went Wrong!",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Email or Password is Invalid",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);

    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Login Successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const userLogout = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "Please Login First",
    });
  }

  res.clearCookie("token");
  res.status(200).json({
    message: "User SuccessFully LoggedOut",
  });
};


const clerkLogin = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    const clerkUserId = payload.sub;

    const user = await fetch(`https://api.clerk.com/v1/users/${clerkUserId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });

    const userData = await user.json();

    const email = userData.email_addresses[0].email_address;
    const name = userData.first_name + " " + userData.last_name;
    const image = userData.image_url;

    // 🔥 DB me save/update
    let existingUser = await userModel.findOne({ email });

    if (!existingUser) {
      existingUser = await userModel.create({
        name,
        email,
        image,
      });
    }

    // 🔐 JWT generate
    const myToken = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      token: myToken,
      user: existingUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  userRegister,
  userLogin,
  userLogout,
  clerkLogin,
};
