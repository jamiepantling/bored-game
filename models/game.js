const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const gameSchema = new Schema(
  {
    title: String,
    reviews: [String],
    description: String,
    gameAuthor: { type: Schema.Types.ObjectId, ref: "User" },
    tag: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  },
  {
    timestamps: true,
    strictPopulate: false
  },

);

module.exports = mongoose.model("Game", gameSchema);
