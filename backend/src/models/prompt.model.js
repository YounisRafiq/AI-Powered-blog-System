const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    prompttext : {
        type : String,
        required : true
    },
    Post : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Blog"
    },

} , {timestamps : true});

const Prompt = mongoose.model("Prompt" , promptSchema);
module.exports = Prompt;