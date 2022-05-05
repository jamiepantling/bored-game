const { redirect } = require("express/lib/response");
const request = require("request-promise");
let Game = require("../models/game");
let Tag = require("../models/tag");
const user = require("../models/user");
let User = require("../models/user");
const clientId = process.env.ATLAS_CLIENT_ID;
const rootURL = "https://api.boardgameatlas.com/api/";

module.exports = {
  index,
  new: newGame,
  create,
  show,
  addTag,
  tagSort,
  gameSort,
  query,
};

async function index(req, res) {
  if (!req.user) return res.redirect("/");
  console.log("res.locals:" + res.locals.user);
  console.log("Games controller index function");

  let games = await Game.find({}).populate("tag");
  let tags = await Tag.find({});
  games = gameSort(games);
  tags = tagSort(tags);

  res.render("games/index", {
    games,
    title: "All games",
    tags,
  });
}

async function newGame(req, res) {
  if (!req.user) return res.redirect("/");
  console.log("Games controller newGame function");
  let tags = await Tag.find({});
  tags = tagSort(tags);
  console.log(tags);
  res.render("games/new", { title: "Add new game", tags });
}

async function create(req, res) {
  if (!req.user) return res.redirect("/");
  let gameBody = {
    title: req.body.title,
    description: req.body.description,
    gameAuthor: req.user.id,
    gameAuthorName: req.user.name,
    tag: req.body.tag,
  };
  const game = new Game(gameBody);
  await game.save();
  res.redirect("/games");
}

async function show(req, res) {
  console.log("game show function");
  if (!req.user) return res.redirect("/");
  let game = await Game.findById(req.params.id).populate("tag");
  let tags = await Tag.find({});
  let reviews = game.reviews;
  console.log(reviews);
  res.render("games/show", {
    game,
    title: game.title,
    tags,
    reviews,
    user: req.user,
  });
}

async function addTag(req, res) {
  if (!req.user) return res.redirect("/");
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

function tagSort(tags) {
  return (tags = tags.sort(function (a, b) {
    let x = a.content.toLowerCase();
    let y = b.content.toLowerCase();
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  }));
}
function gameSort(games) {
  return (games = games.sort(function (a, b) {
    let x = a.title.toLowerCase();
    let y = b.title.toLowerCase();
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  }));
}
async function query(req, res) {
  console.log(req.query);
  console.log("query function");
  const boardgame = req.query.boardgame;
  console.log(boardgame);
  let body = await request(
    `${rootURL}search?name=${boardgame}&exact=true&client_id=${clientId}`
  );
  body = JSON.parse(body);
  let imgsrc = body.games[1].thumb_url;
  res.render("games/query", {
    title: "query",
    userData: body,
    imgsrc,
  });
}
