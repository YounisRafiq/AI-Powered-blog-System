const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    content : {
        type : String,
        required : true
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category"
    },
    keyword : {
        type : String,
        default : "General"
    },
    status : {
        type : String,
        default : "InProgress"
    }
} , {timestamps : true});

const Blog = mongoose.model("Blog" , blogSchema);
module.exports = Blog;