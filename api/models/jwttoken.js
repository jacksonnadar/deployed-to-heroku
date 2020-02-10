const mongoose = require("mongoose");

const jwtTokenSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  jwt: { type: String, require: true },
  name: { type: String, require: true },
  token: { type: String, require: true },
  date: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("JwtTokenSchema", jwtTokenSchema);
