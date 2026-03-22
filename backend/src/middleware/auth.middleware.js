const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const authMiddleware = async (req , res , next) => {
   try {
    
   const token = req.cookies?.token;
   if(!token){
    return res.status(404).json({
        message : "Token NOT Found ! Please LogIn First"
    });
   };

   const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY);
   const user = await userModel.findById(decoded._id);

   if(!user){
    return res.status(404).json({
        message : "User NOT Found"
    })
   };

   req.user = user;

   next();
   } catch (error) {
    return res.status(401).json({
        message : "Invalid Token",
        error : error.message
    })
   }
};

module.exports = { authMiddleware };