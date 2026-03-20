const mongoose = require("mongoose");

const keywordSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Keyword = mongoose.model("Keyword", keywordSchema);
module.exports = Keyword;