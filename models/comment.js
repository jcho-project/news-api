const mongoose = require("mongoose");

// SCHEMA
let commentSchema = mongoose.Schema({
  text: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  }
});

// MODEL
module.exports = mongoose.model("Comment", commentSchema);