const res = require("express/lib/response");
const { redirect } = require("express/lib/response");
const { update } = require("../models/game");
let Game = require("../models/game");
const user = require("../models/user");
let User = require("../models/user");

module.exports = {
  create,
  delete: deleteOne,
  show,
  update: updateOne,
};

async function create(req, res) {
  let game = await Game.findById(req.params.id);
  if (!req.user) return res.redirect(`/games/${game._id}`);
  let review = {
    content: req.body.content,
    reviewAuthor: req.user._id,
    reviewAuthorName: req.user.name,
    rating: req.body.rating
  };
  game.reviews.push(review);
  await game.save();
  res.redirect(`/games/${game._id}`);
}

async function deleteOne(req, res) {
  let game = await Game.findOne({ "reviews._id": req.params.id });
  if (!req.user) return res.redirect(`/games/${game._id}`);
  index = game.reviews.findIndex((review) => review._id == req.params.id);
  game.reviews[index].remove();
  await game.save();
  res.redirect(`/games/${game._id}`);
}

async function show(req, res) {
  let game = await Game.findById(req.params.gameId);
  if (!req.user) return res.redirect(`/games/${game._id}`);
  let review = game.reviews.id(req.params.reviewId);
  let user = await User.findById(req.user.id)
  if (req.user.id != review.reviewAuthor && !user.admin) {
    return res.redirect(`/games/${game._id}`);
  }
  res.render("reviews/show", { title: "Edit review", game, review });
}

async function updateOne(req, res) {
  let game = await Game.findById(req.params.gameId);
  let review = game.reviews.id(req.params.reviewId);
  if (!req.user) return res.redirect("/");
  if (review.reviewAuthor != req.user.id) return redirect(`/games/${game._id}`);
  review.content = req.body.content;
  review.rating = req.body.rating;
  await game.save();
  res.redirect(`/games/${game._id}`);
}
