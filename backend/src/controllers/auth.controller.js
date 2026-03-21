const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRegister = async (req, res) => {
  const { fullName, email, password, role } = req.body;

   const existingUser = await userModel.findOne({ email })

   if(existingUser){
    return res.status(401).json({
      message : "User Already exist with this email"
    })
   }

  if (fullName === "" || email === "" || password === "" || role === "") {
    return res.status(401).json({
      message: "All Fields are required",
    });
  }

  const hashedPassword = await bcrypt.hash(password , 10);
  const user = await userModel.create({
    fullName,
    password : hashedPassword,
    email,
    role
  });


  if(!user){
    return res.status(404).json({
        message : "User NOT Found"
    })
  }
  
    const token = jwt.sign(
    { id : user._id },
    process.env.JWT_SECRET_KEY
   );

   if(!token){
    return res.status(404).json({
      message : "Token NOT Found"
    })
   };

   res.cookie("token" , token);
  
  res.status(200).json({
    message : "User Registered SuccessFully",
    user : {
      fullName,
      email,
      hashedPassword,
      role
    }
  })

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
      { id: user._id},
      process.env.JWT_SECRET_KEY,
    );

    res.cookie("token" , token);

    res.status(200).json({
      message: "Login Successful",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
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
