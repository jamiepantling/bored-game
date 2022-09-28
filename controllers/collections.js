const { redirect } = require("express/lib/response");
const request = require("request-promise");
const User = require("../models/user");
const Game = require("../models/game");
const gamesCtrl = require("./games");

const clientId = process.env.ATLAS_CLIENT_ID;

module.exports = {
  new: newCollection,
  create,
  show,
  delete: deleteOne,
  update,
};
function newCollection(req, res) {
  if (!req.user) return res.redirect("/");
  res.render("collections/new", { title: "Add new collection" });
}

async function create(req, res) {
  if (!req.user) return res.redirect("/");
  let user = await User.findById(req.user.id);
  let collection = {
    title: req.body.title,
  };
  user.collections.push(collection);
  await user.save();
  res.redirect(`/users/${user._id}`);
}

async function show(req, res) {
  if (!req.user || req.user.id != req.params.userId) return res.redirect("/");

  //Get the user that the collection belongs to, and populate the collection and games
  let user = await User.findById(req.params.userId).populate({
    path: "collections",
    populate: {
      path: "games"
    },
  });
  //Put the specific collection in a variable using the params
  let collection = user.collections.id(req.params.collectionId);
  //Collect the Ids from the games in the collection for comparison
  let collectionIds = [];
  for (let i = 0; i < collection.games.length; i++) {
    collectionIds.push(collection.games[i]._id);
  }
  //Get all the games in the library
  let allGames = await Game.find({});
  gamesCtrl.gameSort(allGames);
  // Compare the ID of each game in the library 
  // to see if it matches the ID of a game in the collection
  // If not, save to the array "uncollectedGames" for the Add Game dropdown
  let uncollectedGames = [];
  for (let i = 0; i < allGames.length; i++) {
    if (
      !collection.games.some((collectedGame) =>
        collectedGame.equals(allGames[i]._id)
      )
    )
      uncollectedGames.push(allGames[i]);
  }

  res.render("collections/show", {
    title: `${collection.title}`,
    collection,
    uncollectedGames,
    allGames,
  });
}

async function deleteOne(req, res) {
  if (!req.user) return res.redirect("/");
  let user = await User.findOne({ "collections._id": req.params.id });
  if (req.user.id != user._id) return res.redirect("/");
  index = user.collections.findIndex(
    (collection) => collection._id == req.params.id
  );
  user.collections[index].remove();
  await user.save();
  res.redirect(`/users/${user._id}`);
}

async function update(req, res) {
  let user = await User.findById(req.params.userId);
  let collection = user.collections.id(req.params.collectionId);
  let game = await Game.findById(req.body.game);
  collection.games.push(game);
  await user.save();
  res.redirect(
    `/users/${req.params.userId}/collections/${req.params.collectionId}`
  );
}
