const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"]
  },
  role: {
    type: String,
    default: "guest"
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;