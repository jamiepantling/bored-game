const { redirect } = require("express/lib/response");
const request = require("request-promise");
const User = require("../models/user");
const Game = require("../models/game");
const gamesCtrl = require("./games");
let Tag = require("../models/tag");
const game = require("../models/game");

const clientId = process.env.ATLAS_CLIENT_ID;

module.exports = {
  new: newCollection,
  create,
  show,
  delete: deleteOne,
  update,
  showTag,
};
function newCollection(req, res) {
  if (!req.user) return res.redirect("/games");
  res.render("collections/new", { title: "Add new collection" });
}

async function create(req, res) {
  if (!req.user) return res.redirect("/games");
  let user = await User.findById(req.user.id);
  let collection = {
    title: req.body.title,
  };
  user.collections.push(collection);
  await user.save();
  user = await User.findById(req.user.id);
  res.redirect(
    `/users/${user._id}/collections/${
      user.collections[user.collections.length - 1]._id
    }`
  );
}

async function show(req, res) {
  if (!req.user || (req.user.id != req.params.userId && !user.admin))
    return res.redirect("/games");

  //Get the user that the collection belongs to, and populate the collection and games
  let user = await User.findById(req.params.userId).populate({
    path: "collections",
    populate: {
      path: "games",
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
  let collectedGames = collection.games;
  gamesCtrl.gameSort(collectedGames);

  //Get all tags
  let allTags = await Tag.find({});
  //Sort tags alphabetically
  allTags = gamesCtrl.tagSort(allTags);

  //

  res.render("collections/show", {
    title: `${collection.title}`,
    collectedGames,
    uncollectedGames,
    allGames,
    collection,
    allTags,
  });
}

async function deleteOne(req, res) {
  if (!req.user) return res.redirect("/games");
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
  if (!req.user) return res.redirect("/games");
  let user = await User.findById(req.params.userId);
  let collection = user.collections.id(req.params.collectionId);
  let game = await Game.findById(req.body.game);
  //If the game in the request is not in the collection already, add it
  if (!collection.games.includes(game._id)) {
    collection.games.push(game);
  } else {
    //Otherwise, remove it
    let idx = collection.games.indexOf(game._id);
    collection.games.splice(idx, 1);
  }
  await user.save();
  res.redirect(
    `/users/${req.params.userId}/collections/${req.params.collectionId}`
  );
}

async function showTag(req, res) {
  if (!req.user) return res.redirect("/games");
  let user = await User.findById(req.params.userId).populate({
    path: "collections",
    populate: {
      path: "games",
    },
  });
  let collection = user.collections.id(req.params.collectionId)
  let tag = await Tag.findById(req.params.tagId);
  let allTags = await Tag.find({});

  let taggedGames = await Game.find({
    tag: { $elemMatch: { $eq: req.params.tagId } },
  }).populate("tag");
  console.log("tag id: ", req.params.tagId)
  console.log(collection.games[0])  
  let taggedGamesInCollection = collection.games.filter((collectedGame) =>
    collectedGame.tag.some((tag) => tag.equals(req.params.tagId))
  );
  res.render("collections/showTag", {
    title: `${collection.title}`,
    user,
    collection,
    tag,

    allTags,
    taggedGamesInCollection
  });
}
