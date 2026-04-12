const userModel = require("../models/user.model");
const storageService = require("../services/storageService");

const getUserProfile = async (req , res) => {
   try {
    const user = await userModel.findById(req.user._id);
   if(!user){
    res.status(404).json({
        success : false,
        message : "User NOT Found"
    })
   };

   res.status(200).json({
     user : {
        _id : user._id,
        name : user.name,
        email : user.email,
        image : user.image
     }
   })

   } catch (error) {
     res.status(500).json({
        success : false,
        message : "Internal Error Occur"
     })
   }
};

const updateProfile = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Name cannot be empty",
      });
    }

    const userId = req.user.id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    user.name = name;

    if (password && password.trim() !== "") {
      const bcrypt = require("bcrypt");
      user.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      const result = await storageService.uploadImageToCloudinary(req.file.path);
      user.image = result.secure_url;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
   getUserProfile,
   updateProfile
};