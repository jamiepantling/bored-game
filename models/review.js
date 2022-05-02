const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    content: String,
    reviewAuthor: [{ type: Schema.Types.ObjectId, ref: "reviewAuthor" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", reviewSchema);
