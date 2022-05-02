const { redirect } = require("express/lib/response");
let Game = require("../models/game");
let Tag = require("../models/tag");
let User = require("../models/user");

module.exports = {
  index,
  new: newGame,
  create,
  show,
  addTag,
};

function index(req, res) {
  console.log("Games controller index function");
  Game.find({})
    .populate("tag")
    .then(function (games) {
      games.forEach(function (game) {});
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
  let gameBody = { title: req.body.title, description: req.body.description };
  const game = new Game(gameBody);
  Tag.findOne({ _id: req.body.tag }).then(function (tag) {
    game.tag.push(tag._id);
    game.save(function (err) {
      if (err) {
        console.log(err);
        res.redirect("games/new");
      }
      res.redirect("/games");
    });
  });
}

async function show(req, res) {
   let game = await Game.findById(req.params.id).populate("tag")
  console.log(game);
  let tags = await Tag.find({})
  res.render("games/show", { game, title: "Game details", tags });
  }

async function addTag(req, res) {
  let game = await Game.findById(req.params.gameId);
  let newTag = await Tag.findById(req.params.tagId);
  console.log(game, newTag);
  if (game.tag) {
    await game.tag.push(newTag._id);
  } else {
    game.tag = [newTag._id];
  }
  await game.save();
  console.log(game);
  res.redirect(`/games/${req.params.gameId}`);
}
