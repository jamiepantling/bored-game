const res = require("express/lib/response");
const { redirect } = require("express/lib/response");
let Game = require("../models/game");
const user = require("../models/user");
let User = require("../models/user");

module.exports = {
  create,
  delete: deleteOne,
  show
};

async function create(req, res) {
  let game = await Game.findById(req.params.id);
  let review = {
    content: req.body.content,
    reviewAuthor: req.user._id,
    reviewAuthorName: req.user.name,
  };
  game.reviews.push(review);
  await game.save();
  res.redirect(`/games/${game._id}`);
}

async function deleteOne(req, res) {
  let game = await Game.findOne({ "reviews._id": req.params.id });
  index = game.reviews.findIndex((review) => review._id == req.params.id);
  game.reviews[index].remove();
  await game.save();
  res.redirect(`/games/${game._id}`);
}

async function show(req, res) {
let game = await Game.findById(req.params.gameId)
let review = game.reviews.id(req.params.reviewId)
res.render("reviews/show", {title: "Edit review", game, review})
}