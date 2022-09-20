const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: String,
    email: String,
    googleId: String,
    picture: String
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
