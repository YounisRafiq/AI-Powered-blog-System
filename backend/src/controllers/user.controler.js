const userModel = require("../models/user.model");

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

module.exports = getUserProfile;