const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  fullName : {
    tye : String,
    requried : true
  },
  email : {
    tye : String,
    requried : true,
    unique : true,
    lowercase : true
  },
  password : {
    tye : String,
    requried : true,
    min : 5
  },
  gender : {
    type : String,
    enum : ["Male" , "Female" , "Other"]
  },
  role : {
    type : String,
    default : "guest"
  }
} , {timestamps : true});

const User = mongoose.model("User" , userSchema);
module.exports = User;