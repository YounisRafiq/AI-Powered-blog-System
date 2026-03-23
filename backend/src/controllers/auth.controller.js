const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRegister = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    console.log(req.body);
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
    });

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET_KEY,
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
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
