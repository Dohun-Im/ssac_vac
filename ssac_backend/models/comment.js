const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  commentWriter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  parentPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
  },
  commentContent: { type: String, required: true },
  commentDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("comment", commentSchema);
