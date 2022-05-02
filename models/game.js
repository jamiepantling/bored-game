const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  content: String,
  rating: {type: Number, min: 1, max: 5, default: 5},
  reviewAuthor: [{ type: Schema.Types.ObjectId, ref: "reviewAuthor" }]
}, {
  timestamps: true
});

const gameSchema = new Schema(
  {
    title: String,
    reviews: [String],
    description: String,
    gameAuthor: { type: Schema.Types.ObjectId, ref: "User" },
    tag: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    reviews: [reviewSchema]
  },
  {
    timestamps: true,
    strictPopulate: false
  },

);

module.exports = mongoose.model("Game", gameSchema);
