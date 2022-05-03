const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  content: String,
  rating: {type: String, default: "🎲🎲🎲"},
  reviewAuthor: { type: Schema.Types.ObjectId, ref: "reviewAuthor" },
  reviewAuthorName: String
}, {
  timestamps: true
});

const gameSchema = new Schema(
  {
    title: String,
    reviews: [String],
    description: String,
    gameAuthor: { type: Schema.Types.ObjectId, ref: "gameAuthor" },
    gameAuthorName: String,
    tag: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    reviews: [reviewSchema]
  },
  {
    timestamps: true,
    strictPopulate: false
  },

);

module.exports = mongoose.model("Game", gameSchema);
