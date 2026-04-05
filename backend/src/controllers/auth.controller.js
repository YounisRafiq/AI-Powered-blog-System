const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const storageService = require("../services/storageService");


const userRegister = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const nameRegex = /^[A-Za-z\s]{3,}$/;
    if (!nameRegex.test(fullName)) {
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

   if(password.length < 5){
    return res.status(400).json({
        message : "Password must be at least 5 characters long"
    })
   } 

   const imageUrl = await storageService.uploadImageToCloudinary(req.file?.path);

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
      imageUrl: imageUrl || null,
    });

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET_KEY,
    );

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
        fullName: user.fullName,
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

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Email NOT Found! Please Sign Up first"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Email or Password is Invalid"
      });
    }

    const token = jwt.sign(
      { _id: user._id},
      process.env.JWT_SECRET_KEY,
    );

    res.cookie("token" , token , {
      secure : false,
      maxAge : 7 * 24 * 60 * 60 * 1000,
      httpOnly : true,
      sameSite : "strict"
    });

    res.status(200).json({
      message: "Login Successful",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

const userLogout = async (req ,res) => {
 
  const token = req.cookies.token;
  if(!token){
    return res.status(401).json({
      message : "Please Login First",
    })
  }

  res.clearCookie("token");
  res.status(200).json({
    message : "User SuccessFully LoggedOut",
  })
}


module.exports = {
  userRegister,
  userLogin,
  userLogout
};
