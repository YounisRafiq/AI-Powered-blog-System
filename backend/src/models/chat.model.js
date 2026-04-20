const mongoose = require("mongoose");

const chatModel = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    title : {
        type : String,
        required : true
    },
} , {timestamps : true});

const Chat = mongoose.model("Chat" , chatModel);
module.exports = Chat;

