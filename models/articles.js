const mongoose = require("mongoose");

// SCHEMA
let articleSchema = mongoose.Schema({
  source: {
    id: String,
    name: String
  },
  author: String,
  title: String,
  description: String,
  url: String,
  urlToImage: String,
  publishedAt: String,
  content: String
});

// MODEL
module.exports = mongoose.model("Articles", articleSchema);