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

async function newGame(req, res) {
  console.log("Games controller newGame function");
  let tags = await Tag.find({})
  tags = tags.sort(function(a,b) {
    let x = a.content.toLowerCase()
    let y = b.content.toLowerCase()
    if (x<y) {return -1}
    if (x>y) {return 1}
    return 0  })
  console.log(tags);
    res.render("games/new", { title: "Add new game", tags });
}

async function create(req, res) {
  let gameBody = { title: req.body.title, description: req.body.description, gameAuthor: req.user.id, gameAuthorName: req.user.name, tag: req.body.tag };
  const game = new Game(gameBody);
  await game.save()
  res.redirect("/games");
}

async function show(req, res) {
  let game = await Game.findById(req.params.id).populate("tag");
  let tags = await Tag.find({});
  let reviews = game.reviews
  console.log(reviews)
  res.render("games/show", { game, title: "Game details", tags, reviews, user: req.user });
}

async function addTag(req, res) {
  let game = await Game.findById(req.params.gameId);
  let newTag = await Tag.findById(req.params.tagId);
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
  res.redirect(`/games/${req.params.gameId}`);
}
