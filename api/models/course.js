const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  disc: String,
  date: Date,
  tag: String,
  fees: Number
});

module.exports = mongoose.model("Course", courseSchema);
