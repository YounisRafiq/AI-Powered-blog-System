const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    prompt: {
        type: String,
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
    },
    isSystem : {
        type : Boolean,
        default : false
    }
}, { timestamps: true });

const Prompt = mongoose.model("Prompt", promptSchema);
module.exports = Prompt;