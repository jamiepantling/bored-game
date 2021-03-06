const { redirect } = require("express/lib/response");
const request = require("request-promise");
const game = require("../models/game");
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
  edit,
  update,
  delete: deleteOne,
};

async function index(req, res) {
  try {
    if (!req.user) return res.redirect("/");

    let games = await Game.find({}).populate("tag");
    let tags = await Tag.find({});

    tags = tagSort(tags);
    games = gameSort(games);

    res.render("games/index", {
      games,
      title: "All games",
      tags,
    });
  } catch (error) {
    res.send(error);
  }
}

async function newGame(req, res) {
  if (!req.user) return res.redirect("/");
  let tags = await Tag.find({});
  tags = tagSort(tags);
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
  res.redirect(`games/${game._id}`);
}

async function show(req, res) {
  if (!req.user) return res.redirect("/");
  let game = await Game.findById(req.params.id).populate("tag");
  let tags = await Tag.find({});
  let reviews = game.reviews;
  if (!game.picture) {
    let body = await request(
      `${rootURL}search?name=${game.title}&client_id=${clientId}`
    );
    body = await JSON.parse(body);
    if (body.games.length) {
      let image = body.games[0].thumb_url;
      let description = "";
      if (!game.description) {
        description = body.games[0].description;
      }
      if (
        image ===
        "https://s3-us-west-1.amazonaws.com/5cc.images/games/empty+box+thumb.jpg"
      ) {
        image = body.games[1].thumb_url;
        description = body.games[1].description;
      }
      game.picture = image;
      if (!game.description) game.description = description;
    }
  }

  await game.save();
  res.render("games/show", {
    game,
    title: game.title,
    tags,
    reviews,
    user: req.user,
  });
}

async function edit(req, res) {
  if (!req.user) return res.redirect("/");

  let game = await Game.findById(req.params.id).populate("tag");
  if (req.user.id != game.gameAuthor) {
    return res.redirect(`/games/${game._id}`);
  }
  let tags = await Tag.find({});
  tags = tagSort(tags);
  res.render("games/edit", { title: game.title, game, tags });
}

async function update(req, res) {
  if (!req.user) return res.redirect("/");
  let game = await Game.findById(req.params.id);
  game.title = req.body.title;
  game.description = req.body.description;
  game.tag = req.body.tag;
  await game.save();
  res.redirect(`/games/${game._id}`);
}

async function deleteOne(req, res) {
  if (!req.user) return res.redirect("/");
  let game = await Game.findById(req.params.id);
  if (req.user.id != game.gameAuthor) {
    return res.redirect(`/games/${game._id}`);
  }
  await game.remove();

  res.redirect("/games/");
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

// ** Below code saved for future problem solving **

// async function getImages(games) {
//   let images =[]
//   games.forEach(async function(game, idx) {
//   let text = await request(`${rootURL}search?name=${game.title}&client_id=${clientId}`)
//     images.push(text)
//     console.log(images)
//   })
//   return images
//  }

// let images =[]
// games.forEach( function(game, idx) {
//   let body =  request(
//     `${rootURL}search?name=${game.title}&client_id=${clientId}`
//   ).then(function())
//   body = await JSON.parse(body);
//   let image = body.games[0].thumb_url
//   console.log(image)
//   images.push(image)
//   console.log(images, idx)
// })

// async function index(req, res) {
//   try {

//   if (!req.user) return res.redirect("/");

//   console.log("Games controller index function");

//   let games = await Game.find({}).populate("tag");

//   let tags = await Tag.find({});
//   games = gameSort(games);
//   tags = tagSort(tags);

//   let images = getImages(games)

//   res.render("games/index", {
//     games,
//     title: "All games",
//     tags,
//     images
//   });
//   } catch (error) {
//     res.send(error)
//   }
// }
