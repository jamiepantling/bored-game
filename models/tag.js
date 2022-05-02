const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tagSchema = new Schema(
  {
    content: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tag", tagSchema);
