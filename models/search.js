const mongoose = require("mongoose");

// SCHEMA
let searchSchema = mongoose.Schema({
  source: {
    id: String,
    name: String
  },
  author: String,
  title: String,
  description: String,
  url: String,
  urlToImage: String,
  publishedAt: { type: Date },
  content: String
});

// MODEL
module.exports = mongoose.model("Search", searchSchema);