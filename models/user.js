const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const collectionSchema = new Schema(
  {
    title: String,
    games: [{ type: Schema.Types.ObjectId, ref: "Game" }],
  },
  {
    timestamps: true,
  }
);

const userSchema = new Schema(
  {
    name: String,
    email: String,
    googleId: String,
    picture: String,
    collections: [collectionSchema]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
