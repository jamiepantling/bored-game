const { redirect } = require("express/lib/response");
let Game = require("../models/game");
let Tag = require("../models/tag");
const user = require("../models/user");
let User = require("../models/user");

module.exports = {
  index,
  new: newGame,
  create,
  show,
  addTag,
};

function index(req, res) {
  console.log("res.locals:" + res.locals.user);
  console.log("Games controller index function");
  Game.find({})
    .populate("tag")
    .then(function (games) {
      res.render("games/index", {
        games,
        title: "All games",
      });
    });
}

function newGame(req, res) {
  console.log("Games controller newGame function");
  return Tag.find({}).then(function (tags) {
    console.log(tags);
    res.render("games/new", { title: "Add new game", tags });
  });
}

function create(req, res) {
  console.log(req.body);
  console.log("res.locals:" + res.locals.user);
  let gameBody = { title: req.body.title, description: req.body.description, gameAuthor: res.locals.user._id, gameAuthorName: res.locals.user.name };
  const game = new Game(gameBody);
  Tag.findOne({ _id: req.body.tag }).then(function (tag) {
    game.tag.push(tag._id);
    game.save(function (err) {
      if (err) {
        console.log(err);
        res.redirect("games/new");
      }
      console.log(game)
      res.redirect("/games");
    });
  });
}

async function show(req, res) {
  let game = await Game.findById(req.params.id).populate("tag");
  console.log(game);
  let tags = await Tag.find({});
  console.log(game.reviews, req.user.id)
  res.render("games/show", { game, title: "Game details", tags, user: req.user });
}

async function addTag(req, res) {
  let game = await Game.findById(req.params.gameId);
  let newTag = await Tag.findById(req.params.tagId);
  console.log(game, newTag);
  let isInArray = game.tag.some(function (tag) {
    return tag.equals(newTag._id);
  });
  if (isInArray) {
    let index = game.tag.indexOf(newTag._id);
    game.tag.splice(index, 1);
    await game.save();
    return res.redirect(`/games/${req.params.gameId}`);
  }
  await game.tag.push(newTag._id);
  await game.save();
  console.log(game);
  res.redirect(`/games/${req.params.gameId}`);
}
