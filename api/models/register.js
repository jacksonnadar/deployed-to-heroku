const mongoose = require("mongoose");

const registerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, require: true, min: 6, max: 30 },
  email: { type: String, require: true, max: 255 },
  password: { type: String, require: true, min: 6, max: 255 },
  date: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("Register", registerSchema);
