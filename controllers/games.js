const { redirect } = require("express/lib/response");
let Game = require("../models/game");
let Tag = require("../models/tag");
let User = require("../models/user")
let Review = require("../models/review")

module.exports = {
  index,
  new: newGame,
  create,
  show,
};

function index(req, res) {
  console.log("Games controller index function");
  Game.find({}).then(function (games) {
    res.render("games/index", {
      games: games,
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
  let gameBody = { title: req.body.title, description: req.body.description };
  const game = new Game(gameBody);
  Tag.findOne({ id: req.body.tag }).then(function (tag) {
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

function show(req, res) {
  Game.findById(req.params.id, function (err, game) {
    console.log(game);
    res.render("games/show", { game, title: "Game details" });
  });
}
