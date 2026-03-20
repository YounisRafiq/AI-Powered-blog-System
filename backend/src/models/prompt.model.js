const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    promptText: {
        type: String,
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: true
    }
}, { timestamps: true });

const Prompt = mongoose.model("Prompt", promptSchema);
module.exports = Prompt;